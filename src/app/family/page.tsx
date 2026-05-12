import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FreeCardPreview from "@/components/FreeCardPreview";
import StickyUpgradeBar from "@/components/StickyUpgradeBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Family Dinner Table Questions for All Ages — Free Interactive Cards | Prompt",
  description:
    "Tap through conversation starters for family dinners. Light, medium, and deep questions that work for adults and teens alike. Free preview.",
};

export default async function FamilyPage() {
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
          Family Dinner Table Questions for All Ages
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          Questions that work when you&apos;re sitting around a table with people aged 15 to 75.
          Light enough that nobody feels put on the spot. Interesting enough that everyone
          actually wants to answer.
        </p>

        <div className="bg-gray-50 rounded-3xl p-6 mb-12">
          <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
            Try 10 cards free — tap to advance
          </p>
          <FreeCardPreview prompts={prompts} packName="Dinner Party" totalCards={totalCards} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why family dinner conversation stalls</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          At most family dinners, conversation defaults to life updates (school, work, sports)
          and then goes quiet when the updates run out. The generational gap between a 16-year-old
          and a 65-year-old is real — but it&apos;s not that they have nothing in common. It&apos;s
          that nobody has a question that bridges the gap in a way that feels natural rather than
          forced.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions that work across generations</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          The best family dinner questions are universal — they work because everyone has an answer,
          not because everyone shares a reference point. What&apos;s the most memorable dinner
          you&apos;ve ever had? What&apos;s a dish that says everything about where you come from?
          If you could cook with any person, who would it be? A 17-year-old and a 70-year-old both
          have interesting answers to these.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Going deeper with the right family</h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          If your family is ready for it, the medium and deep cards create the kind of conversations
          that end up being the ones people remember. What&apos;s something you used to believe
          strongly that you no longer do? What would your life look like if you felt fully free to
          design it? These aren&apos;t therapy questions — they&apos;re the questions that close
          families say they keep meaning to have.
        </p>

        <div className="bg-orange-50 rounded-2xl p-6 text-center">
          <p className="text-lg font-bold text-gray-900 mb-2">Make your next family dinner memorable</p>
          <p className="text-gray-500 mb-4">Dinner Party pack + 5 others. $9.99 once.</p>
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
  { id: "2", text: "What's a dish that says everything about where you come from?", depthLevel: "LIGHT" as const, order: 2 },
  { id: "3", text: "If you could cook dinner with any person, living or historical, who and what would you make?", depthLevel: "LIGHT" as const, order: 3 },
  { id: "4", text: "What's something you used to believe strongly that you no longer do?", depthLevel: "MEDIUM" as const, order: 4 },
  { id: "5", text: "What do you think makes a gathering of people actually memorable?", depthLevel: "MEDIUM" as const, order: 5 },
  { id: "6", text: "What's a habit that genuinely improves your life that most people don't do?", depthLevel: "MEDIUM" as const, order: 6 },
  { id: "7", text: "What does a really well-lived life look like to you, specifically?", depthLevel: "DEEP" as const, order: 7 },
  { id: "8", text: "What's a value you'd stand on even if it cost you something?", depthLevel: "DEEP" as const, order: 8 },
];
