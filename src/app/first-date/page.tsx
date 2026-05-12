import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FreeCardPreview from "@/components/FreeCardPreview";
import StickyUpgradeBar from "@/components/StickyUpgradeBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "50 First Date Questions That Actually Work — Free Interactive Cards | Prompt",
  description:
    "Tap through 50 first date conversation starters designed to build real connection. Free to start. Works offline. No ads, no subscription.",
};

export default async function FirstDatePage() {
  let prompts: { id: string; text: string; depthLevel: "LIGHT" | "MEDIUM" | "DEEP"; order: number }[] = [];
  let totalCards = 50;

  try {
    const pack = await prisma.pack.findUnique({
      where: { slug: "first-date" },
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
        <Link href="/packs/first-date" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800">
          Try Free
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">First Date Pack — Free</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          50 First Date Questions That Actually Work
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          Not the questions that lead to a 30-second answer and another awkward pause.
          These are conversation starters designed to build real momentum on a first date —
          no download required, works in airplane mode.
        </p>

        <div className="bg-gray-50 rounded-3xl p-6 mb-12">
          <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
            Try 10 cards free — tap to advance
          </p>
          <FreeCardPreview prompts={prompts} packName="First Date" totalCards={totalCards} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why first date conversation is hard</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Most first date advice tells you to "just be yourself" or "show interest." That&apos;s
          accurate but useless when you&apos;re 20 minutes into dinner and the conversation has
          stalled on jobs and apartments. The real problem isn&apos;t confidence — it&apos;s structure.
          Without a progression from light to substantive, conversations stay at the surface because
          there&apos;s no clear path to go deeper.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Light questions to get started</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          The first 15 cards in the First Date pack are light — current interests, travel, lifestyle,
          personality. Not trivia about their life, but genuine curiosity about who they are right now.
          What are they into lately? What does a great Sunday look like? These questions feel easy and
          reveal a lot.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Medium questions that build connection</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Cards 16–35 move into substance: what are they proud of, what have they changed their mind
          about, what does their ideal life look like? These aren&apos;t therapy questions — they&apos;re
          the questions that make someone feel seen rather than interviewed. The distinction matters.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Deep questions for when it&apos;s going well</h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          The last 15 are for when you&apos;re both leaning in. What do they want that they don&apos;t
          talk about? When do they feel most like themselves? What would they want you to understand
          about them before deciding if you like them? If you get to these, the date went well.
        </p>

        <div className="bg-green-50 rounded-2xl p-6 text-center">
          <p className="text-lg font-bold text-gray-900 mb-2">The entire First Date pack is free</p>
          <p className="text-gray-500 mb-4">All 50 cards. No login. No account. Start now.</p>
          <Link
            href="/packs/first-date"
            className="inline-flex items-center justify-center h-12 px-8 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800"
          >
            Open First Date Pack — Free →
          </Link>
        </div>
      </div>

      <StickyUpgradeBar />
    </div>
  );
}

const fallbackPrompts = [
  { id: "1", text: "What's something you've been really into lately — hobby, show, food, anything?", depthLevel: "LIGHT" as const, order: 1 },
  { id: "2", text: "Where did you grow up, and what's one thing you miss about it?", depthLevel: "LIGHT" as const, order: 2 },
  { id: "3", text: "What's your favorite thing to do on a Sunday when you have no plans?", depthLevel: "LIGHT" as const, order: 3 },
  { id: "4", text: "What's the best trip you've ever taken?", depthLevel: "LIGHT" as const, order: 4 },
  { id: "5", text: "What does a genuinely great day look like for you?", depthLevel: "MEDIUM" as const, order: 5 },
  { id: "6", text: "What's something you're really proud of that doesn't show up on a resume?", depthLevel: "MEDIUM" as const, order: 6 },
  { id: "7", text: "What's something you think most people misunderstand about you?", depthLevel: "MEDIUM" as const, order: 7 },
  { id: "8", text: "What's something you want that you don't talk about much?", depthLevel: "DEEP" as const, order: 8 },
  { id: "9", text: "When do you feel most like yourself?", depthLevel: "DEEP" as const, order: 9 },
  { id: "10", text: "What would you want someone to truly understand about you before they decide if they like you?", depthLevel: "DEEP" as const, order: 10 },
];
