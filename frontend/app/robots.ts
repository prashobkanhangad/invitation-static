import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/studio/",
          "/api/",
          "/guest/",
          "/scan/",
          "/share/",
          "/photos/",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/studio/", "/api/", "/guest/", "/share/", "/photos/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/studio/", "/api/", "/guest/", "/share/", "/photos/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/studio/", "/api/", "/guest/", "/share/", "/photos/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/studio/", "/api/", "/guest/", "/share/", "/photos/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/studio/", "/api/", "/guest/", "/share/", "/photos/"],
      },
    ],
    sitemap: "https://www.invyto.in/sitemap.xml",
  };
}
