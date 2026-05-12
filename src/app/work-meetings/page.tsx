import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FreeCardPreview from "@/components/FreeCardPreview";
import StickyUpgradeBar from "@/components/StickyUpgradeBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Icebreaker Questions for Work Meetings — Free Interactive Cards | Prompt",
  description:
    "Tap through 40 icebreaker questions for work meetings and team offsites. Free preview. No download, no subscription. Works on any device.",
};

export default async function WorkMeetingsPage() {
  let prompts: { id: string; text: string; depthLevel: "LIGHT" | "MEDIUM" | "DEEP"; order: number }[] = [];
  let totalCards = 40;

  try {
    const pack = await prisma.pack.findUnique({
      where: { slug: "team-icebreaker" },
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
        <Link href="/packs/team-icebreaker" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800">
          Unlock Pack
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">Team Icebreaker Pack</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Icebreaker Questions for Work Meetings That Don&apos;t Feel Forced
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          40 questions for team meetings, kickoffs, and offsites that feel professional but
          actually build connection. No download required. Works on any device.
        </p>

        <div className="bg-gray-50 rounded-3xl p-6 mb-12">
          <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
            Try 10 cards free — tap to advance
          </p>
          <FreeCardPreview prompts={prompts} packName="Team Icebreaker" totalCards={totalCards} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why most work icebreakers fail</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          "Tell us a fun fact about yourself" produces one of three outcomes: the person who
          says something forgettable, the person who tries too hard, or the 20 seconds of silence
          while everyone tries to think of something. It fails because it&apos;s unspecific — a good
          question gives you something to answer, not a blank prompt to fill.
        </p>
        <p className="text-gray-600 mb-6 leading-relaxed">
          The Team Icebreaker pack uses questions that are specific enough to be answerable and
          interesting enough to actually spark conversation. What app or tool has made your work
          life noticeably better? What&apos;s a skill outside your job description that you quietly
          bring to your work? What type of work puts you in a flow state? These are questions that
          people actually want to answer.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">For quarterly offsites</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          The medium and deep questions work well for longer sessions where teams are trying to
          build real cohesion. What does support from teammates look like to you when things get
          hard? What does psychological safety mean to you in a team setting? These questions
          create the kind of mutual understanding that makes teams actually function better.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">For facilitators and HR</h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          The Facilitator Pack ($24.99 one-time) adds presentation mode — large text, no
          navigation chrome, designed to display on a TV or screen share. You run the session,
          the team responds, nobody needs to install anything. The pack is yours permanently,
          usable with every team you work with.
        </p>

        <div className="bg-blue-50 rounded-2xl p-6 text-center">
          <p className="text-lg font-bold text-gray-900 mb-2">Unlock the Team Icebreaker pack</p>
          <p className="text-gray-500 mb-4">40 questions. Professional facilitator mode available. $9.99 once.</p>
          <Link
            href="/packs/team-icebreaker"
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
  { id: "1", text: "What's something you worked on recently that you're genuinely proud of?", depthLevel: "LIGHT" as const, order: 1 },
  { id: "2", text: "What's your go-to snack when you're deep in focus mode?", depthLevel: "LIGHT" as const, order: 2 },
  { id: "3", text: "What app or tool has made your work life noticeably better?", depthLevel: "LIGHT" as const, order: 3 },
  { id: "4", text: "What's a skill outside your job description that you quietly bring to your work?", depthLevel: "LIGHT" as const, order: 4 },
  { id: "5", text: "What type of work puts you in a flow state?", depthLevel: "MEDIUM" as const, order: 5 },
  { id: "6", text: "What does support from teammates look like to you when things get hard?", depthLevel: "MEDIUM" as const, order: 6 },
  { id: "7", text: "What's something you've learned from a failure at work?", depthLevel: "MEDIUM" as const, order: 7 },
  { id: "8", text: "What does meaningful work mean to you, and do you feel like you have it?", depthLevel: "DEEP" as const, order: 8 },
  { id: "9", text: "What does psychological safety mean to you in a team setting?", depthLevel: "DEEP" as const, order: 9 },
  { id: "10", text: "What would you want this team to remember about working with you?", depthLevel: "DEEP" as const, order: 10 },
];
