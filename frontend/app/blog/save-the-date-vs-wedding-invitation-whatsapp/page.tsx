import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("save-the-date-vs-wedding-invitation-whatsapp")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        Couples often send a lovely save-the-date, and then two months later a
        full invitation. Half the guests think the second one is a different
        wedding. The other half lose the first and ask, “What was the date
        again?” Let us sort out what each is for, and how to avoid the mess.
      </p>

      <h2>What a save-the-date is</h2>
      <p>
        It is a short heads-up: names, date, city, and a line saying the full
        invitation will follow. It is not a request to attend. It is a polite
        way of saying “keep this day free.” You do not need a muhurtham time,
        a venue pin or a sadya note yet — often those are not even final.
      </p>

      <h2>What the full invitation is</h2>
      <p>
        This is the real thing: muhurtham window, venue with map, reception
        details, family names, and contact numbers. This is what guests plan
        their day around. Our{" "}
        <Link href="/blog/kerala-wedding-invitation-muhurtham-reception-details">
          Kerala invite details guide
        </Link>{" "}
        covers what goes in.
      </p>

      <h2>Who actually needs a save-the-date</h2>
      <ul>
        <li>Relatives travelling from the Gulf, the US or another state.</li>
        <li>Weddings in peak season, when trains and flights fill early.</li>
        <li>Destination weddings or ones in a smaller town with limited rooms.</li>
        <li>Close friends who will need to arrange leave.</li>
      </ul>
      <p>
        If most of your guests live within an hour of the hall, you can
        skip it. A phone call and a full invitation three weeks ahead is often
        enough. For timing, read{" "}
        <Link href="/blog/when-to-send-digital-wedding-invitation-whatsapp">
          when to send a digital wedding invitation
        </Link>
        .
      </p>

      <h2>The mistake that confuses relatives</h2>
      <p>
        Two different links, two different designs, no explanation. People save
        the first, ignore the second, and later cannot find either. Avoid this
        by following a simple rule:
      </p>
      <ol>
        <li>Keep the same names, photo and colours in both messages.</li>
        <li>
          In the second message, say plainly: “This is the full invitation. Please
          use this link from now on.”
        </li>
        <li>
          Do not change the date between the two unless you tell everyone
          clearly.
        </li>
      </ol>

      <h2>Sample lines you can copy</h2>
      <p>For the save-the-date:</p>
      <ul>
        <li>
          “Hi Chithappa, Anu and Jishnu are getting married on 14 February in
          Kannur. Please keep the day free. Full details soon.”
        </li>
      </ul>
      <p>For the full invitation:</p>
      <ul>
        <li>
          “Here are the full details of the wedding — muhurtham, venue and map
          are all in this link. Please do come with the family.”
        </li>
      </ul>

      <h2>Can the same link do both jobs?</h2>
      <p>
        Yes, and it is often the cleaner choice. With a hosted page, you can
        send the link early with only the date and city visible, then add the
        muhurtham, venue and schedule as they are confirmed. Guests keep the
        same link, and nobody has to hunt through old chats. That is one of
        the quiet advantages of a link over a forwarded image, and we touch on
        it in{" "}
        <Link href="/compare/digital-vs-printed-wedding-invitations">
          digital vs printed invitations
        </Link>
        .
      </p>

      <h2>When not to send either yet</h2>
      <ul>
        <li>Before the hall booking is confirmed in writing.</li>
        <li>Before the family has agreed on the date with the astrologer.</li>
        <li>When one side still wants to discuss the guest list.</li>
      </ul>

      <p>
        If you want to see how an early page grows into a full invite, look at
        the <Link href="/#live-examples">live examples</Link> or{" "}
        <Link href="/contact">message us</Link> and we will explain how
        updates work.
      </p>
    </BlogArticle>
  );
}
