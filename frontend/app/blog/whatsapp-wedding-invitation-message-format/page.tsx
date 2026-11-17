import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("whatsapp-wedding-invitation-message-format")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        The message you type above your invitation link matters more than most
        people think. It is the first thing your uncle, your college friend or
        your boss reads, and it decides whether the invite feels warm or feels
        like a forward. The good news: it can be short. Greet the person, name
        the couple and the date, add the link, and close politely. The link
        holds the venue map, the muhurtham and everything else.
      </p>
      <p>
        Below are formats you can copy and change, grouped by who you are
        sending to. Replace the brackets with your details.
      </p>

      <h2>Format 1: Close family and relatives</h2>
      <p>
        Namaskaram [Name],
        <br />
        With the blessings of our families, we are happy to invite you and
        family to the wedding of [Bride] &amp; [Groom] on [Day, Date].
        <br />
        Muhurtham, venue and directions are all in this link:
        <br />
        [Invitation link]
        <br />
        Please come and bless us. We will call you as well.
      </p>
      <p>
        That last line is not decoration. For aunts and uncles, the message is
        only the start; the call is what they count as the real invitation.
      </p>

      <h2>Format 2: Family WhatsApp group</h2>
      <p>
        Dear all,
        <br />
        Sharing the invitation for [Bride] &amp; [Groom]&apos;s wedding on
        [Date]. Please open the link for muhurtham time, reception and venue
        map.
        <br />
        [Invitation link]
        <br />
        Please forward to relatives who are not in this group. Looking forward
        to seeing everyone.
      </p>
      <p>
        In big family groups, ask one person to pin the message. Otherwise it
        disappears under good-morning forwards within a day.
      </p>

      <h2>Format 3: Friends and college groups</h2>
      <p>
        Hi all,
        <br />
        We are getting married on [Date] in [City]! Date, venue and the
        schedule are in this link:
        <br />
        [Invitation link]
        <br />
        Please come, and tell us if you are travelling so we can help with
        stay.
      </p>

      <h2>Format 4: Colleagues and office contacts</h2>
      <p>
        Hello [Name],
        <br />
        I am getting married on [Date] at [Town]. It would be nice to have you
        there. Details are in the link:
        <br />
        [Invitation link]
        <br />
        Kindly come if you can.
      </p>
      <p>
        Keep this one formal and brief. Do not paste a reception schedule in
        the chat for someone you meet only at work.
      </p>

      <h2>Format 5: A Malayalam-leaning message</h2>
      <p>
        Many Kerala families prefer to open in Malayalam and let the page carry
        English. A simple version:
      </p>
      <p>
        സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു. [Bride] &amp; [Groom] വിവാഹം [Date] ന്.
        <br />
        വിശദവിവരങ്ങൾക്ക്: [Invitation link]
        <br />
        എല്ലാവരും വരണം, അനുഗ്രഹിക്കണം.
      </p>
      <p>
        For fuller wording options, see{" "}
        <Link href="/blog/malayalam-wedding-invitation-wording">
          Malayalam wedding invitation wording
        </Link>{" "}
        and{" "}
        <Link href="/blog/hindu-wedding-invitation-wording">
          Hindu wedding invitation wording
        </Link>
        .
      </p>

      <h2>Small things that reduce follow-up questions</h2>
      <ul>
        <li>
          Put the link on its own line so WhatsApp shows a clean preview
          instead of burying it inside a paragraph.
        </li>
        <li>
          Mention the city once in the text. Leave the full address to the
          page.
        </li>
        <li>
          Do not paste the full schedule into the chat. If you do, the message
          and the page will disagree the day something changes.
        </li>
        <li>
          Address people by name when you can. &quot;Dear Sir/Madam&quot; copy-pasted to
          200 people reads like spam.
        </li>
        <li>
          Send between mid-morning and early evening. Messages at midnight look
          like forwards, not invitations.
        </li>
      </ul>

      <h2>Mistakes we see often</h2>
      <ul>
        <li>
          <strong>Forwarding the same long text to everyone.</strong> If you
          are sending to many people, a broadcast list is fine, but choose
          carefully. Our comparison of{" "}
          <Link href="/blog/whatsapp-broadcast-vs-group-wedding-invite">
            WhatsApp broadcast vs group invites
          </Link>{" "}
          explains when each works.
        </li>
        <li>
          <strong>Sending the link with no message.</strong> A bare link looks
          rude, especially to elders.
        </li>
        <li>
          <strong>Typing the date as 12/04.</strong> People abroad and people
          at home read it differently. Write &quot;12 April&quot;.
        </li>
        <li>
          <strong>Skipping a save-the-date.</strong> If the wedding is far
          away, see{" "}
          <Link href="/blog/save-the-date-vs-wedding-invitation-whatsapp">
            save the date vs wedding invitation
          </Link>
          .
        </li>
        <li>
          <strong>Assuming elders will open the link.</strong> Call them, then
          send it. See{" "}
          <Link href="/blog/is-digital-wedding-invitation-ok-for-elders">
            digital invites and elders
          </Link>
          .
        </li>
      </ul>

      <h2>Before you press send</h2>
      <p>
        Open your own link once on mobile data. Check the date, the muhurtham
        and the map. Then send to two trusted people first and ask if anything
        looks off. If you do not have the invitation page yet,{" "}
        <Link href="/blog/how-to-make-a-digital-wedding-invitation-on-phone">
          here is how to make one from your phone
        </Link>
        , and you can see the{" "}
        <Link href="/wedding-invitations">different invitation styles</Link>{" "}
        we offer.
      </p>

      <p>
        Compare designs on the{" "}
        <Link href="/#live-examples">live examples</Link> section, or{" "}
        <Link href="/contact">message Invyto on WhatsApp</Link> and we will set
        up your link.
      </p>
    </BlogArticle>
  );
}
