import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // Payment Link uses client_reference_id for the wedding ID
      const weddingId = session.client_reference_id || session.metadata?.wedding_id;

      if (weddingId) {
        // One-time payment: upgrade to premium
        await supabase
          .from("weddings")
          .update({
            plan: "premium",
            stripe_customer_id: session.customer as string,
          })
          .eq("id", weddingId);

        // Log the event
        await supabase.from("subscription_events").insert({
          wedding_id: weddingId,
          stripe_event_id: event.id,
          event_type: event.type,
          payload: event.data.object as Record<string, unknown>,
        });
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const customerId = charge.customer as string;
      if (customerId) {
        // Downgrade on refund
        await supabase
          .from("weddings")
          .update({ plan: "free" })
          .eq("stripe_customer_id", customerId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
