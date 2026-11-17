import type { Metadata } from "next";
import type { BlogPost } from "@/lib/blogPosts";

export function blogMetadata(post: BlogPost): Metadata {
  const url = `https://www.invyto.in/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: `https://www.invyto.in${post.image}`,
          width: 1600,
          height: 900,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`https://www.invyto.in${post.image}`],
    },
  };
}
