import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("is-digital-wedding-invitation-ok-for-elders")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        Short answer: yes, for most of the list, but not for everyone and not
        alone. In India a WhatsApp invitation is now normal for friends,
        colleagues, cousins and relatives living abroad. For grandparents,
        uncles, aunts and anyone senior in the family, the link should come
        with a phone call, and sometimes a visit or a small printed card. The
        link carries the details. The call carries the respect.
      </p>
      <p>
        Here is how to think about it, who needs what, and what to say when an
        elder is not happy about getting only a message.
      </p>

      <h2>Why elders sometimes feel it is not enough</h2>
      <p>
        For older relatives, being invited is not only about knowing the date.
        It is about being asked in person. A card handed over, a visit with
        sweets, a call from the bride&apos;s or groom&apos;s father: these say
        &quot;you matter to this family&quot;. A link in a chat says &quot;here are the
        details&quot;. Both are useful, but they say different things. Problems
        start when the family sends only the second one to someone who expected
        the first.
      </p>
      <p>
        There is also a practical side. Many elders do not open links, find the
        text small, or hand the phone to a grandchild. Some have a basic phone
        and do not use WhatsApp at all.
      </p>

      <h2>When a digital invitation alone is fine</h2>
      <ul>
        <li>Friends, college groups and office colleagues</li>
        <li>Cousins and relatives who use WhatsApp daily</li>
        <li>Relatives in the Gulf, UK or US who need the map and timings</li>
        <li>Neighbours and acquaintances where a printed card is a formality</li>
        <li>Large guest lists where printing every card is a cost and a task</li>
      </ul>

      <h2>When to add a call, a visit or a card</h2>
      <ul>
        <li>Grandparents and the senior-most relatives on both sides</li>
        <li>Maternal uncles and aunts, and anyone with a ritual role</li>
        <li>People who have invited your family to their own weddings in person</li>
        <li>Anyone who asks for a &quot;proper&quot; card. Just give it, with a smile</li>
        <li>Family friends who are like family but not on a WhatsApp group</li>
      </ul>
      <p>
        A small run of 30 to 60 printed cards for these people usually costs
        far less than printing 500. It also looks more thoughtful than giving
        everyone the same thing.
      </p>

      <h2>A simple way to do both</h2>
      <ol>
        <li>
          Make one invitation link for the whole list. If you have not made one
          yet, see{" "}
          <Link href="/blog/how-to-make-a-digital-wedding-invitation-on-phone">
            how to make one from your phone
          </Link>
          .
        </li>
        <li>
          List your elders and senior relatives separately. Divide the calls
          between parents, siblings and cousins.
        </li>
        <li>
          Call first, then send the link while you are still talking, or just
          after: &quot;I am sending the details now, please look at it when you
          can.&quot;
        </li>
        <li>
          For those who do not use WhatsApp, read out the date, muhurtham and
          venue on the call, and send a printed card with a family member.
        </li>
        <li>
          Keep a short note of who has been invited how, so nobody is missed or
          called twice.
        </li>
      </ol>

      <h2>What to say on the call</h2>
      <p>
        Keep it simple and direct:
      </p>
      <p>
        &quot;Namaskaram, this is [Name]. [Bride] and [Groom]&apos;s wedding is on
        [Date] at [Venue]. We would like you to come with family and bless us.
        I am sending the details on WhatsApp. If it is difficult to open,
        [Name] will bring a card on [day].&quot;
      </p>
      <p>
        That is under a minute, and it covers the invitation, the date and a
        backup. If you need wording for the message that goes with the link,
        use one of the{" "}
        <Link href="/blog/whatsapp-wedding-invitation-message-format">
          WhatsApp message formats
        </Link>
        .
      </p>

      <h2>Make the digital invite easy for older eyes</h2>
      <ul>
        <li>Large text and strong contrast, with no tiny fonts on a busy photo</li>
        <li>Date, muhurtham and venue near the top</li>
        <li>One map button, clearly labelled</li>
        <li>A family phone number someone will answer</li>
        <li>
          A page that loads quickly on slower mobile data, which is common in
          smaller towns
        </li>
      </ul>
      <p>
        Wording matters too. Elders pay attention to how parents and families
        are named. See{" "}
        <Link href="/blog/malayalam-wedding-invitation-wording">
          Malayalam wedding invitation wording
        </Link>{" "}
        or{" "}
        <Link href="/blog/hindu-wedding-invitation-wording">
          Hindu wedding invitation wording
        </Link>{" "}
        for examples that suit your family. You can also check how Kerala
        families usually handle this in{" "}
        <Link href="/blog/north-kerala-wedding-invitation-etiquette">
          North Kerala wedding invitation etiquette
        </Link>
        .
      </p>

      <h2>Common mistakes</h2>
      <ul>
        <li>
          <strong>Sending the link to a grandparent&apos;s phone and leaving
          it there.</strong> Nobody will tell you it was not opened.
        </li>
        <li>
          <strong>Letting a cousin send it for you.</strong> For senior
          relatives, it should come from a parent or from you.
        </li>
        <li>
          <strong>Sending very late.</strong> Elders need time to plan travel
          and health. Read{" "}
          <Link href="/blog/when-to-send-digital-wedding-invitation-whatsapp">
            when to send the digital invitation
          </Link>
          .
        </li>
        <li>
          <strong>Assuming a forwarded image is enough.</strong> A proper
          page with a map and muhurtham is easier to trust than a forwarded
          picture.
        </li>
        <li>
          <strong>Skipping the guest list review.</strong> See{" "}
          <Link href="/blog/guest-list-mistakes-digital-wedding-invites">
            guest list mistakes in digital wedding invites
          </Link>{" "}
          to avoid leaving someone out.
        </li>
      </ul>

      <h2>Digital or printed: what is the real difference?</h2>
      <p>
        Printed cards feel formal and can be kept. Digital invitations are
        faster, cheaper, easy to update and easy to open on a map. Most
        families end up using both, and that is perfectly acceptable. Our{" "}
        <Link href="/compare/digital-vs-printed-wedding-invitations">
          digital vs printed wedding invitations
        </Link>{" "}
        comparison goes through cost, speed and etiquette in more detail.
      </p>

      <p>
        Want a link your whole family can open without help? See the{" "}
        <Link href="/#live-examples">live examples</Link>, explore{" "}
        <Link href="/wedding-invitations">wedding invitation types</Link>, or{" "}
        <Link href="/contact">message Invyto</Link>.
      </p>
    </BlogArticle>
  );
}
