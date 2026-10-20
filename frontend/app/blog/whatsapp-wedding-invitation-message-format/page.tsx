import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("whatsapp-wedding-invitation-message-format")!;

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
        A WhatsApp wedding invitation message should be short: greet, name the
        couple and date, then paste your digital invite link. The link carries
        the map, timings and story — the chat message only needs to open the
        door politely.
      </p>

      <h2>Basic format (close family)</h2>
      <p>
        Namaskaram / Hello [Name],
        <br />
        With the blessings of our families, we invite you to the wedding of
        [Bride] &amp; [Groom] on [Date].
        <br />
        Full details, venue map and timings: [Your Invyto link]
        <br />
        Your presence and blessings mean a lot to us.
      </p>

      <h2>Family group format</h2>
      <p>
        Dear family,
        <br />
        Sharing the digital invitation for [Bride] &amp; [Groom]&apos;s wedding
        ([Date]). Please open the link for muhurtham / ceremony time, reception
        and directions.
        <br />
        [Link]
        <br />
        Kindly forward to those who should attend.
      </p>

      <h2>Friends / colleagues format</h2>
      <p>
        Hi,
        <br />
        You&apos;re invited to our wedding on [Date] in [City]. Everything is in
        this link — date, venue map and schedule:
        <br />
        [Link]
        <br />
        Hope you can celebrate with us.
      </p>

      <h2>Tips that reduce follow-up chats</h2>
      <ul>
        <li>Put the link on its own line so it previews cleanly</li>
        <li>Mention the city once; let the page hold the full address</li>
        <li>Do not paste the entire schedule into the chat — that is why the page exists</li>
        <li>
          For elders who prefer paper, send the link plus a call or card — see{" "}
          <Link href="/blog/is-digital-wedding-invitation-ok-for-elders">
            digital invites and elders
          </Link>
        </li>
      </ul>

      <p>
        Need the invite page itself?{" "}
        <Link href="/wedding-invitations">Browse wedding invitation types</Link>{" "}
        or <Link href="/contact">message Invyto</Link>.
      </p>
    </BlogArticle>
  );
}
