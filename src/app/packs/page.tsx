import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "All Conversation Card Packs | Prompt",
  description: "Browse all 6 context-specific conversation card packs. First Date is free — all others unlock for $9.99 once.",
};

export const revalidate = 3600;

const contextColors: Record<string, string> = {
  Dating: "bg-pink-50 text-pink-700",
  Couples: "bg-red-50 text-red-700",
  Work: "bg-blue-50 text-blue-700",
  Travel: "bg-yellow-50 text-yellow-700",
  Social: "bg-green-50 text-green-700",
  Friendship: "bg-purple-50 text-purple-700",
};

export default async function PacksPage() {
  let packs: { id: string; slug: string; name: string; description: string; context: string; isPremium: boolean; cardCount: number }[] = [];
  try {
    packs = await prisma.pack.findMany({ orderBy: { isPremium: "asc" } });
  } catch {
    packs = staticPacks;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">Prompt</Link>
        <Link href="/packs/first-date" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800">
          Try Free
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">All Packs</h1>
        <p className="text-gray-500 text-lg mb-12">
          Every pack is sorted by context. Every question within a pack progresses from Light to Deep.
          First Date is completely free — no account required.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packs.map((pack) => (
            <Link
              key={pack.slug}
              href={`/packs/${pack.slug}`}
              className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${contextColors[pack.context] || "bg-gray-100 text-gray-600"}`}>
                  {pack.context}
                </span>
                {!pack.isPremium ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                    Free — no login
                  </span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                    $9.99 unlock
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {pack.name}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{pack.description}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium">{pack.cardCount} cards</p>
                <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                  {pack.isPremium ? "Preview →" : "Start now →"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-gray-900 rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Unlock all 5 premium packs</h2>
          <p className="text-gray-300 mb-6">All 260+ cards. Works offline. No subscription. One-time $9.99.</p>
          <Link
            href="/packs/couples"
            className="inline-flex items-center justify-center h-12 px-8 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Unlock All — $9.99
          </Link>
        </div>
      </div>
    </div>
  );
}

const staticPacks = [
  { id: "1", slug: "first-date", name: "First Date", description: "50 conversation starters for first dates that actually go somewhere.", context: "Dating", isPremium: false, cardCount: 50 },
  { id: "2", slug: "couples", name: "Couples Deep Dive", description: "60 questions to go deeper with your partner.", context: "Couples", isPremium: true, cardCount: 60 },
  { id: "3", slug: "team-icebreaker", name: "Team Icebreaker", description: "40 questions for team meetings and offsites.", context: "Work", isPremium: true, cardCount: 40 },
  { id: "4", slug: "road-trip", name: "Road Trip", description: "35 conversation starters for the open road.", context: "Travel", isPremium: true, cardCount: 35 },
  { id: "5", slug: "dinner-party", name: "Dinner Party", description: "35 conversation starters for adults.", context: "Social", isPremium: true, cardCount: 35 },
  { id: "6", slug: "old-friends", name: "Old Friends", description: "40 questions for the friends you've known forever.", context: "Friendship", isPremium: true, cardCount: 40 },
];
