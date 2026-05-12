import { MetadataRoute } from "next";

const baseUrl = process.env.NEXTAUTH_URL || "https://prompt.so";

const staticRoutes = [
  { url: "/", changeFrequency: "weekly" as const, priority: 1.0 },
  { url: "/packs", changeFrequency: "weekly" as const, priority: 0.9 },
  { url: "/deep-questions", changeFrequency: "weekly" as const, priority: 0.9 },
  { url: "/first-date", changeFrequency: "weekly" as const, priority: 0.9 },
  { url: "/couples", changeFrequency: "weekly" as const, priority: 0.8 },
  { url: "/work-meetings", changeFrequency: "weekly" as const, priority: 0.8 },
  { url: "/road-trip", changeFrequency: "weekly" as const, priority: 0.7 },
  { url: "/dinner-party", changeFrequency: "weekly" as const, priority: 0.7 },
  { url: "/offline", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/card-game", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/family", changeFrequency: "weekly" as const, priority: 0.7 },
  { url: "/remote-team", changeFrequency: "weekly" as const, priority: 0.7 },
];

const packSlugs = [
  "first-date",
  "couples",
  "team-icebreaker",
  "road-trip",
  "dinner-party",
  "old-friends",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((r) => ({
      url: `${baseUrl}${r.url}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...packSlugs.map((slug) => ({
      url: `${baseUrl}/packs/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
