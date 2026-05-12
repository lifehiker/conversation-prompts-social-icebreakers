import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  const { packId, packSlug } = await req.json();

  let resolvedPackId = packId;

  if (!resolvedPackId && packSlug) {
    const pack = await prisma.pack.findUnique({ where: { slug: packSlug } });
    if (!pack) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 });
    }
    resolvedPackId = pack.id;
  }

  if (!resolvedPackId) {
    return NextResponse.json({ error: "packId is required" }, { status: 400 });
  }

  // Generate unique code
  let code = generateCode();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.room.findUnique({ where: { code } });
    if (!existing) break;
    code = generateCode();
    attempts++;
  }

  const room = await prisma.room.create({
    data: { code, packId: resolvedPackId },
  });

  return NextResponse.json({ code: room.code, packId: room.packId });
}
