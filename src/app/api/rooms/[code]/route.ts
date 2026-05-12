import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const room = await prisma.room.findUnique({ where: { code } });
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  // Also fetch pack slug
  const pack = await prisma.pack.findUnique({ where: { id: room.packId } });

  return NextResponse.json({
    code: room.code,
    packId: room.packId,
    packSlug: pack?.slug,
    currentCardIndex: room.currentCardIndex,
    lastActivity: room.lastActivity,
  });
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const room = await prisma.room.findUnique({ where: { code } });
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const updated = await prisma.room.update({
    where: { code },
    data: {
      currentCardIndex: room.currentCardIndex + 1,
      lastActivity: new Date(),
    },
  });

  return NextResponse.json({ currentCardIndex: updated.currentCardIndex });
}
