import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("when-to-send-digital-wedding-invitation-whatsapp")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        Most couples ask us the same thing a few weeks before the wedding: “Is
        it too early to send the link? Too late?” There is no single perfect
        day, but there is a rhythm that works for most Indian weddings, and
        Kerala ones in particular. Here is how we usually suggest planning it.
      </p>

      <h2>The rough timeline that works</h2>
      <p>
        For a wedding with out-of-town relatives, a first share around four to
        six weeks before the muhurtham is comfortable. People need time to
        apply for leave, book train tickets (Kerala to Bengaluru and Gulf
        flights fill up fast around wedding season), and decide who is
        travelling with whom. If most of your guests are local, three weeks is
        usually fine.
      </p>
      <ol>
        <li>
          <strong>Four to six weeks out:</strong> first share to close family,
          elders and anyone travelling.
        </li>
        <li>
          <strong>Three weeks out:</strong> the wider list — friends,
          colleagues, neighbours, the extended family WhatsApp contacts.
        </li>
        <li>
          <strong>One week out:</strong> a short reminder with the map and the
          muhurtham time.
        </li>
        <li>
          <strong>Day before:</strong> a one-line message to people coming from
          far, with parking or gate details.
        </li>
      </ol>

      <h2>Send to elders first, and call</h2>
      <p>
        In most families, the parents&apos; side should hear about the wedding
        from a person, not a forward. Call your grandparents, your chithappa
        and ammayi, the uncle who organised your cousin&apos;s wedding — then
        send the link while you are still on the call or right after. It takes
        a few minutes and avoids the “we heard from someone else” complaint.
        If you are unsure how elders feel about a link, read{" "}
        <Link href="/blog/is-digital-wedding-invitation-ok-for-elders">
          is a digital wedding invitation OK for elders
        </Link>
        .
      </p>

      <h2>Avoid sending too early</h2>
      <p>
        Sending six months ahead feels generous, but the message gets buried.
        People forget, and every small change — hall, reception time — means a
        new round of corrections. Unless it is a destination wedding or a
        date in peak season when hotels vanish, a save-the-date is enough that
        far in advance. (We explain the difference in{" "}
        <Link href="/blog/save-the-date-vs-wedding-invitation-whatsapp">
          save the date vs wedding invitation
        </Link>
        .)
      </p>

      <h2>Timing around the muhurtham</h2>
      <p>
        Many Kerala weddings have a muhurtham window in the morning — often
        between 9:00 and 10:30 — followed by sadya and sometimes a reception
        the same evening or the day before. Guests plan their whole day around
        that one window, so say it clearly. A line like this on the invite or
        in your message helps:
      </p>
      <ul>
        <li>Muhurtham: 10:15 AM to 10:45 AM. Please be seated by 9:45 AM.</li>
        <li>Sadya from 12:00 PM.</li>
        <li>Reception on the previous evening, 6:30 PM onwards.</li>
      </ul>
      <p>
        Also tell your caterer your rough headcount once most replies and calls
        are in. Sadya numbers are usually fixed several days ahead, so
        sending late means you are guessing.
      </p>

      <h2>What to do when details change late</h2>
      <p>
        Muhurtham shifts, a hall gets double-booked, a road closes — it
        happens. If you use a hosted link, you can update the page and send a
        short note: “Venue entrance has changed, please check the updated map
        in the same link.” Do not forward a fresh image to everyone; two
        versions floating in different chats is how people end up at the wrong
        gate. Call the elders and the people travelling by road directly.
      </p>

      <h2>Common mistakes</h2>
      <ul>
        <li>Sending the link late at night with no message — add one line.</li>
        <li>Sending before the hall booking is confirmed in writing.</li>
        <li>Forgetting to send the reminder with the map a week before.</li>
        <li>Sharing the link before checking it on your own phone, on mobile data.</li>
      </ul>

      <p>
        If you want to see how a finished page looks before deciding your
        timeline, open the{" "}
        <Link href="/#live-examples">live examples</Link> or message us on{" "}
        <Link href="/contact">the contact page</Link>. We are happy to talk
        through your dates.
      </p>
    </BlogArticle>
  );
}
