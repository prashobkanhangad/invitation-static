import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";
import PageHeader from "@/components/landing/PageHeader";
import { PageAside, articleProse } from "@/components/landing/PageCta";
import type { BlogPost } from "@/lib/blogPosts";
import { getBlogPostsSorted } from "@/lib/blogPosts";

export default function BlogArticle({
  post,
  children,
}: {
  post: BlogPost;
  children: React.ReactNode;
}) {
  const related = getBlogPostsSorted()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <MarketingShell>
      <article className="container mx-auto max-w-3xl px-6">
        <PageHeader
          crumbs={[
            { href: "/blog", label: "Blog" },
            { href: `/blog/${post.slug}`, label: post.topic },
          ]}
          title={post.title}
          lead={post.description}
        />

        <p className="mt-4 text-sm font-light text-muted-foreground">
          Updated{" "}
          {new Date(post.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          <span className="mx-2 text-border">·</span>
          {post.readMinutes} min read
        </p>

        <div className="mt-8 overflow-hidden rounded-[1.25rem] border border-border/70">
          <img
            src={post.image}
            alt={post.imageAlt}
            width={1600}
            height={900}
            className="aspect-[16/9] h-auto w-full object-cover"
          />
        </div>

        <div className={articleProse}>{children}</div>

        <PageAside />

        {related.length > 0 ? (
          <section className="mt-14 border-t border-border/80 pt-10">
            <h2 className="font-display text-2xl font-light tracking-[-0.02em] text-foreground">
              Keep reading
            </h2>
            <ul className="mt-6 list-none space-y-4">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex gap-4 border-b border-border/60 pb-4 transition hover:border-primary/40"
                  >
                    <img
                      src={p.image}
                      alt=""
                      width={160}
                      height={90}
                      className="h-16 w-24 shrink-0 rounded-lg object-cover"
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-[0.18em] text-primary">
                        {p.topic}
                      </span>
                      <span className="mt-1 block font-display text-lg font-light leading-snug text-foreground group-hover:text-primary">
                        {p.title}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-10 text-sm text-muted-foreground">
          <Link
            href="/blog"
            className="text-primary underline-offset-4 hover:underline"
          >
            ← All articles
          </Link>
        </p>
      </article>
    </MarketingShell>
  );
}
