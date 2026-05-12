/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const path = require("path");
type DepthLevel = "LIGHT" | "MEDIUM" | "DEEP";

function getDbUrl(): string {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return `file://${path.resolve(process.cwd(), "dev.db")}`;
  if (rawUrl.startsWith("file:./") || rawUrl.startsWith("file:../")) {
    return `file://${path.resolve(process.cwd(), rawUrl.replace("file:", ""))}`;
  }
  if (rawUrl.startsWith("file:///") || rawUrl.startsWith("file:/data/")) return rawUrl;
  return `file://${rawUrl.replace("file:", "")}`;
}

const adapter = new PrismaLibSql({ url: getDbUrl() });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new (PrismaClient as any)({ adapter });

async function main() {
  // Clean existing data
  await prisma.prompt.deleteMany();
  await prisma.pack.deleteMany();

  // --- FIRST DATE PACK (50 prompts, isPremium: false) ---
  const firstDate = await prisma.pack.create({
    data: {
      slug: "first-date",
      name: "First Date",
      description: "50 conversation starters for first dates that actually go somewhere.",
      context: "Dating",
      isPremium: false,
      cardCount: 50,
    },
  });

  const firstDatePrompts: { text: string; depthLevel: DepthLevel; order: number }[] = [
    // LIGHT
    { text: "What's something you've been really into lately — hobby, show, food, anything?", depthLevel: "LIGHT", order: 1 },
    { text: "Where did you grow up, and what's one thing you miss about it?", depthLevel: "LIGHT", order: 2 },
    { text: "What's your go-to order at a coffee shop?", depthLevel: "LIGHT", order: 3 },
    { text: "If you could live anywhere for a year, where would you pick?", depthLevel: "LIGHT", order: 4 },
    { text: "What's a show you've watched recently that you'd actually recommend?", depthLevel: "LIGHT", order: 5 },
    { text: "Are you more of a morning person or a night owl?", depthLevel: "LIGHT", order: 6 },
    { text: "What's something on your bucket list that's completely achievable but you haven't done yet?", depthLevel: "LIGHT", order: 7 },
    { text: "What's your favorite thing to do on a Sunday when you have no plans?", depthLevel: "LIGHT", order: 8 },
    { text: "Do you prefer cooking at home or eating out? What's your signature dish if you cook?", depthLevel: "LIGHT", order: 9 },
    { text: "What's the best trip you've ever taken?", depthLevel: "LIGHT", order: 10 },
    { text: "What kind of music do you listen to when you're driving alone?", depthLevel: "LIGHT", order: 11 },
    { text: "What's a skill you've always wanted to learn but haven't started yet?", depthLevel: "LIGHT", order: 12 },
    { text: "Would you rather explore a new city or revisit a place you already love?", depthLevel: "LIGHT", order: 13 },
    { text: "What was your favorite subject in school?", depthLevel: "LIGHT", order: 14 },
    { text: "Do you have any pets? If not, would you want one?", depthLevel: "LIGHT", order: 15 },
    // MEDIUM
    { text: "What does a genuinely great day look like for you?", depthLevel: "MEDIUM", order: 16 },
    { text: "What's a belief you held a few years ago that you no longer hold?", depthLevel: "MEDIUM", order: 17 },
    { text: "What's something you're really proud of that doesn't show up on a resume?", depthLevel: "MEDIUM", order: 18 },
    { text: "How do you recharge after a hard week?", depthLevel: "MEDIUM", order: 19 },
    { text: "What's something you think most people misunderstand about you?", depthLevel: "MEDIUM", order: 20 },
    { text: "What does friendship mean to you, and do you have it?", depthLevel: "MEDIUM", order: 21 },
    { text: "What's the most important lesson you've learned from a past relationship?", depthLevel: "MEDIUM", order: 22 },
    { text: "What's something you wish more people asked you about?", depthLevel: "MEDIUM", order: 23 },
    { text: "What's a decision you made that seemed small at the time but shaped your life?", depthLevel: "MEDIUM", order: 24 },
    { text: "What do you think makes a relationship actually work long-term?", depthLevel: "MEDIUM", order: 25 },
    { text: "What's something you're actively trying to get better at right now?", depthLevel: "MEDIUM", order: 26 },
    { text: "What are you most excited about in the next few months?", depthLevel: "MEDIUM", order: 27 },
    { text: "How do you handle conflict — do you tend to address it directly or let it breathe?", depthLevel: "MEDIUM", order: 28 },
    { text: "What's your relationship like with your family?", depthLevel: "MEDIUM", order: 29 },
    { text: "What's something you've changed your mind about in the last year?", depthLevel: "MEDIUM", order: 30 },
    { text: "Do you tend to make decisions with your head or your gut?", depthLevel: "MEDIUM", order: 31 },
    { text: "What role does ambition play in your life right now?", depthLevel: "MEDIUM", order: 32 },
    { text: "What's a time you surprised yourself?", depthLevel: "MEDIUM", order: 33 },
    { text: "What does your ideal Saturday look like, honestly?", depthLevel: "MEDIUM", order: 34 },
    { text: "What's something you do that most people wouldn't expect from you?", depthLevel: "MEDIUM", order: 35 },
    // DEEP
    { text: "What's something you want that you don't talk about much?", depthLevel: "DEEP", order: 36 },
    { text: "What's the most meaningful relationship in your life and why?", depthLevel: "DEEP", order: 37 },
    { text: "What's something you're still figuring out about yourself?", depthLevel: "DEEP", order: 38 },
    { text: "When do you feel most like yourself?", depthLevel: "DEEP", order: 39 },
    { text: "What would you do differently if you weren't afraid of what people thought?", depthLevel: "DEEP", order: 40 },
    { text: "What's something from your past that still shapes how you show up today?", depthLevel: "DEEP", order: 41 },
    { text: "What does home mean to you — is it a place, a feeling, people?", depthLevel: "DEEP", order: 42 },
    { text: "What's a fear you've actually faced, and what happened?", depthLevel: "DEEP", order: 43 },
    { text: "What would your life look like if you felt fully free to design it?", depthLevel: "DEEP", order: 44 },
    { text: "What's something you've forgiven yourself for?", depthLevel: "DEEP", order: 45 },
    { text: "Is there a version of your life you walked away from — and do you ever wonder about it?", depthLevel: "DEEP", order: 46 },
    { text: "What do you think makes someone truly brave?", depthLevel: "DEEP", order: 47 },
    { text: "What's something you believe about love that most people would disagree with?", depthLevel: "DEEP", order: 48 },
    { text: "What's the most important thing you're looking for in a relationship, if you're honest?", depthLevel: "DEEP", order: 49 },
    { text: "What would you want someone to truly understand about you before they decide if they like you?", depthLevel: "DEEP", order: 50 },
  ];

  for (const p of firstDatePrompts) {
    await prisma.prompt.create({ data: { ...p, packId: firstDate.id } });
  }

  // --- COUPLES DEEP DIVE PACK (60 prompts, isPremium: true) ---
  const couples = await prisma.pack.create({
    data: {
      slug: "couples",
      name: "Couples Deep Dive",
      description: "60 questions to go deeper with your partner — for dinners, road trips, and quiet evenings.",
      context: "Couples",
      isPremium: true,
      cardCount: 60,
    },
  });

  const couplesPrompts: { text: string; depthLevel: DepthLevel; order: number }[] = [
    { text: "What's your favorite memory of us so far?", depthLevel: "LIGHT", order: 1 },
    { text: "What's something I do that makes you feel really seen?", depthLevel: "LIGHT", order: 2 },
    { text: "What's a trip you'd love us to take together?", depthLevel: "LIGHT", order: 3 },
    { text: "What's something new you'd like us to try together?", depthLevel: "LIGHT", order: 4 },
    { text: "What's a song that makes you think of us?", depthLevel: "LIGHT", order: 5 },
    { text: "What's your favorite thing we do when we're just hanging out with no plan?", depthLevel: "LIGHT", order: 6 },
    { text: "When did you first realize you really liked me?", depthLevel: "LIGHT", order: 7 },
    { text: "What's something small I do that you appreciate more than I probably know?", depthLevel: "LIGHT", order: 8 },
    { text: "What does a perfect date night with me look like to you?", depthLevel: "LIGHT", order: 9 },
    { text: "What's something about our relationship that you brag about to others?", depthLevel: "LIGHT", order: 10 },
    { text: "What's a tradition you'd love for us to start?", depthLevel: "LIGHT", order: 11 },
    { text: "What's something that always makes you laugh together?", depthLevel: "LIGHT", order: 12 },
    { text: "What's a hobby you'd love to share with me?", depthLevel: "LIGHT", order: 13 },
    { text: "What's one thing you love about how we communicate?", depthLevel: "LIGHT", order: 14 },
    { text: "What's a comfort food that reminds you of our early days together?", depthLevel: "LIGHT", order: 15 },
    { text: "What's something I do that helps you feel loved without words?", depthLevel: "MEDIUM", order: 16 },
    { text: "What's a dream you have that you've never fully told me about?", depthLevel: "MEDIUM", order: 17 },
    { text: "How have you changed since we got together?", depthLevel: "MEDIUM", order: 18 },
    { text: "What's something you need more of from me — that you haven't figured out how to ask for?", depthLevel: "MEDIUM", order: 19 },
    { text: "What does financial security look like to you, and how aligned do you think we are?", depthLevel: "MEDIUM", order: 20 },
    { text: "What's a fear you have about us that you rarely say out loud?", depthLevel: "MEDIUM", order: 21 },
    { text: "What does quality time mean to you — how do you know when you're getting enough of it?", depthLevel: "MEDIUM", order: 22 },
    { text: "In what ways do you think we're different, and how do those differences help us?", depthLevel: "MEDIUM", order: 23 },
    { text: "What's something you think I handle better than you?", depthLevel: "MEDIUM", order: 24 },
    { text: "What's a role model couple you look up to, and what do you admire about them?", depthLevel: "MEDIUM", order: 25 },
    { text: "How do you feel about where we live — does it match what you want long-term?", depthLevel: "MEDIUM", order: 26 },
    { text: "What are your non-negotiables in a relationship, and do you feel like they're met?", depthLevel: "MEDIUM", order: 27 },
    { text: "How do you tend to show love when you're stressed or overwhelmed?", depthLevel: "MEDIUM", order: 28 },
    { text: "What does a really fulfilling week look like for you — what would it have in it?", depthLevel: "MEDIUM", order: 29 },
    { text: "What's something you thought you'd feel differently about once you were in a relationship?", depthLevel: "MEDIUM", order: 30 },
    { text: "What's something you've learned about yourself through loving me?", depthLevel: "MEDIUM", order: 31 },
    { text: "How do you want us to handle disagreements differently than we do now?", depthLevel: "MEDIUM", order: 32 },
    { text: "What's your vision for how we spend our time five years from now?", depthLevel: "MEDIUM", order: 33 },
    { text: "What's something you're proud of building together?", depthLevel: "MEDIUM", order: 34 },
    { text: "What's something that makes you feel disconnected from me, even when we're together?", depthLevel: "MEDIUM", order: 35 },
    { text: "What's something you've never told me because you weren't sure how I'd receive it?", depthLevel: "DEEP", order: 36 },
    { text: "What does commitment mean to you at a deep level — beyond staying together?", depthLevel: "DEEP", order: 37 },
    { text: "When do you feel most alone, even in our relationship?", depthLevel: "DEEP", order: 38 },
    { text: "What would it mean for you to feel truly known by me?", depthLevel: "DEEP", order: 39 },
    { text: "What's a version of yourself you're afraid I might not love?", depthLevel: "DEEP", order: 40 },
    { text: "How do your childhood experiences shape what you bring to our relationship?", depthLevel: "DEEP", order: 41 },
    { text: "What's something you've forgiven me for that we've never really talked about?", depthLevel: "DEEP", order: 42 },
    { text: "What does it mean to you to be truly chosen — not just stayed with?", depthLevel: "DEEP", order: 43 },
    { text: "What's a part of your inner world you haven't fully let me into?", depthLevel: "DEEP", order: 44 },
    { text: "What does love require of you that costs you the most?", depthLevel: "DEEP", order: 45 },
    { text: "If you could change one dynamic in our relationship, what would it be?", depthLevel: "DEEP", order: 46 },
    { text: "What's something that makes you feel truly at peace when you're with me?", depthLevel: "DEEP", order: 47 },
    { text: "What's the hardest thing you've ever done for this relationship?", depthLevel: "DEEP", order: 48 },
    { text: "What's something you hope we never lose as we grow together?", depthLevel: "DEEP", order: 49 },
    { text: "What does safety feel like to you in a relationship — and do you feel it with me?", depthLevel: "DEEP", order: 50 },
    { text: "What's a wound from your past that you've brought into our relationship without meaning to?", depthLevel: "DEEP", order: 51 },
    { text: "What would unconditional love from me actually look like to you?", depthLevel: "DEEP", order: 52 },
    { text: "What's something you're afraid of wanting because you're not sure you'll get it?", depthLevel: "DEEP", order: 53 },
    { text: "How do you feel about the trajectory we're on — does it match your vision?", depthLevel: "DEEP", order: 54 },
    { text: "What's something you think our relationship could be, that it isn't yet?", depthLevel: "DEEP", order: 55 },
    { text: "What does growing old together mean to you, honestly?", depthLevel: "DEEP", order: 56 },
    { text: "What's the most vulnerable thing you've done in this relationship?", depthLevel: "DEEP", order: 57 },
    { text: "What's something you need from me that you've struggled to name?", depthLevel: "DEEP", order: 58 },
    { text: "How do you want us to show up for each other during really hard seasons?", depthLevel: "DEEP", order: 59 },
    { text: "If you could ask me anything without worrying about my reaction, what would it be?", depthLevel: "DEEP", order: 60 },
  ];

  for (const p of couplesPrompts) {
    await prisma.prompt.create({ data: { ...p, packId: couples.id } });
  }

  // --- TEAM ICEBREAKER PACK (40 prompts, isPremium: true) ---
  const team = await prisma.pack.create({
    data: {
      slug: "team-icebreaker",
      name: "Team Icebreaker",
      description: "40 questions that make team meetings, offsites, and kickoffs actually worth attending.",
      context: "Work",
      isPremium: true,
      cardCount: 40,
    },
  });

  const teamPrompts: { text: string; depthLevel: DepthLevel; order: number }[] = [
    { text: "What's something you worked on recently that you're genuinely proud of?", depthLevel: "LIGHT", order: 1 },
    { text: "What's your go-to snack when you're deep in focus mode?", depthLevel: "LIGHT", order: 2 },
    { text: "If you could work from anywhere in the world for a month, where would you go?", depthLevel: "LIGHT", order: 3 },
    { text: "What app or tool has made your work life noticeably better?", depthLevel: "LIGHT", order: 4 },
    { text: "What's a skill outside your job description that you quietly bring to your work?", depthLevel: "LIGHT", order: 5 },
    { text: "Are you a notebook person or an everything-in-my-phone person?", depthLevel: "LIGHT", order: 6 },
    { text: "What's the most interesting thing you've learned in the last few months?", depthLevel: "LIGHT", order: 7 },
    { text: "What's something you do to actually decompress after work?", depthLevel: "LIGHT", order: 8 },
    { text: "If your work style were a movie genre, what would it be?", depthLevel: "LIGHT", order: 9 },
    { text: "What's a superpower you have at work that your team might not know about?", depthLevel: "LIGHT", order: 10 },
    { text: "What's one thing you'd change about how your team communicates?", depthLevel: "MEDIUM", order: 11 },
    { text: "What type of work puts you in a flow state?", depthLevel: "MEDIUM", order: 12 },
    { text: "What does support from teammates look like to you when things get hard?", depthLevel: "MEDIUM", order: 13 },
    { text: "What's something you've learned from a failure at work?", depthLevel: "MEDIUM", order: 14 },
    { text: "What motivates you more — clear direction or creative freedom?", depthLevel: "MEDIUM", order: 15 },
    { text: "What's the best piece of career advice you've ever received?", depthLevel: "MEDIUM", order: 16 },
    { text: "How do you tend to handle high-stakes decisions?", depthLevel: "MEDIUM", order: 17 },
    { text: "What's something you wish people understood about how you work best?", depthLevel: "MEDIUM", order: 18 },
    { text: "What's a project you worked on that challenged you more than you expected?", depthLevel: "MEDIUM", order: 19 },
    { text: "What does a really effective collaboration look like to you?", depthLevel: "MEDIUM", order: 20 },
    { text: "What's a professional risk you took that paid off?", depthLevel: "MEDIUM", order: 21 },
    { text: "What do you think is the most underrated quality in a teammate?", depthLevel: "MEDIUM", order: 22 },
    { text: "What kind of feedback helps you actually grow?", depthLevel: "MEDIUM", order: 23 },
    { text: "What's a work habit you're consciously trying to build or break?", depthLevel: "MEDIUM", order: 24 },
    { text: "What's something you think this team does exceptionally well?", depthLevel: "MEDIUM", order: 25 },
    { text: "What's something that genuinely energizes you about the work you do?", depthLevel: "DEEP", order: 26 },
    { text: "What does meaningful work mean to you, and do you feel like you have it?", depthLevel: "DEEP", order: 27 },
    { text: "What's a value you bring to your work that you'd never compromise on?", depthLevel: "DEEP", order: 28 },
    { text: "Where do you want your career to be in five years — what would feel like success?", depthLevel: "DEEP", order: 29 },
    { text: "What's something you've stayed silent about at work that you wish you'd said?", depthLevel: "DEEP", order: 30 },
    { text: "What's a moment in your career when you doubted yourself — and what happened next?", depthLevel: "DEEP", order: 31 },
    { text: "What does psychological safety mean to you in a team setting?", depthLevel: "DEEP", order: 32 },
    { text: "What's something you've sacrificed for your career — and was it worth it?", depthLevel: "DEEP", order: 33 },
    { text: "What's a leadership style or approach you've found genuinely inspiring?", depthLevel: "DEEP", order: 34 },
    { text: "What would you want this team to remember about working with you?", depthLevel: "DEEP", order: 35 },
    { text: "What's one thing you want to get better at this year, professionally?", depthLevel: "DEEP", order: 36 },
    { text: "What's the impact you most want your work to have in the world?", depthLevel: "DEEP", order: 37 },
    { text: "What's a moment when a colleague or manager made you feel truly valued?", depthLevel: "DEEP", order: 38 },
    { text: "What's something you'd tell your earlier career self that you wish you'd known?", depthLevel: "DEEP", order: 39 },
    { text: "What does bringing your whole self to work mean to you, practically?", depthLevel: "DEEP", order: 40 },
  ];

  for (const p of teamPrompts) {
    await prisma.prompt.create({ data: { ...p, packId: team.id } });
  }

  // --- ROAD TRIP PACK (35 prompts, isPremium: true) ---
  const roadTrip = await prisma.pack.create({
    data: {
      slug: "road-trip",
      name: "Road Trip",
      description: "35 conversation starters for the open road — light, funny, and genuinely interesting.",
      context: "Travel",
      isPremium: true,
      cardCount: 35,
    },
  });

  const roadTripPrompts: { text: string; depthLevel: DepthLevel; order: number }[] = [
    { text: "What's the best road trip food — and what's the absolute worst?", depthLevel: "LIGHT", order: 1 },
    { text: "If you could add one stop to this trip right now, where would it be?", depthLevel: "LIGHT", order: 2 },
    { text: "What's the most random roadside attraction you've ever visited?", depthLevel: "LIGHT", order: 3 },
    { text: "What's your road trip playlist philosophy — full control or shared shuffle?", depthLevel: "LIGHT", order: 4 },
    { text: "What's the best meal you've ever eaten on a trip?", depthLevel: "LIGHT", order: 5 },
    { text: "If you could road trip through any country in the world, where would you go?", depthLevel: "LIGHT", order: 6 },
    { text: "What's the most spontaneous thing you've ever done while traveling?", depthLevel: "LIGHT", order: 7 },
    { text: "Window down or AC? Mountains or coast? Night drive or sunrise start?", depthLevel: "LIGHT", order: 8 },
    { text: "What's a travel story you love telling?", depthLevel: "LIGHT", order: 9 },
    { text: "If we could stop anywhere for an hour right now, what would you want to do?", depthLevel: "LIGHT", order: 10 },
    { text: "What's a place you've always wanted to go but haven't been able to justify yet?", depthLevel: "MEDIUM", order: 11 },
    { text: "What do you think makes travel actually meaningful rather than just a vacation?", depthLevel: "MEDIUM", order: 12 },
    { text: "What's the most out-of-your-comfort-zone thing you've done while traveling?", depthLevel: "MEDIUM", order: 13 },
    { text: "Has traveling ever changed the way you see something in your everyday life?", depthLevel: "MEDIUM", order: 14 },
    { text: "What's a trip you have no desire to take that everyone else seems to love?", depthLevel: "MEDIUM", order: 15 },
    { text: "What does adventure mean to you — is it thrill, newness, discomfort, freedom?", depthLevel: "MEDIUM", order: 16 },
    { text: "What's somewhere you've been that completely defied your expectations?", depthLevel: "MEDIUM", order: 17 },
    { text: "If money wasn't a factor, what would your ideal year of travel look like?", depthLevel: "MEDIUM", order: 18 },
    { text: "What's the most meaningful conversation you've had with a stranger while traveling?", depthLevel: "MEDIUM", order: 19 },
    { text: "Are you a plan-everything traveler or a figure-it-out traveler?", depthLevel: "MEDIUM", order: 20 },
    { text: "Is there a place you've been that felt like it could have been home?", depthLevel: "MEDIUM", order: 21 },
    { text: "What's a moment from a trip that you go back to often in your mind?", depthLevel: "DEEP", order: 22 },
    { text: "Has a trip ever shifted how you think about your own life or choices?", depthLevel: "DEEP", order: 23 },
    { text: "What's something you're looking for from this trip — beyond just fun?", depthLevel: "DEEP", order: 24 },
    { text: "Is there a place you've visited that felt like it meant something, and you're still not sure why?", depthLevel: "DEEP", order: 25 },
    { text: "What does getting away from your life actually do for you?", depthLevel: "DEEP", order: 26 },
    { text: "What's a version of yourself that shows up when you travel that doesn't always show up at home?", depthLevel: "DEEP", order: 27 },
    { text: "What would you do with six months of total freedom to go anywhere?", depthLevel: "DEEP", order: 28 },
    { text: "Is there a trip you regret not taking — what stopped you?", depthLevel: "DEEP", order: 29 },
    { text: "What do you think travel teaches you that nothing else can?", depthLevel: "DEEP", order: 30 },
    { text: "What's a dream trip that you keep waiting to be ready for?", depthLevel: "DEEP", order: 31 },
    { text: "Has travel ever made you feel genuinely lonely in a way that surprised you?", depthLevel: "DEEP", order: 32 },
    { text: "What's a landscape or environment that makes you feel most alive?", depthLevel: "DEEP", order: 33 },
    { text: "If you could relive one trip in your life exactly as it was, which one?", depthLevel: "DEEP", order: 34 },
    { text: "What's something you hope to feel by the end of this trip that you didn't feel at the start?", depthLevel: "DEEP", order: 35 },
  ];

  for (const p of roadTripPrompts) {
    await prisma.prompt.create({ data: { ...p, packId: roadTrip.id } });
  }

  // --- DINNER PARTY PACK (35 prompts, isPremium: true) ---
  const dinnerParty = await prisma.pack.create({
    data: {
      slug: "dinner-party",
      name: "Dinner Party",
      description: "35 conversation starters for adults that make a dinner table actually interesting.",
      context: "Social",
      isPremium: true,
      cardCount: 35,
    },
  });

  const dinnerPartyPrompts: { text: string; depthLevel: DepthLevel; order: number }[] = [
    { text: "What's a meal that takes you somewhere just from the smell of it?", depthLevel: "LIGHT", order: 1 },
    { text: "What's the most underrated cuisine, in your opinion?", depthLevel: "LIGHT", order: 2 },
    { text: "What's something you cook that you think is secretly impressive?", depthLevel: "LIGHT", order: 3 },
    { text: "What's a food trend you genuinely don't understand the hype around?", depthLevel: "LIGHT", order: 4 },
    { text: "What's the most memorable dinner you've ever had — anywhere, with anyone?", depthLevel: "LIGHT", order: 5 },
    { text: "If you could cook dinner with any person, living or historical, who and what would you make?", depthLevel: "LIGHT", order: 6 },
    { text: "What's a dish that says everything about where you come from?", depthLevel: "LIGHT", order: 7 },
    { text: "What's your strong opinion about something at a dinner table — food, etiquette, seating, anything?", depthLevel: "LIGHT", order: 8 },
    { text: "What's something you've recently tried for the first time that surprised you?", depthLevel: "LIGHT", order: 9 },
    { text: "If you had to describe your personality as a type of cuisine, what would it be?", depthLevel: "LIGHT", order: 10 },
    { text: "What's a topic you think most people avoid at dinner tables but shouldn't?", depthLevel: "MEDIUM", order: 11 },
    { text: "What's something you used to believe strongly that you no longer do?", depthLevel: "MEDIUM", order: 12 },
    { text: "What's the most interesting person you've had dinner with, and why?", depthLevel: "MEDIUM", order: 13 },
    { text: "What do you think makes a gathering of people actually memorable?", depthLevel: "MEDIUM", order: 14 },
    { text: "What's a social norm around dining, hosting, or entertaining you think we should reconsider?", depthLevel: "MEDIUM", order: 15 },
    { text: "What's something you believe about friendship that took you a while to figure out?", depthLevel: "MEDIUM", order: 16 },
    { text: "What's a book, film, or piece of art that changed how you see something?", depthLevel: "MEDIUM", order: 17 },
    { text: "If you had to make a toast right now, what would you say?", depthLevel: "MEDIUM", order: 18 },
    { text: "What's a conversation from your past that you still think about?", depthLevel: "MEDIUM", order: 19 },
    { text: "What's something you'd want to be said about you at a dinner like this?", depthLevel: "MEDIUM", order: 20 },
    { text: "What's a habit, practice, or ritual that genuinely improves your life that most people don't do?", depthLevel: "MEDIUM", order: 21 },
    { text: "What's a question you wish someone would ask you at a party like this?", depthLevel: "MEDIUM", order: 22 },
    { text: "What's something you've never done that most people your age have?", depthLevel: "MEDIUM", order: 23 },
    { text: "What's a decision you've made that looked strange from the outside but felt exactly right?", depthLevel: "MEDIUM", order: 24 },
    { text: "What's a problem in the world you actually think is solvable — and what would it take?", depthLevel: "MEDIUM", order: 25 },
    { text: "What's something you've stopped pretending to care about?", depthLevel: "DEEP", order: 26 },
    { text: "What does a really well-lived life look like to you, specifically?", depthLevel: "DEEP", order: 27 },
    { text: "What's something you know about yourself that took you too long to accept?", depthLevel: "DEEP", order: 28 },
    { text: "What's the most important relationship in your life — and what have you had to put into it?", depthLevel: "DEEP", order: 29 },
    { text: "What's a period in your life that was hard at the time but made you who you are?", depthLevel: "DEEP", order: 30 },
    { text: "What's a fear you've been living with for a long time that you haven't yet faced?", depthLevel: "DEEP", order: 31 },
    { text: "What's something you want to do before you run out of time — and what's stopped you so far?", depthLevel: "DEEP", order: 32 },
    { text: "What's a value you'd stand on even if it cost you something?", depthLevel: "DEEP", order: 33 },
    { text: "What's the most honest thing you could say right now about where your life is?", depthLevel: "DEEP", order: 34 },
    { text: "If this were the last dinner party of your life, what would you want to make sure got said?", depthLevel: "DEEP", order: 35 },
  ];

  for (const p of dinnerPartyPrompts) {
    await prisma.prompt.create({ data: { ...p, packId: dinnerParty.id } });
  }

  // --- OLD FRIENDS PACK (40 prompts, isPremium: true) ---
  const oldFriends = await prisma.pack.create({
    data: {
      slug: "old-friends",
      name: "Old Friends",
      description: "40 questions for the friends you've known forever — to go deeper than nostalgia.",
      context: "Friendship",
      isPremium: true,
      cardCount: 40,
    },
  });

  const oldFriendsPrompts: { text: string; depthLevel: DepthLevel; order: number }[] = [
    { text: "What's a memory of us that still makes you laugh?", depthLevel: "LIGHT", order: 1 },
    { text: "What's changed most in your life since we last really caught up?", depthLevel: "LIGHT", order: 2 },
    { text: "What's something you remember about our early friendship that I've probably forgotten?", depthLevel: "LIGHT", order: 3 },
    { text: "What's something you always wanted to do together that we never got around to?", depthLevel: "LIGHT", order: 4 },
    { text: "What's a phase we went through together that you look back on with genuine affection?", depthLevel: "LIGHT", order: 5 },
    { text: "What's something I used to do that I've completely stopped — and do you miss it?", depthLevel: "LIGHT", order: 6 },
    { text: "What's a song, movie, or show that's basically a time capsule of us?", depthLevel: "LIGHT", order: 7 },
    { text: "What's something I was right about — that you didn't want to admit at the time?", depthLevel: "LIGHT", order: 8 },
    { text: "What's one of your favorite stories about us that you like to tell other people?", depthLevel: "LIGHT", order: 9 },
    { text: "What's something about my life now that surprises you — in a good way?", depthLevel: "LIGHT", order: 10 },
    { text: "How have you changed the most since we first became friends?", depthLevel: "MEDIUM", order: 11 },
    { text: "What's something about yourself that you don't think you could have told me ten years ago?", depthLevel: "MEDIUM", order: 12 },
    { text: "What's something you think I don't give myself enough credit for?", depthLevel: "MEDIUM", order: 13 },
    { text: "What's a time I really showed up for you that meant more than I probably know?", depthLevel: "MEDIUM", order: 14 },
    { text: "What do you think is the secret to friendships lasting as long as ours has?", depthLevel: "MEDIUM", order: 15 },
    { text: "What's something you hoped would be different about your life by now?", depthLevel: "MEDIUM", order: 16 },
    { text: "What's something you've gotten better at that I might not have noticed?", depthLevel: "MEDIUM", order: 17 },
    { text: "What's something you're prouder of than you let on?", depthLevel: "MEDIUM", order: 18 },
    { text: "What's a hard thing you've been through recently that you haven't fully processed yet?", depthLevel: "MEDIUM", order: 19 },
    { text: "What's something you wish our friendship made more room for?", depthLevel: "MEDIUM", order: 20 },
    { text: "What's a fear you've had for a long time that's changed shape as you've gotten older?", depthLevel: "MEDIUM", order: 21 },
    { text: "What's something you've stopped caring about that used to consume a lot of your energy?", depthLevel: "MEDIUM", order: 22 },
    { text: "What do you want your life to look like in five years — honestly?", depthLevel: "MEDIUM", order: 23 },
    { text: "What's something you're still figuring out — even after all this time?", depthLevel: "MEDIUM", order: 24 },
    { text: "What's something you've learned about yourself through our friendship?", depthLevel: "MEDIUM", order: 25 },
    { text: "What's the most honest thing you could tell me about how you're actually doing?", depthLevel: "DEEP", order: 26 },
    { text: "What's something I know about you that almost no one else does?", depthLevel: "DEEP", order: 27 },
    { text: "What's something you've never fully told me — even though we know each other this well?", depthLevel: "DEEP", order: 28 },
    { text: "What's a version of yourself that you've had to let go of as you've gotten older?", depthLevel: "DEEP", order: 29 },
    { text: "What's something from our shared past that you've never quite made peace with?", depthLevel: "DEEP", order: 30 },
    { text: "What does it mean to you that we've stayed friends through everything we have?", depthLevel: "DEEP", order: 31 },
    { text: "What's something you're carrying right now that you haven't told many people?", depthLevel: "DEEP", order: 32 },
    { text: "When do you feel most like your real self — and when do you feel least like it?", depthLevel: "DEEP", order: 33 },
    { text: "What's something you wish you'd said to someone important before you lost the chance?", depthLevel: "DEEP", order: 34 },
    { text: "What's a hope you have for your life that feels almost too big to say out loud?", depthLevel: "DEEP", order: 35 },
    { text: "What's something you think about at 3am that you don't bring up in daylight?", depthLevel: "DEEP", order: 36 },
    { text: "What's the best thing about knowing someone the way we know each other?", depthLevel: "DEEP", order: 37 },
    { text: "What's something you've forgiven yourself for that took a really long time?", depthLevel: "DEEP", order: 38 },
    { text: "What would you want me to know about who you're becoming?", depthLevel: "DEEP", order: 39 },
    { text: "What do you hope is still true about us ten years from now?", depthLevel: "DEEP", order: 40 },
  ];

  for (const p of oldFriendsPrompts) {
    await prisma.prompt.create({ data: { ...p, packId: oldFriends.id } });
  }

  console.log("Seed complete. Packs and prompts created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
