import type { MetadataRoute } from "next";
import { allLessons, units } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** every lesson is a real, indexable page — 32 of them, plus the app shell */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lessons = allLessons.map((lesson) => ({
    url: `${SITE_URL}/app/lesson/${lesson.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const bosses = units.map((unit) => ({
    url: `${SITE_URL}/app/boss/${unit.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/app`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...lessons,
    ...bosses,
  ];
}
