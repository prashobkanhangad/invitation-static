import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("north-kerala-wedding-invitation-etiquette")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        In North Kerala — Kannur, Kasaragod, Kozhikode, Wayanad and nearby
        towns — a wedding invitation is rarely just information. It is a
        gesture. Who you call, who you visit, who you send a link to: families
        read meaning into all of it. Practices vary by community and family, so
        take this as common experience, not a rule book. Ask your own elders
        first.
      </p>

      <h2>Who gets a call or a visit</h2>
      <p>
        Parents, grandparents, maternal uncles and aunts, and the senior-most
        relatives on both sides are usually invited in person or by phone, and
        often both families go together for the closest ones. A link on
        its own can feel casual to them. Do the call, then send the link while
        you are talking or right after, so they can see the details. This is
        especially important for relatives who helped raise you or who
        contributed to wedding arrangements.
      </p>

      <h2>Who is fine with a link</h2>
      <ul>
        <li>Friends, college mates and office colleagues</li>
        <li>Cousins of your own age</li>
        <li>Neighbours and acquaintances of the family</li>
        <li>Gulf and out-of-state relatives who cannot be visited anyway</li>
      </ul>
      <p>
        A short personal line before the link matters here too. “Come with
        everyone” goes a long way.
      </p>

      <h2>Wording that feels warm, not stiff</h2>
      <p>
        Many North Kerala families prefer a respectful but affectionate tone.
        Include both sets of parents, use the household names your family
        uses, and keep the invitation line simple. If you are writing in
        Malayalam, keep it familiar and not too formal. Our{" "}
        <Link href="/blog/malayalam-wedding-invitation-wording">
          Malayalam wedding invitation wording
        </Link>{" "}
        has samples. For design styles, see{" "}
        <Link href="/wedding-invitations/malayalam">Malayalam invitations</Link>.
      </p>

      <h2>Keeping elders comfortable</h2>
      <ul>
        <li>Make the text large and the page easy to scroll.</li>
        <li>Put muhurtham and venue near the top, not under a long story.</li>
        <li>Offer a small printed card for anyone who prefers paper.</li>
        <li>
          Tell a younger relative to show them the link when you are not
          around.
        </li>
      </ul>
      <p>
        We cover this in more detail in{" "}
        <Link href="/blog/is-digital-wedding-invitation-ok-for-elders">
          our note on digital invitations and elders
        </Link>
        .
      </p>

      <h2>Sequence matters more than people admit</h2>
      <ol>
        <li>Tell parents&apos; side elders first, then the other side.</li>
        <li>Then close relatives and the immediate neighbourhood.</li>
        <li>Then friends and colleagues, by link.</li>
        <li>Send a reminder with the map close to the date.</li>
      </ol>
      <p>
        A relative who hears about the wedding from a WhatsApp forward before
        hearing from you may not say anything, but they will remember it.
      </p>

      <h2>Local practicalities</h2>
      <p>
        In many North Kerala weddings, the muhurtham is in the morning and
        sadya follows. Some are at the groom&apos;s house or a temple, others at
        an auditorium. Be clear which location is for which event, and add
        a map for each. Roads near older temples can be narrow, so mention
        parking and which gate to use. We cover that in{" "}
        <Link href="/blog/how-to-add-google-maps-to-wedding-invitation">
          adding Google Maps to your invitation
        </Link>
        .
      </p>

      <h2>Small gestures that help</h2>
      <ul>
        <li>Mention that you will be calling soon, when sending the link.</li>
        <li>Include a family contact number for questions.</li>
        <li>Say thanks in advance. It costs nothing.</li>
        <li>Do not use a group blast for the closest family.</li>
      </ul>

      <p>
        Want a calm, clear page that fits a North Kerala wedding? See the{" "}
        <Link href="/wedding-invitations/kerala">Kerala invitations</Link>, or{" "}
        <Link href="/anjana-jishnu">open a live invite</Link> for an idea of
        the layout. You can also <Link href="/contact">message us</Link>.
      </p>
    </BlogArticle>
  );
}
