import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const { Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, tier } = session.metadata || {};

    if (userId && tier) {
      try {
        // Create purchase record
        await prisma.purchase.create({
          data: {
            userId,
            stripeSessionId: session.id,
            tier: tier === "FACILITATOR" ? "FACILITATOR" : "LIFETIME",
          },
        });

        // Send confirmation email if Resend is configured
        if (process.env.RESEND_API_KEY) {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);

          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user?.email) {
            await resend.emails.send({
              from: process.env.EMAIL_FROM || "Prompt <noreply@example.com>",
              to: user.email,
              subject: "You unlocked Prompt — here's what you have now",
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                  <h1 style="font-size: 24px; font-weight: bold; color: #111;">You're unlocked.</h1>
                  <p style="color: #555; font-size: 16px;">
                    Thanks for purchasing Prompt${tier === "FACILITATOR" ? " (Facilitator Pack)" : ""}!
                    You now have access to all 6 conversation card packs.
                  </p>
                  <ul style="color: #555; font-size: 15px; line-height: 2;">
                    <li>First Date — 50 cards</li>
                    <li>Couples Deep Dive — 60 cards</li>
                    <li>Team Icebreaker — 40 cards</li>
                    <li>Road Trip — 35 cards</li>
                    <li>Dinner Party — 35 cards</li>
                    <li>Old Friends — 40 cards</li>
                  </ul>
                  <a href="${process.env.NEXTAUTH_URL || "https://app.prompt.so"}/packs"
                     style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
                    Open your packs
                  </a>
                  <p style="color: #999; font-size: 13px; margin-top: 24px;">
                    No subscription. No renewals. These are yours forever.
                  </p>
                </div>
              `,
            });
          }
        }
      } catch (err) {
        console.error("Failed to process webhook:", err);
        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
