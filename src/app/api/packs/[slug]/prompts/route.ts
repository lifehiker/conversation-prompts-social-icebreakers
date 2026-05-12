import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const pack = await prisma.pack.findUnique({
    where: { slug },
    include: {
      prompts: { orderBy: { order: "asc" } },
    },
  });

  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  return NextResponse.json(pack);
}
