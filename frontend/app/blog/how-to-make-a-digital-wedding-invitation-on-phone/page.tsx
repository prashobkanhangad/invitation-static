import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("how-to-make-a-digital-wedding-invitation-on-phone")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        You do not need a laptop or a designer on call to make a digital
        wedding invitation. Most couples in Kerala today do the whole thing from
        their phones: collect the details in a WhatsApp chat or Notes app, send
        them to an invitation maker, check the draft on mobile, and share one
        link with family. Guests tap it and it opens in the browser. No app, no
        login, no &quot;storage full&quot; problem.
      </p>
      <p>
        This guide walks through the steps in the order they actually happen,
        including the small things that usually cause delays.
      </p>

      <h2>1. Collect the details in one note</h2>
      <p>
        Most delays come from missing information, not design. Before you
        contact anyone, open Notes and put these in a single place:
      </p>
      <ul>
        <li>
          Names of the couple, spelled the way elders expect to see them (check
          initials, house names and titles)
        </li>
        <li>Parents&apos; names and the place they are known by</li>
        <li>
          Date and day of the wedding, muhurtham window, and reception date and
          time if it is separate
        </li>
        <li>Venue name, full address and the Google Maps pin</li>
        <li>Contact numbers for one or two family members who can answer calls</li>
        <li>
          Two to six photos that you are comfortable showing to every uncle and
          aunty on the list
        </li>
        <li>Anything special: dress code, parking, stay arrangements for outstation guests</li>
      </ul>
      <p>
        Ask both families to confirm the note before it goes to anyone. A
        spelling mistake caught now costs nothing. After the link is shared in
        ten WhatsApp groups, it costs a lot of awkward phone calls.
      </p>

      <h2>2. Pick your photos with a phone screen in mind</h2>
      <p>
        Photos that look fine on a laptop can look muddy on a small screen.
        Choose pictures with a clear face and a plain background. Send them as
        a document in WhatsApp (tap the paperclip, then Document) so the quality
        is not squeezed. If you send them as normal photos, WhatsApp compresses
        them and the invitation will look blurry.
      </p>
      <p>
        Skip heavily filtered photos and group shots where faces are tiny. A
        simple pre-wedding photo or a calm portrait works better than anything
        busy.
      </p>

      <h2>3. Decide the type of invitation</h2>
      <p>
        There are really two options. A template app gives you an image card
        that you forward. It is quick, but dates, the map link and timings all
        live in the caption, and that gets lost in group chats. A hosted
        invitation page keeps everything on one link: schedule, venue map,
        contact and story. When a relative asks &quot;what time is the muhurtham?&quot;
        for the fourth time, you can simply point them to the link.
      </p>
      <p>
        For Kerala weddings with a muhurtham, a reception and sometimes a
        separate engagement or haldi, the hosted page is easier to manage. You
        can see the styles on our{" "}
        <Link href="/wedding-invitations">wedding invitation types</Link> page
        or open the{" "}
        <Link href="/#live-examples">live examples</Link> on your phone.
      </p>

      <h2>4. Send the details to the maker on WhatsApp</h2>
      <p>
        Message your note, the photos and the language you want (English,
        Malayalam or both). If you are not sure how to word the families&apos;
        lines, look at{" "}
        <Link href="/blog/malayalam-wedding-invitation-wording">
          Malayalam wedding invitation wording
        </Link>{" "}
        or{" "}
        <Link href="/blog/hindu-wedding-invitation-wording">
          Hindu wedding invitation wording
        </Link>{" "}
        and copy what suits your family. You can also{" "}
        <Link href="/contact">message Invyto directly</Link> and we will
        suggest wording.
      </p>

      <h2>5. Check the draft on two phones</h2>
      <p>
        When the draft link arrives, open it on your phone first. Then ask
        someone with a different phone (an Android if you use an iPhone, or the
        other way round) to open it. Check this list:
      </p>
      <ul>
        <li>Do both names and both parents&apos; names look correct?</li>
        <li>Is the date, day and muhurtham time right? Read it twice.</li>
        <li>Does the map button open Google Maps at the right hall?</li>
        <li>Does the page load on mobile data, not only on home Wi-Fi?</li>
        <li>Is the text easy to read without zooming?</li>
      </ul>
      <p>
        If you are unsure about the map, our note on{" "}
        <Link href="/blog/how-to-add-google-maps-to-wedding-invitation">
          adding Google Maps to a wedding invitation
        </Link>{" "}
        explains how to share a pin that does not send guests to the wrong
        gate.
      </p>

      <h2>6. Share it the right way</h2>
      <p>
        Write a short message and put the link on its own line. Do not paste
        the whole schedule into the chat. A few ready-to-use formats are in{" "}
        <Link href="/blog/whatsapp-wedding-invitation-message-format">
          WhatsApp wedding invitation message format
        </Link>
        . For timing, see{" "}
        <Link href="/blog/when-to-send-digital-wedding-invitation-whatsapp">
          when to send the digital invitation
        </Link>
        . Most families start with the closest relatives and then move to
        friends and colleagues over the next few days.
      </p>

      <h2>Common mistakes to avoid</h2>
      <ul>
        <li>
          <strong>Sending before the venue is final.</strong> If the hall is
          still being discussed, wait. Changing a printed card is impossible;
          changing a link is possible but still confusing for guests.
        </li>
        <li>
          <strong>Sharing a screenshot instead of the link.</strong> A
          screenshot cannot open a map or update later.
        </li>
        <li>
          <strong>Forgetting the elders.</strong> Share the link, but also
          call. Our note on{" "}
          <Link href="/blog/is-digital-wedding-invitation-ok-for-elders">
            digital invitations and elders
          </Link>{" "}
          covers how to do this politely.
        </li>
        <li>
          <strong>Using the wrong time format.</strong> Write the muhurtham as
          a clear range and mention AM or PM. &quot;9.30 to 10.30&quot; confuses people
          who read it at night.
        </li>
        <li>
          <strong>Skipping the checklist.</strong> Use the{" "}
          <Link href="/blog/digital-wedding-invitation-checklist-india">
            digital wedding invitation checklist
          </Link>{" "}
          once before you share.
        </li>
      </ul>

      <h2>What if something changes later?</h2>
      <p>
        Hall timings shift, a reception moves a day, a phone number changes.
        With a hosted link, the maker can usually update the same page so
        nobody needs a second invitation. Ask about edit limits and how fast
        changes go live before you book. If you are comparing this with paper,{" "}
        <Link href="/compare/digital-vs-printed-wedding-invitations">
          digital vs printed wedding invitations
        </Link>{" "}
        shows where each one makes more sense. For costs, see{" "}
        <Link href="/blog/how-much-does-digital-wedding-invitation-cost-india">
          how much a digital invitation costs in India
        </Link>
        .
      </p>

      <p>
        Want to see how it looks before you decide? Open the{" "}
        <Link href="/#live-examples">live invitation examples</Link> on your
        phone, then <Link href="/contact">send us your details on WhatsApp</Link>.
      </p>
    </BlogArticle>
  );
}
