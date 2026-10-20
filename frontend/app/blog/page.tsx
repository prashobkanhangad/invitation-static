import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";
import { blogPosts } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog — Digital Wedding Invitations & WhatsApp E-Invites",
  description:
    "Guides on digital wedding invitations in India: WhatsApp message formats, Malayalam and Hindu wording, phone how-tos and etiquette for elders.",
  alternates: { canonical: "https://www.invyto.in/blog" },
};

export default function BlogHubPage() {
  return (
    <MarketingShell>
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Blog
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Practical guides for couples in India creating digital wedding
          invitations to share on WhatsApp — wording, message formats and
          etiquette.
        </p>
        <ul className="mt-12 space-y-4">
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {post.topic}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-foreground">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MarketingShell>
  );
}
