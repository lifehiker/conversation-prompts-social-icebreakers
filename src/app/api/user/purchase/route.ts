import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ hasPurchase: false });
  }

  const purchase = await prisma.purchase.findFirst({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    hasPurchase: !!purchase,
    tier: purchase?.tier || null,
  });
}
