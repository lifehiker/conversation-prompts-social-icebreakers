import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

const features = [
  {
    icon: "🗂",
    title: "6 Context Packs",
    description: "First dates, couples, work teams, road trips, dinner parties, old friends — each built for the moment.",
  },
  {
    icon: "📵",
    title: "Works Offline",
    description: "Install as a PWA. The First Date pack works offline for everyone. All packs cache after unlock.",
  },
  {
    icon: "💳",
    title: "One-Time $9.99",
    description: "No subscription. No monthly charge. Pay once, use forever — even on a plane.",
  },
  {
    icon: "🔗",
    title: "Share a Room",
    description: "Start a session with a 6-character code. You both see the same card. Either person can advance.",
  },
  {
    icon: "🎯",
    title: "Three Depths",
    description: "Every pack has Light, Medium, and Deep questions. Start anywhere and go as far as you want.",
  },
  {
    icon: "🚫",
    title: "Zero Ads",
    description: "No banners, no interruptions, no sponsored cards. Just the conversation.",
  },
];

const seoLinks = [
  { href: "/deep-questions", label: "Deep Conversation Questions" },
  { href: "/first-date", label: "First Date Questions" },
  { href: "/couples", label: "Conversation Starters for Couples" },
  { href: "/work-meetings", label: "Work Meeting Icebreakers" },
  { href: "/road-trip", label: "Road Trip Starters" },
  { href: "/dinner-party", label: "Dinner Party Questions" },
  { href: "/offline", label: "Offline Card Game App" },
  { href: "/card-game", label: "Digital Card Game App" },
  { href: "/family", label: "Family Dinner Questions" },
  { href: "/remote-team", label: "Remote Team Icebreakers" },
];

export default async function HomePage() {
  let packs: { id: string; slug: string; name: string; description: string; context: string; isPremium: boolean; cardCount: number }[] = [];
  try {
    packs = await prisma.pack.findMany({ orderBy: { isPremium: "asc" } });
  } catch {
    // DB not yet seeded — show static fallback
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">Prompt</Link>
        <div className="flex items-center gap-4">
          <Link href="/packs" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            All Packs
          </Link>
          <Link
            href="/packs/first-date"
            className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800"
          >
            Try Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-4">
          Conversation Cards for Real Life
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          The conversation app<br />for real moments.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          6 context-specific packs for dates, couples, work teams, road trips, and friend gatherings.
          Works offline. $9.99 once — no subscription, no ads.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/packs/first-date"
            className="inline-flex items-center justify-center h-14 px-8 bg-gray-900 text-white font-semibold text-lg rounded-full hover:bg-gray-800 transition-colors"
          >
            Try First Date Pack — Free
          </Link>
          <Link
            href="/packs"
            className="inline-flex items-center justify-center h-14 px-8 border border-gray-300 text-gray-700 font-semibold text-lg rounded-full hover:border-gray-400 hover:bg-white transition-colors"
          >
            See All Packs
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">No account required. Start immediately.</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Built for real-world moments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pack Grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          The packs
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Every pack sorted by context. Every question sorted by depth.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(packs.length > 0 ? packs : staticPacks).map((pack) => (
            <Link
              key={pack.slug}
              href={`/packs/${pack.slug}`}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {pack.context}
                </span>
                {!pack.isPremium ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    Free
                  </span>
                ) : (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    Included
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {pack.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{pack.description}</p>
              <p className="text-xs text-gray-400 font-medium">{pack.cardCount} cards</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Unlock everything. Once.</h2>
          <p className="text-gray-300 mb-8 text-lg">
            All 6 packs. All 260+ questions. Works offline. No subscription.
            The physical WNRS deck costs $30 — this is $9.99 and fits in your pocket.
          </p>
          <Link
            href="/packs"
            className="inline-flex items-center justify-center h-14 px-8 bg-white text-gray-900 font-bold text-lg rounded-full hover:bg-gray-100 transition-colors"
          >
            Unlock All Packs — $9.99
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Prompt</p>
              <p className="text-xs text-gray-500">
                Conversation cards for real-world social moments.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Packs</p>
              <ul className="space-y-2">
                <li><Link href="/packs/first-date" className="text-xs text-gray-500 hover:text-gray-900">First Date</Link></li>
                <li><Link href="/packs/couples" className="text-xs text-gray-500 hover:text-gray-900">Couples</Link></li>
                <li><Link href="/packs/team-icebreaker" className="text-xs text-gray-500 hover:text-gray-900">Team Icebreaker</Link></li>
                <li><Link href="/packs/road-trip" className="text-xs text-gray-500 hover:text-gray-900">Road Trip</Link></li>
                <li><Link href="/packs/dinner-party" className="text-xs text-gray-500 hover:text-gray-900">Dinner Party</Link></li>
                <li><Link href="/packs/old-friends" className="text-xs text-gray-500 hover:text-gray-900">Old Friends</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Use Cases</p>
              <ul className="space-y-2">
                {seoLinks.slice(0, 5).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-gray-500 hover:text-gray-900">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">More</p>
              <ul className="space-y-2">
                {seoLinks.slice(5).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-gray-500 hover:text-gray-900">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 text-center">
            <p className="text-xs text-gray-400">© 2026 Prompt. All rights reserved.</p>
          </div>
        </div>
      </footer>
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
