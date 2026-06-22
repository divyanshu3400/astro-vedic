// supabase/functions/razorpay/index.ts

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

interface CreateOrderRequest {
  serviceId: string;
  receipt?: string;
}

interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // ─── CREATE ORDER ────────────────────────────────────────────────────────
    if (req.method === "POST" && action === "create-order") {
      const body: CreateOrderRequest = await req.json();
      const { serviceId, receipt } = body;

      if (!serviceId) {
        throw new Error("Service ID is required");
      }

      console.log("Fetching service with ID:", serviceId);

      const serviceResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/services?id=eq.${encodeURIComponent(serviceId)}&select=price_amount,currency,title`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!serviceResponse.ok) {
        const errorText = await serviceResponse.text();
        throw new Error(`Failed to fetch service details (${serviceResponse.status}): ${errorText}`);
      }

      const services = await serviceResponse.json();
      console.log("Services response:", JSON.stringify(services));

      if (!services || services.length === 0) {
        throw new Error(`Service not found: ${serviceId}`);
      }

      const service = services[0];
      const amountInPaise = service.price_amount * 100;

      console.log("Creating Razorpay order for:", amountInPaise, "paise");

      const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

      const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: service.currency || "INR",
          receipt: receipt || `receipt_${Date.now()}`,
          payment_capture: 1,
        }),
      });

      if (!razorpayResponse.ok) {
        const error = await razorpayResponse.text();
        throw new Error(`Failed to create Razorpay order: ${error}`);
      }

      const order: RazorpayOrderResponse = await razorpayResponse.json();
      console.log("Razorpay order created:", order.id);

      return new Response(
        JSON.stringify({
          success: true,
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          key_id: RAZORPAY_KEY_ID,
          service_id: serviceId,
          service_title: service.title,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── VERIFY PAYMENT ──────────────────────────────────────────────────────
    if (req.method === "POST" && action === "verify-payment") {
      let data: VerifyPaymentRequest;
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const text = await req.text();
        const params = new URLSearchParams(text);
        data = {
          razorpay_order_id: params.get('razorpay_order_id') ?? '',
          razorpay_payment_id: params.get('razorpay_payment_id') ?? '',
          razorpay_signature: params.get('razorpay_signature') ?? '',
          bookingId: new URL(req.url).searchParams.get('bookingId') ?? '',
        };
      } else {
        data = await req.json();
      }
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = data;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
        throw new Error("Missing required payment verification fields");
      }

      // ✅ FIXED: Razorpay signature is hex-encoded HMAC-SHA256, NOT base64
      const message = `${razorpay_order_id}|${razorpay_payment_id}`;
      const encoder = new TextEncoder();

      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(RAZORPAY_KEY_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(message)
      );

      // Convert buffer → lowercase hex string (matches Razorpay's format)
      const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      console.log("Expected signature:", expectedSignature);
      console.log("Received signature:", razorpay_signature);

      if (expectedSignature !== razorpay_signature) {
        console.error("Signature mismatch — payment verification failed");
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid signature. Payment verification failed.",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Signature valid — update booking status in Supabase
      const updateResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/bookings?id=eq.${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Content-Type": "application/json",
            "Prefer": "return=representation",
          },
          body: JSON.stringify({
            payment_id: razorpay_payment_id,
            payment_status: "paid",
            order_id: razorpay_order_id,
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error("Failed to update booking:", errorText);
        throw new Error("Payment verified but failed to update booking status");
      }

      console.log("Booking updated successfully:", bookingId);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment verified successfully",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── UNKNOWN ACTION ──────────────────────────────────────────────────────
    return new Response(
      JSON.stringify({ error: `Unknown action: ${action}` }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});