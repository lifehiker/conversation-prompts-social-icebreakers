import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FreeCardPreview from "@/components/FreeCardPreview";
import StickyUpgradeBar from "@/components/StickyUpgradeBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "100 Conversation Starters for Couples — Free Interactive Cards | Prompt",
  description:
    "Tap through 60 conversation starters for couples that actually go somewhere. Free preview. Works offline. No subscription — just questions that build connection.",
};

export default async function CouplesPage() {
  let prompts: { id: string; text: string; depthLevel: "LIGHT" | "MEDIUM" | "DEEP"; order: number }[] = [];
  let totalCards = 60;

  try {
    const pack = await prisma.pack.findUnique({
      where: { slug: "couples" },
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
        <Link href="/packs/couples" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800">
          Unlock Pack
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">Couples Deep Dive Pack</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Conversation Starters for Couples That Actually Go Somewhere
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          60 questions for couples who want to get past "how was your day" — on date nights,
          road trips, or just a quiet evening when you want to feel close again.
        </p>

        <div className="bg-gray-50 rounded-3xl p-6 mb-12">
          <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
            Try 10 cards free — tap to advance
          </p>
          <FreeCardPreview prompts={prompts} packName="Couples Deep Dive" totalCards={totalCards} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">The problem with most couples question lists</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Most couples question lists on the internet are one of two things: either too shallow
          ("what&apos;s your favorite movie?") or too intense too fast ("what&apos;s your biggest fear
          about us?"). Neither works. Shallow questions feel like trivia. Intense questions without
          warm-up feel like an ambush.
        </p>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Good couples conversations follow a progression. You start with warmth and memory — what
          you love, what you appreciate, what you&apos;re excited about together. You move into
          substance — dreams, alignment, needs, growth. You end with the questions that require
          real trust: the fears, the unspoken needs, the things that take genuine vulnerability to say.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">For date nights</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          The light cards work perfectly at dinner — they&apos;re warm and playful without requiring
          emotional prep. When did you first realize you really liked me? What&apos;s a trip you&apos;d
          love to take together? What&apos;s a tradition you want to start? These open doors without
          pressure.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">For long drives or quiet evenings</h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          The medium and deep cards are for when you have time and space. What do you need more of
          from me that you haven&apos;t figured out how to ask for? What&apos;s a part of your inner
          world you haven&apos;t fully let me into? These questions build intimacy when you&apos;re
          both ready for it — not as a homework assignment, but as genuine curiosity about each other.
        </p>

        <div className="bg-red-50 rounded-2xl p-6 text-center">
          <p className="text-lg font-bold text-gray-900 mb-2">Unlock the full Couples Deep Dive pack</p>
          <p className="text-gray-500 mb-4">60 questions across three depths. Plus 5 other packs. $9.99 once.</p>
          <Link
            href="/packs/couples"
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
  { id: "1", text: "What's your favorite memory of us so far?", depthLevel: "LIGHT" as const, order: 1 },
  { id: "2", text: "What's something I do that makes you feel really seen?", depthLevel: "LIGHT" as const, order: 2 },
  { id: "3", text: "When did you first realize you really liked me?", depthLevel: "LIGHT" as const, order: 3 },
  { id: "4", text: "What's something I do that helps you feel loved without words?", depthLevel: "MEDIUM" as const, order: 4 },
  { id: "5", text: "What's a dream you have that you've never fully told me about?", depthLevel: "MEDIUM" as const, order: 5 },
  { id: "6", text: "What's something you need more of from me that you haven't figured out how to ask for?", depthLevel: "MEDIUM" as const, order: 6 },
  { id: "7", text: "What's something you've never told me because you weren't sure how I'd receive it?", depthLevel: "DEEP" as const, order: 7 },
  { id: "8", text: "When do you feel most alone, even in our relationship?", depthLevel: "DEEP" as const, order: 8 },
  { id: "9", text: "What does safety feel like to you in a relationship — and do you feel it with me?", depthLevel: "DEEP" as const, order: 9 },
  { id: "10", text: "If you could ask me anything without worrying about my reaction, what would it be?", depthLevel: "DEEP" as const, order: 10 },
];
