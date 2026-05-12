import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FreeCardPreview from "@/components/FreeCardPreview";
import StickyUpgradeBar from "@/components/StickyUpgradeBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Virtual Icebreaker Questions for Remote Teams — Free Interactive Cards | Prompt",
  description:
    "Tap through 40 virtual icebreaker questions for remote teams and Zoom calls. Free preview. No download required — share the link and go.",
};

export default async function RemoteTeamPage() {
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
          Virtual Icebreaker Questions for Remote Teams That Don&apos;t Feel Awkward
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          40 questions for virtual kickoffs, all-hands meetings, and remote team sessions.
          No download required — share the link, open the pack, anyone can advance the card.
        </p>

        <div className="bg-gray-50 rounded-3xl p-6 mb-12">
          <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
            Try 10 cards free — tap to advance
          </p>
          <FreeCardPreview prompts={prompts} packName="Team Icebreaker" totalCards={totalCards} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">The remote icebreaker problem</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Remote icebreakers are harder than in-person ones. On a video call, the person who
          speaks first is usually the facilitator trying to fill silence. "Fun fact about yourself"
          lands worse on Zoom because there&apos;s no social lubrication of being physically present
          together. The bar for a good remote icebreaker is higher — it needs to be specific enough
          to produce a real answer, interesting enough that others genuinely want to hear it, and
          quick enough not to derail the meeting.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">How the shared room works for remote teams</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Start a room from the Team Icebreaker pack. Share the link in the meeting chat.
          The facilitator advances the card on screen — everyone in the room sees the same question.
          Go around the call, hear everyone&apos;s answer. Move to the next card. No one needs
          to install anything. No separate app. It works in the browser on any device.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">For facilitators and HR</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          The Facilitator Pack ($24.99) adds presentation mode — large font, minimal chrome,
          designed to look clean when shared on a screen. You can run Team Icebreaker with 50
          people on an all-hands and it reads clearly in full-screen mode.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-10 leading-relaxed">
          Questions that build actual team cohesion
        </h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          Beyond the light warmup questions, the Team Icebreaker pack moves toward substance:
          what type of work puts you in flow? What does support from teammates look like when
          things get hard? What&apos;s something you wish people understood about how you work best?
          These questions build the mutual understanding that makes teams actually function better —
          not just feel good at the offsite.
        </p>

        <div className="bg-blue-50 rounded-2xl p-6 text-center">
          <p className="text-lg font-bold text-gray-900 mb-2">Run better remote team sessions</p>
          <p className="text-gray-500 mb-4">Team Icebreaker + 5 packs. $9.99 once. Facilitator mode available.</p>
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
  { id: "2", text: "What app or tool has made your work life noticeably better?", depthLevel: "LIGHT" as const, order: 2 },
  { id: "3", text: "What's a skill outside your job description that you quietly bring to your work?", depthLevel: "LIGHT" as const, order: 3 },
  { id: "4", text: "What type of work puts you in a flow state?", depthLevel: "MEDIUM" as const, order: 4 },
  { id: "5", text: "What does support from teammates look like to you when things get hard?", depthLevel: "MEDIUM" as const, order: 5 },
  { id: "6", text: "What's something you wish people understood about how you work best?", depthLevel: "MEDIUM" as const, order: 6 },
  { id: "7", text: "What does meaningful work mean to you, and do you feel like you have it?", depthLevel: "DEEP" as const, order: 7 },
  { id: "8", text: "What does psychological safety mean to you in a team setting?", depthLevel: "DEEP" as const, order: 8 },
  { id: "9", text: "What would you want this team to remember about working with you?", depthLevel: "DEEP" as const, order: 9 },
  { id: "10", text: "What's the impact you most want your work to have in the world?", depthLevel: "DEEP" as const, order: 10 },
];
