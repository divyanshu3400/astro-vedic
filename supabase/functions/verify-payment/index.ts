import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
  const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  log("Config check", {
    hasRazorpayKey: !!RAZORPAY_KEY_ID,
    hasRazorpaySecret: !!RAZORPAY_KEY_SECRET,
    hasSupabaseUrl: !!SUPABASE_URL,
    hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
    keyPrefix: RAZORPAY_KEY_ID?.substring(0, 8)
  });

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return errorResponse("Razorpay credentials not configured", 500);
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return errorResponse("Supabase credentials not configured", 500);
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  log("Request", { method: req.method, action, url: req.url });

  try {
    if (req.method === "POST" && action === "create-order") {
      return await handleCreateOrder(req, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    }

    if (req.method === "POST" && action === "verify-payment") {
      return await handleVerifyPayment(req, RAZORPAY_KEY_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    }

    return errorResponse(`Unknown action: ${action}`, 400);
  } catch (error) {
    log("Error", error);
    return errorResponse(error instanceof Error ? error.message : "Unexpected error", 500);
  }
});

function log(label: string, data: unknown) {
  console.log(`[${new Date().toISOString()}] [${label}]`, typeof data === 'object' ? JSON.stringify(data) : data);
}

function errorResponse(message: string, status: number) {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function successResponse(data: Record<string, unknown>) {
  return new Response(
    JSON.stringify({ success: true, ...data }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleCreateOrder(
  req: Request,
  keyId: string,
  keySecret: string,
  supabaseUrl: string,
  serviceKey: string
): Promise<Response> {
  const body = await req.json();
  const { serviceId, receipt } = body as { serviceId: string; receipt?: string };

  if (!serviceId) {
    return errorResponse("Service ID is required", 400);
  }

  log("Fetching service", { serviceId });

  const serviceRes = await fetch(
    `${supabaseUrl}/rest/v1/services?id=eq.${encodeURIComponent(serviceId)}&select=price_amount,currency,title`,
    {
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "apikey": serviceKey,
      },
    }
  );

  if (!serviceRes.ok) {
    const err = await serviceRes.text();
    log("Service fetch failed", { status: serviceRes.status, error: err });
    return errorResponse(`Service not found: ${serviceId}`, 404);
  }

  const services = await serviceRes.json();
  if (!services?.length) {
    return errorResponse(`Service not found: ${serviceId}`, 404);
  }

  const service = services[0];
  const amountPaise = service.price_amount * 100;
  log("Service found", { title: service.title, amountPaise, currency: service.currency });

  const auth = btoa(`${keyId}:${keySecret}`);
  const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: service.currency || "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
    }),
  });

  if (!orderRes.ok) {
    const err = await orderRes.text();
    log("Order creation failed", { status: orderRes.status, error: err });
    return errorResponse(`Failed to create order: ${err}`, 500);
  }

  const order = await orderRes.json();
  log("Order created", { orderId: order.id, amount: order.amount });

  return successResponse({
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    key_id: keyId,
    service_id: serviceId,
    service_title: service.title,
  });
}

async function handleVerifyPayment(
  req: Request,
  keySecret: string,
  supabaseUrl: string,
  serviceKey: string
): Promise<Response> {
  const contentType = req.headers.get('content-type') || '';
  let data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; bookingId: string };

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

  log("Verification request", { orderId: razorpay_order_id, paymentId: razorpay_payment_id, bookingId, sigLength: razorpay_signature?.length });

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
    return errorResponse("Missing required fields", 400);
  }

  const message = `${razorpay_order_id}|${razorpay_payment_id}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(keySecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const receivedSignature = razorpay_signature.toLowerCase();
  const expectedLower = expectedSignature.toLowerCase();

  log("Signature comparison", {
    message,
    expected: expectedLower,
    received: receivedSignature,
    match: expectedLower === receivedSignature
  });

  if (expectedLower !== receivedSignature) {
    log("Signature mismatch");
    return errorResponse("Invalid signature", 400);
  }

  log("Signature verified, updating booking", { bookingId });

  const updateRes = await fetch(
    `${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}`,
    {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "apikey": serviceKey,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        payment_id: razorpay_payment_id,
        payment_status: "paid",
        order_id: razorpay_order_id,
        status: "confirmed",
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.text();
    log("Booking update failed", { status: updateRes.status, error: err });
    return errorResponse("Payment verified but update failed", 500);
  }

  const updatedBookings = await updateRes.json();
  log("Booking updated successfully", { booking: updatedBookings });

  return successResponse({
    message: "Payment verified successfully",
    payment_id: razorpay_payment_id,
    order_id: razorpay_order_id,
  });
}
