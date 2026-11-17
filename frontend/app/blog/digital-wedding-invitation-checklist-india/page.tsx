import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("digital-wedding-invitation-checklist-india")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        Once your invite link goes out on WhatsApp, it is in a hundred phones
        within an hour. A typo in the muhurtham time then becomes a family
        group discussion. This checklist is what we walk couples through
        before they press send. Keep it open on your phone and tick things off
        with a parent or sibling beside you — a second pair of eyes catches a
        lot.
      </p>

      <h2>1. Names, spellings and order</h2>
      <ul>
        <li>
          Bride and groom names spelled the way your families write them
          (Anjana or Anjanaa? Jishnu or Jishnoo?).
        </li>
        <li>Parents&apos; names, with correct house names or initials.</li>
        <li>
          Who goes first — many families have a firm view on this. Ask before
          you design, not after.
        </li>
      </ul>

      <h2>2. Dates and timings</h2>
      <ul>
        <li>Date in both English and, if you want, Malayalam calendar form.</li>
        <li>
          Muhurtham written as a window, with a “please be seated by” time.
        </li>
        <li>Sadya or lunch time. Reception time if separate.</li>
        <li>
          Day of the week. Guests do check it against their leave plans.
        </li>
      </ul>
      <p>
        Ask your priest or family astrologer to confirm the final muhurtham in
        writing before it goes on the invite. A message saying “around 10” is
        not a muhurtham.
      </p>

      <h2>3. Venue and map</h2>
      <ul>
        <li>The hall name exactly as it appears on the Google Maps listing.</li>
        <li>
          The right entrance. Some halls have two gates on different roads.
        </li>
        <li>Parking note, especially for car-heavy weddings.</li>
        <li>Landmark line for older guests who do not use maps.</li>
      </ul>
      <p>
        We wrote a full piece on this:{" "}
        <Link href="/blog/how-to-add-google-maps-to-wedding-invitation">
          how to add Google Maps to a wedding invitation
        </Link>
        .
      </p>

      <h2>4. Photos and design</h2>
      <ul>
        <li>Use one or two good photos, not ten. Faces should be clear.</li>
        <li>Check how they crop on a small phone screen.</li>
        <li>
          Avoid text over busy parts of the photo — older eyes will struggle.
        </li>
      </ul>

      <h2>5. Language</h2>
      <p>
        Decide whether the main text is English, Malayalam or both. Many Kerala
        couples keep English for friends and Malayalam wording for family. If
        you want help with phrasing, see our notes on{" "}
        <Link href="/blog/malayalam-wedding-invitation-wording">
          Malayalam wedding invitation wording
        </Link>{" "}
        or browse the <Link href="/wedding-invitations/malayalam">Malayalam
        designs</Link>.
      </p>

      <h2>6. The phone preview test</h2>
      <p>
        Before sending, do this on a real phone, not a laptop:
      </p>
      <ol>
        <li>Open the link on mobile data, not home Wi-Fi.</li>
        <li>Open it on an older phone if someone in the house has one.</li>
        <li>Tap the map button and check where it leads.</li>
        <li>Read every line aloud once, slowly.</li>
        <li>Send it to yourself in WhatsApp and check the preview card.</li>
      </ol>

      <h2>7. Sending plan</h2>
      <ul>
        <li>Elders called first, then sent the link.</li>
        <li>Broadcast lists ready for family, friends and reception-only guests.</li>
        <li>A reminder message drafted for a week before.</li>
        <li>
          One person in the family, not five, handles any late changes.
        </li>
      </ul>

      <h2>Mistakes we see most</h2>
      <ul>
        <li>Wrong date format making Sunday look like Saturday.</li>
        <li>A reception time that does not match the hall booking.</li>
        <li>Forgetting the second venue when muhurtham and sadya are apart.</li>
        <li>Sending before the family has agreed on the guest list.</li>
      </ul>

      <p>
        Want to see this done well? Open the{" "}
        <Link href="/anjana-jishnu">Anjana and Jishnu invite</Link> to see how
        schedule, map and story sit together, or{" "}
        <Link href="/contact">message us</Link> and we will go through your
        details with you.
      </p>
    </BlogArticle>
  );
}
