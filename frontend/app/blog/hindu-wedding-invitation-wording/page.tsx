import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("hindu-wedding-invitation-wording")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        A Hindu wedding invitation has to do a few jobs at once: invoke a
        blessing, introduce both families properly, and give guests the
        muhurtham, venue and reception details without making them scroll
        forever. On a printed card, a long formal paragraph is fine. On a phone
        screen, it is not. Most people open the link on WhatsApp, look for the
        date, and close it. Put the important lines first and keep the formal
        wording tidy.
      </p>
      <p>
        These are sample lines and notes you can adapt if your family
        follows Kerala, Tamil, Telugu, Kannada or North Indian customs.
      </p>

      <h2>Opening line or invocation</h2>
      <p>
        Many families begin with a short line to a deity, such as Ganesha or
        the family deity (kuladevata). Keep it to a single line. If the
        invocation takes up half of the first screen, guests have to scroll
        before they see the names. Some families leave it out of the chat
        message and keep it only on the invitation page. Both are fine.
      </p>

      <h2>Main invitation wording</h2>
      <p>
        &quot;With the blessings of the Almighty and our elders, we request the
        pleasure of your company on the auspicious occasion of the marriage of
        [Bride], daughter of [Father] &amp; [Mother], with [Groom], son of
        [Father] &amp; [Mother].&quot;
      </p>
      <p>
        If the family prefers the groom first, reverse the order. Follow what
        your family has done for earlier weddings, because elders notice it.
      </p>

      <h2>Muhurtham and ceremony details</h2>
      <p>
        &quot;The marriage will be solemnized on [Day, Date] at [Venue], [Town].
        Muhurtham: [start time] to [end time].&quot;
      </p>
      <p>
        Write the time with AM or PM. If the muhurtham is early morning, say so
        clearly: &quot;6.00 AM to 7.30 AM&quot; is better than &quot;6 to 7.30&quot;. Out-of-town
        guests plan their train or bus around it. If you want to mention
        nakshatra or lagna, do it in a small line below. Not every family
        wants it public.
      </p>

      <h2>Reception wording</h2>
      <p>
        &quot;Reception: [Day, Date] from [time] onwards at [Venue].&quot;
      </p>
      <p>
        If the reception is the evening before the muhurtham, say so in plain
        words, for example &quot;the evening before the wedding&quot;. This one line
        prevents the most common mix-up: guests turning up a day late or a day
        early. Our note on{" "}
        <Link href="/blog/kerala-wedding-invitation-muhurtham-reception-details">
          muhurtham and reception details
        </Link>{" "}
        has more examples of how to lay this out.
      </p>

      <h2>Optional pre-wedding events</h2>
      <p>
        If the family is inviting people to events like haldi, mehendi,
        sangeet or an engagement, list each in one line with date, time and
        venue. Mark which ones are for close family only. This avoids the
        awkward moment of a colleague showing up at a private ceremony because
        it was listed without any note.
      </p>

      <h2>Closing lines</h2>
      <p>
        &quot;Your presence and blessings will bring us great joy. With regards,
        [Family names].&quot;
      </p>
      <p>
        &quot;Kindly bless the couple. For any help on travel or stay, please
        contact [Name] on [Number].&quot;
      </p>

      <h2>Digital invitation checklist</h2>
      <ul>
        <li>
          Add one button for Google Maps. Our guide to{" "}
          <Link href="/blog/how-to-add-google-maps-to-wedding-invitation">
            adding Google Maps to a wedding invitation
          </Link>{" "}
          shows how to pick the right pin.
        </li>
        <li>
          Include a contact number for a family member who actually picks up
          the phone.
        </li>
        <li>
          Keep the font large enough for older guests to read without zooming.
        </li>
        <li>
          Mention dress notes only if they matter, for example traditional wear
          for the main ceremony.
        </li>
        <li>
          Write the date as &quot;22 November 2026&quot; and avoid 22/11 formats.
        </li>
        <li>
          Share it with a short chat message. See{" "}
          <Link href="/blog/whatsapp-wedding-invitation-message-format">
            WhatsApp message formats
          </Link>
          .
        </li>
      </ul>

      <h2>Mistakes to avoid</h2>
      <ul>
        <li>
          <strong>Copying a template from another community.</strong> Rituals,
          titles and sequence differ. A Nair family, an Iyer family and a
          Marwari family will not word things the same way.
        </li>
        <li>
          <strong>Listing only first names.</strong> Elders expect parents and
          sometimes grandparents to be named properly.
        </li>
        <li>
          <strong>Hiding the muhurtham in the third paragraph.</strong> Put the
          day, date and time within the first screen.
        </li>
        <li>
          <strong>Forgetting to check with the priest.</strong> Confirm the
          muhurtham time and name spellings with the priest before they go in
          writing.
        </li>
        <li>
          <strong>Skipping a personal call for elders.</strong> Read{" "}
          <Link href="/blog/is-digital-wedding-invitation-ok-for-elders">
            digital invitations and elders
          </Link>{" "}
          before you send to grandparents.
        </li>
      </ul>

      <h2>Where to look next</h2>
      <p>
        The{" "}
        <Link href="/wedding-invitations/hindu">Hindu wedding invitation</Link>{" "}
        page shows how this wording sits inside a finished e-invite, and a live
        example is <Link href="/puneeth-suma">Puneeth &amp; Suma</Link>. If you
        are still deciding between formats, read{" "}
        <Link href="/compare/digital-vs-printed-wedding-invitations">
          digital vs printed wedding invitations
        </Link>
        . For Kerala-style Malayalam wording, see{" "}
        <Link href="/blog/malayalam-wedding-invitation-wording">
          Malayalam wedding invitation wording
        </Link>
        .
      </p>

      <p>
        Open the <Link href="/#live-examples">live examples</Link> on your
        phone, or <Link href="/contact">contact Invyto</Link> with your
        wording and we will set up the page.
      </p>
    </BlogArticle>
  );
}
