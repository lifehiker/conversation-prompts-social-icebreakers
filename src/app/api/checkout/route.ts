import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payments are not configured. Please contact support." },
      { status: 503 }
    );
  }

  const { Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });

  const session = await auth();
  const { tier } = await req.json();

  const priceId =
    tier === "FACILITATOR"
      ? process.env.STRIPE_FACILITATOR_PRICE_ID
      : process.env.STRIPE_LIFETIME_PRICE_ID;

  if (!priceId) {
    // No price IDs configured — return a demo URL
    return NextResponse.json({
      url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/packs?demo=true`,
    });
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/packs?upgraded=true`,
    cancel_url: `${baseUrl}/packs`,
    metadata: {
      userId: session?.user?.id || "",
      tier: tier || "LIFETIME",
    },
    ...(session?.user?.email ? { customer_email: session.user.email } : {}),
  });

  return NextResponse.json({ url: checkoutSession.url });
}
