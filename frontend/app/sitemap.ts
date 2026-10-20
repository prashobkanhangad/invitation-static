import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogPosts";

const base = "https://www.invyto.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const paths = [
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
  ];

  const staticEntries: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/blog" || path.startsWith("/wedding")
          ? 0.8
          : 0.6,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
