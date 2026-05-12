import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FreeCardPreview from "@/components/FreeCardPreview";
import StickyUpgradeBar from "@/components/StickyUpgradeBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Dinner Party Icebreakers for Adults — Free Interactive Cards | Prompt",
  description:
    "Tap through 35 dinner party conversation starters for adults. Free preview. No download — just pull it out at the table and tap to advance.",
};

export default async function DinnerPartyPage() {
  let prompts: { id: string; text: string; depthLevel: "LIGHT" | "MEDIUM" | "DEEP"; order: number }[] = [];
  let totalCards = 35;

  try {
    const pack = await prisma.pack.findUnique({
      where: { slug: "dinner-party" },
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
        <Link href="/packs/dinner-party" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800">
          Unlock Pack
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">Dinner Party Pack</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Dinner Party Icebreakers That Actually Make the Night Memorable
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          35 conversation starters for adults that work at a dinner table with people who
          know each other well — or barely at all. No embarrassing party game energy.
          Just interesting questions.
        </p>

        <div className="bg-gray-50 rounded-3xl p-6 mb-12">
          <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
            Try 10 cards free — tap to advance
          </p>
          <FreeCardPreview prompts={prompts} packName="Dinner Party" totalCards={totalCards} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">The dinner party conversation problem</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Dinner parties either settle into comfortable small talk among the people who already
          know each other, leaving newer guests on the outside — or they stall in the first hour
          because no one wants to be the person who "makes it weird" by going somewhere real.
          A well-timed question, framed the right way, does neither. It invites rather than forces.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Start with food and culture</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          The early cards are grounded in dinner itself — food, culture, memory, strong opinions
          about things that don&apos;t matter. What&apos;s the most underrated cuisine? What dish
          says everything about where you come from? These are high-engagement because everyone has
          an answer and no one feels exposed.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Move toward the interesting stuff</h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          The medium questions move toward values, beliefs, and the genuinely interesting versions
          of each person at the table. What do you think makes a gathering actually memorable?
          What&apos;s a belief you held a few years ago that you no longer hold? What&apos;s
          a problem in the world you think is actually solvable? These generate real discussion.
        </p>

        <div className="bg-green-50 rounded-2xl p-6 text-center">
          <p className="text-lg font-bold text-gray-900 mb-2">Unlock the Dinner Party pack</p>
          <p className="text-gray-500 mb-4">35 cards. Plus 5 other packs. $9.99 once.</p>
          <Link
            href="/packs/dinner-party"
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
  { id: "1", text: "What's the most memorable dinner you've ever had — anywhere, with anyone?", depthLevel: "LIGHT" as const, order: 1 },
  { id: "2", text: "What's the most underrated cuisine, in your opinion?", depthLevel: "LIGHT" as const, order: 2 },
  { id: "3", text: "What's a dish that says everything about where you come from?", depthLevel: "LIGHT" as const, order: 3 },
  { id: "4", text: "What's a topic you think most people avoid at dinner tables but shouldn't?", depthLevel: "MEDIUM" as const, order: 4 },
  { id: "5", text: "What do you think makes a gathering of people actually memorable?", depthLevel: "MEDIUM" as const, order: 5 },
  { id: "6", text: "What's something you believe about friendship that took you a while to figure out?", depthLevel: "MEDIUM" as const, order: 6 },
  { id: "7", text: "What's something you've stopped pretending to care about?", depthLevel: "DEEP" as const, order: 7 },
  { id: "8", text: "What does a really well-lived life look like to you, specifically?", depthLevel: "DEEP" as const, order: 8 },
  { id: "9", text: "What's a value you'd stand on even if it cost you something?", depthLevel: "DEEP" as const, order: 9 },
  { id: "10", text: "If this were the last dinner party of your life, what would you want to make sure got said?", depthLevel: "DEEP" as const, order: 10 },
];
