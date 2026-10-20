import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("hindu-wedding-invitation-wording")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: {
    canonical: `https://www.invyto.in/blog/${post.slug}`,
  },
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://www.invyto.in/blog/${post.slug}`,
    type: "article",
  },
};

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        Hindu wedding invitation wording for a digital e-invite should make the
        muhurtham (or marriage window), reception and venue obvious at a glance.
        Guests open one WhatsApp link on their phone — so clarity beats long
        formal paragraphs.
      </p>

      <h2>Opening / invocation (optional)</h2>
      <p>
        Many families open with a short blessing line suited to their tradition
        (for example a deity prasanna line). Keep it one line so it does not
        push the date below the fold on mobile.
      </p>

      <h2>Ceremony wording</h2>
      <p>
        “Solicit your gracious presence with family and friends on the
        auspicious occasion of the marriage of [Groom], [credentials if
        customary], son of [parents], with [Bride], daughter of [parents].”
      </p>
      <p>
        “Marriage will be solemnized on [day, date] at [venue]. Muhurtham: [start
        – end].”
      </p>

      <h2>Reception wording</h2>
      <p>
        “Reception: [day, date], [time] onwards at [venue].” If reception is the
        day before the muhurtham, state both dates clearly so out-of-town guests
        plan travel correctly.
      </p>

      <h2>Digital-specific checklist</h2>
      <ul>
        <li>Put map behind a single “Open in Google Maps” action</li>
        <li>List lagna / star only if your family wants it shown</li>
        <li>Use a Q&amp;A block for parents, exact muhurtham and dress notes</li>
        <li>
          Share with a short WhatsApp intro — see{" "}
          <Link href="/blog/whatsapp-wedding-invitation-message-format">
            message formats
          </Link>
        </li>
      </ul>

      <p>
        Explore{" "}
        <Link href="/wedding-invitations/hindu">Hindu wedding e-invites</Link>{" "}
        or a live example like{" "}
        <Link href="/puneeth-suma">Puneeth &amp; Suma</Link>.{" "}
        <Link href="/contact">Contact Invyto</Link> to create yours.
      </p>
    </BlogArticle>
  );
}
