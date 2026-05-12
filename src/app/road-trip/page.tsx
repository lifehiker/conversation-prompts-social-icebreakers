import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FreeCardPreview from "@/components/FreeCardPreview";
import StickyUpgradeBar from "@/components/StickyUpgradeBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Road Trip Conversation Starters — Free Interactive Cards | Prompt",
  description:
    "Tap through 35 road trip conversation starters designed for long drives. Free preview. Works offline — ideal when cell signal drops.",
};

export default async function RoadTripPage() {
  let prompts: { id: string; text: string; depthLevel: "LIGHT" | "MEDIUM" | "DEEP"; order: number }[] = [];
  let totalCards = 35;

  try {
    const pack = await prisma.pack.findUnique({
      where: { slug: "road-trip" },
      include: { prompts: { orderBy: { order: "asc" }, take: 10 } },
    });
    if (pack) {
      prompts = pack.prompts;
      totalCards = pack.cardCount;
    }
  } catch {
    prompts = fallbackPrompts;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <nav className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">Prompt</Link>
        <Link href="/packs/road-trip" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800">
          Unlock Pack
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">Road Trip Pack</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Road Trip Conversation Starters for Long Drives
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          35 questions for the open road — from light and funny to genuinely interesting.
          Cached offline so they work when you lose signal somewhere between nowhere and somewhere.
        </p>

        <div className="bg-gray-50 rounded-3xl p-6 mb-12">
          <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
            Try 10 cards free — tap to advance
          </p>
          <FreeCardPreview prompts={prompts} packName="Road Trip" totalCards={totalCards} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why road trips are uniquely good for conversation</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          There&apos;s something about a car that makes people open up. You&apos;re not face-to-face,
          so the pressure is lower. You have time — not a discrete window of "how long until we
          can reasonably leave?" The conversation can go somewhere and come back, breathe, pause.
          Road trips are one of the few situations where the format actively supports depth.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Start with the easy ones</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Road trip food debates. The best and worst roadside stops. Playlist philosophy. The most
          spontaneous thing you&apos;ve ever done while traveling. These are fun, low-stakes, and
          reveal a lot about how someone moves through the world.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Let it go deeper when it wants to</h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          Has a trip ever shifted how you think about your life? Is there a place that felt like
          it could have been home? What does getting away from your life actually do for you?
          These aren&apos;t forced — they follow naturally from the lighter questions and work
          best when someone brings them up on mile 200 when you&apos;re both a little quiet.
        </p>

        <div className="bg-yellow-50 rounded-2xl p-6 text-center">
          <p className="text-lg font-bold text-gray-900 mb-2">Works offline — perfect for road trips</p>
          <p className="text-gray-500 mb-4">All 35 cards cached after unlock. No signal needed.</p>
          <Link
            href="/packs/road-trip"
            className="inline-flex items-center justify-center h-12 px-8 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800"
          >
            Unlock All Packs — $9.99 →
          </Link>
        </div>
      </div>

      <StickyUpgradeBar />
    </div>
  );
}

const fallbackPrompts = [
  { id: "1", text: "What's the best road trip food — and what's the absolute worst?", depthLevel: "LIGHT" as const, order: 1 },
  { id: "2", text: "What's the most random roadside attraction you've ever visited?", depthLevel: "LIGHT" as const, order: 2 },
  { id: "3", text: "What's your road trip playlist philosophy — full control or shared shuffle?", depthLevel: "LIGHT" as const, order: 3 },
  { id: "4", text: "What's the most spontaneous thing you've ever done while traveling?", depthLevel: "LIGHT" as const, order: 4 },
  { id: "5", text: "What do you think makes travel actually meaningful rather than just a vacation?", depthLevel: "MEDIUM" as const, order: 5 },
  { id: "6", text: "Has traveling ever changed the way you see something in your everyday life?", depthLevel: "MEDIUM" as const, order: 6 },
  { id: "7", text: "What's somewhere you've been that completely defied your expectations?", depthLevel: "MEDIUM" as const, order: 7 },
  { id: "8", text: "What's something you're looking for from this trip — beyond just fun?", depthLevel: "DEEP" as const, order: 8 },
  { id: "9", text: "What does getting away from your life actually do for you?", depthLevel: "DEEP" as const, order: 9 },
  { id: "10", text: "What's something you hope to feel by the end of this trip that you didn't feel at the start?", depthLevel: "DEEP" as const, order: 10 },
];
