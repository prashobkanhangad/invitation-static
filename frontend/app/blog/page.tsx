import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";
import PageHeader from "@/components/landing/PageHeader";
import { getBlogPostsSorted } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog — Digital Wedding Invitations & WhatsApp E-Invites",
  description:
    "Guides on digital wedding invitations in India: WhatsApp formats, Kerala wording, maps, timing, guest lists and etiquette for elders.",
  alternates: { canonical: "https://www.invyto.in/blog" },
};

export default function BlogHubPage() {
  const posts = getBlogPostsSorted();
  const [featured, ...rest] = posts;

  return (
    <MarketingShell>
      <div className="container mx-auto max-w-5xl px-6">
        <PageHeader
          title="Blog"
          lead="Practical notes for couples in India making digital wedding invitations for WhatsApp — wording, timing, maps and the small etiquette details families notice."
        />

        {featured ? (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-12 grid overflow-hidden rounded-[1.4rem] border border-border/80 md:grid-cols-[1.15fr_1fr]"
          >
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px]">
              <img
                src={featured.image}
                alt={featured.imageAlt}
                width={1200}
                height={750}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center bg-card/40 px-6 py-8 md:px-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                {featured.topic}
                <span className="mx-2 text-muted-foreground/50">·</span>
                {featured.readMinutes} min
              </p>
              <h2 className="mt-3 font-display text-[1.65rem] font-light leading-snug tracking-[-0.02em] text-foreground md:text-[1.9rem]">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
                {featured.description}
              </p>
              <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Read article →
              </p>
            </div>
          </Link>
        ) : null}

        <ul className="mt-10 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[1.2rem] border border-border/80 transition hover:border-primary/40"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    width={800}
                    height={500}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col px-5 py-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                    {post.topic}
                    <span className="mx-2 text-muted-foreground/50">·</span>
                    {post.readMinutes} min
                  </p>
                  <h2 className="mt-2 font-display text-[1.2rem] font-light leading-snug tracking-[-0.02em] text-foreground">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MarketingShell>
  );
}
