import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";
import type { BlogPost } from "@/lib/blogPosts";

export default function BlogArticle({
  post,
  children,
}: {
  post: BlogPost;
  children: React.ReactNode;
}) {
  return (
    <MarketingShell>
      <article className="container mx-auto px-6 max-w-3xl">
        <p className="text-sm text-primary font-medium">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>{" "}
          / {post.topic}
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-foreground text-balance">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Updated{" "}
          {new Date(post.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline">
          {children}
        </div>
        <aside className="mt-14 rounded-2xl border border-border bg-card p-6">
          <p className="font-display text-xl font-semibold text-foreground">
            Create yours with Invyto
          </p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Invyto is an India-based platform for creating digital wedding
            invitations that you share as a single link on WhatsApp.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Contact us
            </Link>
            <Link href="/#live-examples" className="text-primary font-medium hover:underline">
              See live examples
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:underline">
              More articles
            </Link>
          </div>
        </aside>
      </article>
    </MarketingShell>
  );
}
