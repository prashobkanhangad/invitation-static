import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost(
  "how-to-make-a-digital-wedding-invitation-on-phone",
)!;

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
        You can create a digital wedding invitation entirely from your phone:
        collect details in WhatsApp or Notes, send them to a maker like Invyto,
        then share one link with guests. Guests open it in their mobile browser
        — no app download required.
      </p>

      <h2>1. Gather the essentials</h2>
      <p>Before you design anything, save these in one note:</p>
      <ul>
        <li>Couple and parent names (as families want them printed)</li>
        <li>Ceremony date, muhurtham or wedding window, and reception time</li>
        <li>Venue name, address and a Google Maps link</li>
        <li>2–6 photos you are happy to show relatives</li>
        <li>Language mix (for Kerala: English + Malayalam details is common)</li>
      </ul>

      <h2>2. Choose how the invite will be built</h2>
      <p>
        DIY template apps work for simple image cards. A hosted invitation page
        (like{" "}
        <Link href="/">Invyto</Link>) carries dates, map, timings and story in
        one link — easier when guests ask “where?” and “what time?” repeatedly.
        Message the maker on WhatsApp from your phone with your note and photos.
      </p>

      <h2>3. Review on your phone first</h2>
      <p>
        Open the draft link in Chrome or Safari on mobile. Check that the map
        opens, the countdown (if any) is correct, and names/spellings match what
        elders expect. Ask one relative to open the same link on a slower
        network.
      </p>

      <h2>4. Share on WhatsApp</h2>
      <p>
        Paste a short intro message plus the link into family groups and close
        chats. For a ready message format, see{" "}
        <Link href="/blog/whatsapp-wedding-invitation-message-format">
          WhatsApp wedding invitation message format
        </Link>
        .
      </p>

      <h2>5. Edit if details change</h2>
      <p>
        Venue or timing changes are normal. With a hosted link you can usually
        update the same URL so you do not resend a new card. Confirm edit limits
        when you book.
      </p>

      <p>
        Prefer to start with examples? Open our{" "}
        <Link href="/#live-examples">live wedding invitations</Link>, then{" "}
        <Link href="/contact">contact us on WhatsApp</Link>.
      </p>
    </BlogArticle>
  );
}
