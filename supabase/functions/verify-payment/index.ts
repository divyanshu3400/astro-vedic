/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

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

interface PaymentVerificationRequest {
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
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")!;
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not configured");
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (req.method === "POST" && action === "create-order") {
      const { amount, receipt } = await req.json();

      const orderData = {
        amount: amount * 100,
        currency: "INR",
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1,
      };

      const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create order: ${error}`);
      }

      const order: RazorpayOrderResponse = await response.json();

      return new Response(JSON.stringify({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: RAZORPAY_KEY_ID,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && action === "verify-payment") {
      const data: PaymentVerificationRequest = await req.json();
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = data;

      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const encoder = new TextEncoder();
      const keyData = encoder.encode(RAZORPAY_KEY_SECRET);
      const msgData = encoder.encode(body);

      const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign("HMAC", key, msgData);

      // ✅ Correct: hex encoding (Razorpay uses hex, not base64)
      const expectedSignature = Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (expectedSignature !== razorpay_signature) {
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid signature",
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const updateResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/bookings?id=eq.${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation",
          },
          body: JSON.stringify({
            payment_id: razorpay_payment_id,
            payment_status: "paid",
            order_id: razorpay_order_id,
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update booking");
      }

      return new Response(JSON.stringify({
        success: true,
        message: "Payment verified successfully",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    // ✅ Fix 3: narrow 'unknown' error type
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error:", message);
    return new Response(JSON.stringify({
      success: false,
      error: message,
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});