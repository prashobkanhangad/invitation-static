import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("malayalam-wedding-invitation-wording")!;

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
        Malayalam wedding invitation wording for a digital invite is usually a
        mix: English for the shareable page, with Malayalam or traditional
        phrasing for blessings, parent names and muhurtham where families expect
        it. Keep sentences warm, clear and easy to read on a phone.
      </p>

      <h2>Core English lines (WhatsApp-friendly)</h2>
      <p>
        “With immense joy and the blessings of our families, we cordially invite
        you and your family to the wedding celebrations of [Bride] and
        [Groom].”
      </p>
      <p>
        “Muhurtham: [time window] on [day, date]. Venue: [hall], [town]. Please
        open the invitation link for the map and full schedule.”
      </p>

      <h2>What to include on a Kerala digital invite</h2>
      <ul>
        <li>Bride and groom names as elders will recognise them</li>
        <li>Parents&apos; names and house / place references if traditional</li>
        <li>Muhurtham window and reception (if separate)</li>
        <li>Venue name + tap-to-open map</li>
        <li>A short personal note from the couple (optional but memorable)</li>
      </ul>

      <h2>Tone tips for North Kerala families</h2>
      <p>
        Prefer respectful address (“you and your family”, “gracious presence”)
        over casual party language. Avoid stuffing the whole guest list into the
        WhatsApp message — put detail on the{" "}
        <Link href="/wedding-invitations/malayalam">
          Malayalam wedding invitation
        </Link>{" "}
        page and keep the chat short.
      </p>

      <h2>Sample closing</h2>
      <p>
        “Your presence and blessings will make the occasion truly memorable.
        With love, [Bride] &amp; [Groom] / [Parents&apos; names].”
      </p>

      <p>
        See live Kerala examples such as{" "}
        <Link href="/anjana-jishnu">Anjana &amp; Jishnu</Link> and{" "}
        <Link href="/anupriya-adarsh">Anupriya &amp; Adarsh</Link>, or{" "}
        <Link href="/contact">start your invite</Link>.
      </p>
    </BlogArticle>
  );
}
