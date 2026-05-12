import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FreeCardPreview from "@/components/FreeCardPreview";
import StickyUpgradeBar from "@/components/StickyUpgradeBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Digital Conversation Card Game App — Prompt vs Physical Decks | Prompt",
  description:
    "How does Prompt compare to physical conversation card games like We're Not Really Strangers? Interactive digital cards, offline mode, shared rooms. $9.99 vs $30.",
};

export default async function CardGamePage() {
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
        <Link href="/packs" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800">
          See All Packs
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">Digital vs Physical</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Digital Conversation Card Game App
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          Physical card decks like We&apos;re Not Really Strangers cost $30 and only cover
          one context. Prompt has 6 context-specific packs, works offline, and costs $9.99 once.
          Here&apos;s how they compare.
        </p>

        <div className="bg-gray-50 rounded-3xl p-6 mb-12">
          <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
            Try the First Date pack free — tap to advance
          </p>
          <FreeCardPreview prompts={prompts} packName="First Date" totalCards={totalCards} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Physical card decks — what works and what doesn&apos;t</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Physical card games like We&apos;re Not Really Strangers (WNRS) proved the market.
          People will pay $30 for a physical deck of conversation cards, and that deck produces
          genuinely meaningful conversations. The brand and the format both work.
        </p>
        <p className="text-gray-600 mb-6 leading-relaxed">
          But physical decks have structural limitations. You can only carry one deck.
          If you forget it, you&apos;re out. They wear out or get lost. And they cover one
          emotional register — WNRS is intimate and vulnerable, which is perfect for some moments
          and completely wrong for a team meeting or a road trip.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Prompt — 6 contexts, always in your pocket</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-6 text-gray-500 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Physical Deck</th>
                <th className="text-center py-3 px-4 text-blue-700 font-semibold">Prompt</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Price", "$25–$35", "$9.99 once"],
                ["Contexts covered", "1", "6"],
                ["Works offline", "Yes (cards)", "Yes (PWA)"],
                ["Shared room for two", "No", "Yes"],
                ["Always with you", "No", "Yes"],
                ["Can lose/wear out", "Yes", "No"],
                ["Multiple depth levels", "Sometimes", "Yes (Light/Medium/Deep)"],
                ["Cards: total", "~150", "260+"],
              ].map(([feature, physical, prompt]) => (
                <tr key={feature} className="border-b border-gray-100">
                  <td className="py-3 pr-6 text-gray-700">{feature}</td>
                  <td className="py-3 px-4 text-center text-gray-500">{physical}</td>
                  <td className="py-3 px-4 text-center text-blue-700 font-medium">{prompt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">The co-use room — no physical equivalent</h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          The feature that physical decks literally cannot replicate: Start a room with a 6-character
          code, share the link, and both of you see the same card. Either person advances the deck.
          This works especially well when you&apos;re sitting next to each other but one person
          holds the phone, or when you&apos;re on a video call and want to do a structured
          conversation together remotely.
        </p>

        <div className="bg-gray-900 rounded-2xl p-6 text-center text-white">
          <p className="text-lg font-bold mb-2">$9.99 once — six packs, forever</p>
          <p className="text-gray-300 mb-4">Less than one physical card deck. 6x the contexts. Never wears out.</p>
          <Link
            href="/packs"
            className="inline-flex items-center justify-center h-12 px-8 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100"
          >
            See All Packs →
          </Link>
        </div>
      </div>

      <StickyUpgradeBar />
    </div>
  );
}

const fallbackPrompts = [
  { id: "1", text: "What's something you've been really into lately — hobby, show, food, anything?", depthLevel: "LIGHT" as const, order: 1 },
  { id: "2", text: "What's your favorite thing to do on a Sunday when you have no plans?", depthLevel: "LIGHT" as const, order: 2 },
  { id: "3", text: "What's something you're really proud of that doesn't show up on a resume?", depthLevel: "MEDIUM" as const, order: 3 },
  { id: "4", text: "What's something you think most people misunderstand about you?", depthLevel: "MEDIUM" as const, order: 4 },
  { id: "5", text: "What's something you want that you don't talk about much?", depthLevel: "DEEP" as const, order: 5 },
  { id: "6", text: "When do you feel most like yourself?", depthLevel: "DEEP" as const, order: 6 },
];
