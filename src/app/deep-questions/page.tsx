import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FreeCardPreview from "@/components/FreeCardPreview";
import StickyUpgradeBar from "@/components/StickyUpgradeBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Deep Conversation Questions for Close Friends — Free Interactive Cards | Prompt",
  description:
    "Tap through 50 deep conversation questions for close friends. Free to start. Works offline. No ads, no subscription — just questions that actually go somewhere.",
  openGraph: {
    title: "Deep Conversation Questions for Close Friends",
    description: "50 deep questions that go past small talk. Free interactive cards.",
  },
};

export default async function DeepQuestionsPage() {
  let prompts: { id: string; text: string; depthLevel: "LIGHT" | "MEDIUM" | "DEEP"; order: number }[] = [];
  let totalCards = 40;

  try {
    const pack = await prisma.pack.findUnique({
      where: { slug: "old-friends" },
      include: { prompts: { orderBy: { order: "asc" }, take: 10 } },
    });
    if (pack) {
      prompts = pack.prompts;
      totalCards = pack.cardCount;
    }
  } catch {
    prompts = fallbackDeepPrompts;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <nav className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">Prompt</Link>
        <Link href="/packs" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800">
          All Packs
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">Old Friends Pack</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Deep Conversation Questions for Close Friends
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          The conversations you keep meaning to have. The questions that actually matter. These go
          well past "how's work going" — they&apos;re designed for people who already trust each
          other and want to go deeper.
        </p>

        {/* Free card preview */}
        <div className="bg-gray-50 rounded-3xl p-6 mb-12">
          <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
            Try 10 cards free — tap to advance
          </p>
          <FreeCardPreview prompts={prompts} packName="Old Friends" totalCards={totalCards} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why most &quot;deep questions&quot; lists don&apos;t work</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Most lists of deep questions are either too abstract to spark a real conversation or too
          intimate for the context you&apos;re in. You ask "what&apos;s your biggest regret?" at
          the wrong moment and the room goes quiet in the wrong way. Good deep questions have
          scaffolding — they start with something grounded and let people choose how far to go.
        </p>
        <p className="text-gray-600 mb-10 leading-relaxed">
          The Old Friends pack is built differently. It opens with questions that feel easy
          (nostalgic, funny, light), then moves to questions that require real honesty, and ends
          with the questions that only people who genuinely know each other can hold space for.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Light questions to start</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Start with memory and warmth. What&apos;s changed? What do you remember about how you
          first became friends? What&apos;s something you&apos;ve always meant to do together?
          These questions don&apos;t require vulnerability — they invite it gently.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Medium questions to build momentum</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          The middle tier is where you learn who your friend has become, not just who they were.
          How have they changed? What are they prouder of than they let on? What&apos;s something
          they wish the friendship made more room for? These questions work because they&apos;re
          specific enough to be answerable and open enough to go anywhere.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Deep questions that go somewhere real</h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          The deep end is for when you&apos;re ready: what&apos;s something they&apos;ve never told
          you even though you know each other this well? What are they carrying that they
          haven&apos;t told many people? What do they hope is still true about your friendship ten
          years from now? These are the questions that close people say they never get around to
          asking — until they have a structure that makes it feel natural.
        </p>

        <div className="bg-blue-50 rounded-2xl p-6 text-center">
          <p className="text-lg font-bold text-gray-900 mb-2">Get the full Old Friends pack</p>
          <p className="text-gray-500 mb-4">40 questions. Plus 5 other packs. $9.99 once.</p>
          <Link
            href="/packs/old-friends"
            className="inline-flex items-center justify-center h-12 px-8 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800"
          >
            Open Pack →
          </Link>
        </div>
      </div>

      <StickyUpgradeBar />
    </div>
  );
}

const fallbackDeepPrompts = [
  { id: "1", text: "What's a memory of us that still makes you laugh?", depthLevel: "LIGHT" as const, order: 1 },
  { id: "2", text: "What's changed most in your life since we last really caught up?", depthLevel: "LIGHT" as const, order: 2 },
  { id: "3", text: "What's something you remember about our early friendship that I've probably forgotten?", depthLevel: "LIGHT" as const, order: 3 },
  { id: "4", text: "How have you changed the most since we first became friends?", depthLevel: "MEDIUM" as const, order: 4 },
  { id: "5", text: "What's something you think I don't give myself enough credit for?", depthLevel: "MEDIUM" as const, order: 5 },
  { id: "6", text: "What's the most honest thing you could tell me about how you're actually doing?", depthLevel: "DEEP" as const, order: 6 },
  { id: "7", text: "What's something I know about you that almost no one else does?", depthLevel: "DEEP" as const, order: 7 },
  { id: "8", text: "What would you want me to know about who you're becoming?", depthLevel: "DEEP" as const, order: 8 },
  { id: "9", text: "What do you hope is still true about us ten years from now?", depthLevel: "DEEP" as const, order: 9 },
  { id: "10", text: "What's a version of yourself that you've had to let go of as you've gotten older?", depthLevel: "DEEP" as const, order: 10 },
];
