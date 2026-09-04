import type { MetadataRoute } from "next";

// Shared with scripts/indexnow.mjs so the pages we tell Bing about and the
// pages we publish in the sitemap cannot drift apart.
import routes from "@/lib/site-routes.json";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
