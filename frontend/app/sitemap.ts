import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogPosts";
import { LIVE_EXAMPLES } from "@/lib/liveExamples";

const base = "https://www.invyto.in";

/** Marketing / content pages */
const MARKETING_PATHS = [
  "",
  "/about",
  "/pricing",
  "/contact",
  "/privacy",
  "/terms",
  "/blog",
  "/wedding-invitations",
  "/wedding-invitations/malayalam",
  "/wedding-invitations/kerala",
  "/wedding-invitations/hindu",
  "/compare/digital-vs-printed-wedding-invitations",
  "/llms.txt",
] as const;

/**
 * All public static invitation demos (excludes studio/guest/share/photos/scan
 * and invalid folder names like "arun-shilpa copy").
 */
const INVITE_PATHS = [
  "/vasudevan-athira",
  "/vasudevan-athira-2",
  "/shreerag-revathi",
  "/anjana-jishnu",
  "/puneeth-suma",
  "/anupriya-adarsh",
  "/sanath-sreya",
  "/arun-shilpa",
  "/manjima-srujith",
  "/srideep-shobana",
  "/jithendra_and_nanditha",
  "/surya_gayathri-subrahmanyan",
  "/surya_gayathri-subrahmanyan-2",
  "/romantic-wedding",
  "/elegent-wedding",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const marketingEntries: MetadataRoute.Sitemap = MARKETING_PATHS.map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority:
        path === ""
          ? 1
          : path === "/blog" || path.startsWith("/wedding")
            ? 0.8
            : path === "/llms.txt"
              ? 0.3
              : 0.6,
    }),
  );

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const inviteSet = new Set<string>([
    ...INVITE_PATHS,
    ...LIVE_EXAMPLES.map((e) => e.href),
  ]);

  const inviteEntries: MetadataRoute.Sitemap = [...inviteSet].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...marketingEntries, ...blogEntries, ...inviteEntries];
}
