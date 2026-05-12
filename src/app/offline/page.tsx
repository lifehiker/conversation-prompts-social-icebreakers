import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FreeCardPreview from "@/components/FreeCardPreview";
import StickyUpgradeBar from "@/components/StickyUpgradeBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Party Game App That Works Without WiFi — Prompt | Offline Conversation Cards",
  description:
    "Prompt works offline as a PWA. Install it once, use it anywhere — on planes, in cars, at campsites. First Date pack is free and works without internet.",
};

export default async function OfflinePage() {
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
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">PWA — Works Offline</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          A Conversation Card App That Works Without WiFi
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          Prompt installs as a PWA on your phone. The First Date pack works offline for
          everyone. Unlock all packs and they all cache — no signal needed.
        </p>

        <div className="bg-gray-50 rounded-3xl p-6 mb-12">
          <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
            Try the free pack — works offline after first load
          </p>
          <FreeCardPreview prompts={prompts} packName="First Date" totalCards={totalCards} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why offline matters</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          The situations where you most want a conversation prompt app are exactly the situations
          where you might not have signal. Airplane mode with your partner. A cabin in the woods.
          A road trip through a dead zone. A campsite. A basement dinner party with bad WiFi.
          An app that requires internet is an app you can&apos;t rely on.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">How Prompt&apos;s offline mode works</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Prompt is a Progressive Web App (PWA). When you visit the site on your phone, you can
          add it to your home screen. The First Date pack (all 50 cards) is automatically cached
          on your first visit — so even if you lose signal, those cards still work. If you
          unlock all packs, those get cached too on first load.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to install on your phone</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          On iPhone: open Prompt in Safari, tap the Share button, then "Add to Home Screen."
          On Android: Chrome will show an "Install" prompt, or tap the menu and select "Add to
          Home Screen." Once installed, Prompt opens like a native app — no browser chrome,
          no URL bar.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">No app store needed</h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          9 of 11 tested conversation apps in a recent review had intrusive ads, were last
          updated in 2021 or earlier, and required App Store reviews to install. Prompt
          requires none of that. Open the site, add to home screen. Done. The other person
          doesn&apos;t need to install anything to join a shared room.
        </p>

        <div className="bg-gray-900 rounded-2xl p-6 text-center text-white">
          <p className="text-lg font-bold mb-2">Free to start, offline from the first visit</p>
          <p className="text-gray-300 mb-4">50 free cards. Works in airplane mode. No account required.</p>
          <Link
            href="/packs/first-date"
            className="inline-flex items-center justify-center h-12 px-8 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100"
          >
            Try First Date Pack — Free →
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
  { id: "3", text: "What's the best trip you've ever taken?", depthLevel: "LIGHT" as const, order: 3 },
  { id: "4", text: "What does a genuinely great day look like for you?", depthLevel: "MEDIUM" as const, order: 4 },
  { id: "5", text: "What's something you're really proud of that doesn't show up on a resume?", depthLevel: "MEDIUM" as const, order: 5 },
  { id: "6", text: "What's something you think most people misunderstand about you?", depthLevel: "MEDIUM" as const, order: 6 },
  { id: "7", text: "What's something you want that you don't talk about much?", depthLevel: "DEEP" as const, order: 7 },
  { id: "8", text: "When do you feel most like yourself?", depthLevel: "DEEP" as const, order: 8 },
  { id: "9", text: "What would you do differently if you weren't afraid of what people thought?", depthLevel: "DEEP" as const, order: 9 },
  { id: "10", text: "What would you want someone to truly understand about you before they decide if they like you?", depthLevel: "DEEP" as const, order: 10 },
];
