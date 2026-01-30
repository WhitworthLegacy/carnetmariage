import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  try {
    const { weddingId, email, amount } = await request.json();

    if (!weddingId || !email || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      client_reference_id: weddingId,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Carnet Complet — Accès à vie",
              description: "Toutes les fonctionnalités premium de CarnetMariage, paiement unique",
            },
            unit_amount: amount, // in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
