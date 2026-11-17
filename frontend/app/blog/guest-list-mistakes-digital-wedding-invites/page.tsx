import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("guest-list-mistakes-digital-wedding-invites")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        The invitation design is usually the easy part. The guest list is where
        weddings quietly go wrong. With paper cards, a missed name is one
        awkward visit. With WhatsApp, a missed name becomes “Did you see Priya
        got the link and I did not?” in three family groups by evening. Here
        are the mistakes we see most, and how to avoid them.
      </p>

      <h2>1. Building the list from one phone</h2>
      <p>
        Your list should not live only in your own contacts. Parents have
        relatives you have not spoken to in years, and their friends, neighbours
        and business contacts are often a big part of the crowd. Sit with both
        sets of parents and write names on paper first. Then add numbers. It is
        slower, but it surfaces the uncle you forgot to include.
      </p>

      <h2>2. Missing elders because they do not use WhatsApp</h2>
      <p>
        Some grandparents and older relatives have no smartphone. They are
        usually the ones who would be most hurt if they heard through someone
        else. Mark them clearly and plan a call or a visit, and send the link
        to their son or daughter to show them. Our notes in{" "}
        <Link href="/blog/is-digital-wedding-invitation-ok-for-elders">
          is a digital wedding invitation OK for elders
        </Link>{" "}
        go into this further.
      </p>

      <h2>3. One list for everyone</h2>
      <p>
        Not everyone is invited to everything. If the muhurtham is for family
        and close friends and the reception is open to the wider circle, a
        single message to everyone creates confusion and sometimes offence.
        Make separate lists, and see{" "}
        <Link href="/blog/whatsapp-broadcast-vs-group-wedding-invite">
          broadcast vs group
        </Link>{" "}
        for how to send them.
      </p>

      <h2>4. Wrong numbers and old numbers</h2>
      <ul>
        <li>People change numbers. Gulf relatives often hold two.</li>
        <li>
          Landline-only elders need a call, not a link sent to a dead number.
        </li>
        <li>
          Double-check anyone you have not messaged in over a year before the
          big send.
        </li>
      </ul>

      <h2>5. Not tracking who has been told</h2>
      <p>
        Keep a simple sheet or notebook with three columns: name, how you told
        them (call, visit, link), and whether they confirmed. This is also what
        your caterer will quietly thank you for, because sadya headcount is
        fixed days ahead and a rough number from a clear list is far better
        than a guess.
      </p>

      <h2>6. Adding people at the last minute</h2>
      <p>
        We understand the pressure, because someone always says “Please add my
        friend too.” Decide a cutoff date with your family — say a week
        before — and hold it. Last-minute additions change the headcount,
        seating and food, and sometimes the hall&apos;s capacity.
      </p>

      <h2>7. Forgetting out-of-town guests need more</h2>
      <p>
        Relatives coming from the Gulf, Bengaluru or Chennai need the exact
        muhurtham window, the venue gate and sometimes stay information. Send
        them the link earlier than everyone else. A short message beyond the
        link helps:
      </p>
      <ul>
        <li>
          “Chechi, muhurtham at 10:30 AM, so please plan to reach the previous
          evening. We have kept a few rooms near the hall. Call me if you need
          them.”
        </li>
      </ul>

      <h2>A quick fix list</h2>
      <ol>
        <li>Write the list on paper with both families.</li>
        <li>Split into ceremony, reception, and out-of-town.</li>
        <li>Mark elders who need a call.</li>
        <li>Verify numbers for older and Gulf contacts.</li>
        <li>Pick a cutoff date for additions.</li>
        <li>Track who has been told in one shared sheet.</li>
      </ol>

      <p>
        Once your list is ready, a single clean link makes sending easier. See
        our <Link href="/wedding-invitations">invitation designs</Link> or{" "}
        <Link href="/contact">talk to us</Link> if you want help setting it up.
      </p>
    </BlogArticle>
  );
}
