import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("whatsapp-broadcast-vs-group-wedding-invite")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        Every family has that one WhatsApp group with sixty relatives, forty
        unread messages and a good-morning image from someone&apos;s uncle. It
        is tempting to drop your wedding invitation straight into it. Please
        don&apos;t — or at least, don&apos;t only do that. Here is why
        broadcast lists usually work better, and when a group is fine.
      </p>

      <h2>What actually goes wrong in a big group</h2>
      <ul>
        <li>
          Your invite scrolls away within an hour under forwards and replies.
        </li>
        <li>
          Everyone sees everyone&apos;s reactions, so a question like “Is
          parking available?” gets answered five times, sometimes wrongly.
        </li>
        <li>
          Guests who are not in that group at all get nothing — and hear it
          second-hand.
        </li>
        <li>
          Cousins start side conversations about who is invited to what.
          That is the last thing you want during planning.
        </li>
      </ul>

      <h2>Why a broadcast list feels more personal</h2>
      <p>
        A broadcast message arrives in each person&apos;s own chat with you, as
        if you wrote only to them. There is no group noise, and replies come
        back privately. Remember one catch: broadcasts only reach people who
        have saved your number, so ask close relatives and friends to save it
        before you start. Otherwise the message may not show up at all.
      </p>
      <p>
        A broadcast list also holds only a limited number of contacts, so most
        couples end up making two or three lists. That works in your favour —
        it forces you to sort guests properly.
      </p>

      <h2>How Kerala couples usually split the lists</h2>
      <p>
        There is no rule, but this split comes up often in the weddings we
        see:
      </p>
      <ol>
        <li>
          <strong>Family and elders:</strong> sent after a phone call. Often
          includes both muhurtham and sadya details.
        </li>
        <li>
          <strong>Close friends:</strong> a warmer, shorter message with a joke
          or two.
        </li>
        <li>
          <strong>Reception-only guests:</strong> office colleagues, neighbours,
          your parents&apos; business contacts. Send them just the reception
          time and venue.
        </li>
        <li>
          <strong>Out-of-town and Gulf relatives:</strong> include the map, the
          nearest railway station or airport, and any stay arrangements.
        </li>
      </ol>
      <p>
        Splitting like this also protects you from awkward questions. Someone
        invited only to the reception does not need to wonder why the morning
        muhurtham is not for them.
      </p>

      <h2>When a group is fine</h2>
      <p>
        A small group of your own close friends, or the immediate family group
        for the wedding committee, is a perfectly good place to share the link
        and pin it. That is where you coordinate who is picking up whom from
        the station. Just do not make it the only way an invitation travels.
      </p>

      <h2>A message that works in either case</h2>
      <p>
        Whatever list you use, add two lines of your own before the link.
        Something like:
      </p>
      <ul>
        <li>
          “Hi Ammayi, Anu&apos;s wedding is on the 14th morning at the hall in
          Kannur. Details and map are in the link — please do come.”
        </li>
        <li>“Machane, it&apos;s happening. Link below. Be there by 9:30.”</li>
      </ul>
      <p>
        For more message ideas, see{" "}
        <Link href="/blog/whatsapp-wedding-invitation-message-format">
          our WhatsApp wedding invitation message format
        </Link>
        .
      </p>

      <h2>A quick checklist before you hit send</h2>
      <ul>
        <li>Ask key people to save your number first.</li>
        <li>Open the link once on your own phone, on mobile data.</li>
        <li>Keep a separate note of who got which list.</li>
        <li>Send elders the link only after calling them.</li>
      </ul>

      <p>
        If you would like a single clean link to send on any list, take a look
        at the <Link href="/wedding-invitations">invitation designs</Link> or
        write to us from <Link href="/contact">the contact page</Link>.
      </p>
    </BlogArticle>
  );
}
