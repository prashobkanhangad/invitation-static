import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("is-digital-wedding-invitation-ok-for-elders")!;

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
        Yes — with care. In India it is increasingly acceptable to send a
        digital wedding invitation for most of the guest list. For elders who
        prefer paper or a personal touch, pair the WhatsApp link with a phone
        call or a small printed card. That mix feels respectful and still keeps
        dates, map and timings easy for everyone with a phone.
      </p>

      <h2>When a digital invite alone is enough</h2>
      <ul>
        <li>Guests who already live on WhatsApp</li>
        <li>Out-of-town relatives who need a map more than a card</li>
        <li>Large friend and colleague lists where printing is costly</li>
      </ul>

      <h2>When to add a call or physical card</h2>
      <ul>
        <li>Grandparents and elders who rarely open links</li>
        <li>Formal family relationships where a visit or card is expected</li>
        <li>Anyone who asks for “a proper invitation” — give them both</li>
      </ul>

      <h2>How to make the digital invite feel proper</h2>
      <p>
        A polished page with schedule, venue map and story reads as intentional —
        not like a casual image forward. Load speed on slower networks matters;
        so does clear muhurtham wording. See{" "}
        <Link href="/compare/digital-vs-printed-wedding-invitations">
          digital vs printed wedding invitations
        </Link>{" "}
        for a side-by-side comparison.
      </p>

      <h2>Suggested approach for Kerala and Hindu families</h2>
      <ol>
        <li>Create one WhatsApp-ready invitation link for the full guest list</li>
        <li>Call or visit key elders and share the link while you talk</li>
        <li>Print a short run of cards only for those who need them</li>
      </ol>

      <p>
        Ready to create a link families can open easily?{" "}
        <Link href="/contact">Message Invyto</Link> or browse{" "}
        <Link href="/#live-examples">live examples</Link>.
      </p>
    </BlogArticle>
  );
}
