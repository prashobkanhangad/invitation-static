import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("how-much-does-digital-wedding-invitation-cost-india")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        Couples ask us for the price within the first two messages, which is
        fair. The honest answer is that digital invitations in India range from
        nearly free templates to custom-designed pages that cost as much as a
        modest printed run. What you pay depends on a few clear things, and
        knowing them helps you compare quotes without being confused.
      </p>

      <h2>What changes the price</h2>
      <ul>
        <li>
          <strong>Custom design versus template.</strong> A template with your
          names and photos is the cheapest route. A page designed around your
          story, colours and language costs more.
        </li>
        <li>
          <strong>Languages.</strong> English only is simplest. English with
          Malayalam, Hindi or Tamil needs proofreading and careful layout.
        </li>
        <li>
          <strong>Number of events.</strong> One muhurtham is one block.
          Engagement, mehendi, muhurtham and reception add sections and
          maps.
        </li>
        <li>
          <strong>Photos and extras.</strong> A gallery, music, a short story
          or a countdown add time.
        </li>
        <li>
          <strong>Speed.</strong> A rush job a week before the wedding usually
          costs more than a calm two-week plan.
        </li>
        <li>
          <strong>Changes after launch.</strong> Some providers include edits,
          others charge each time. Ask this before you pay.
        </li>
      </ul>

      <h2>What to ask any provider</h2>
      <ol>
        <li>Is the page hosted, and for how long after the wedding?</li>
        <li>Can I edit the date, time or venue after sending?</li>
        <li>Does the map button open Google Maps directly?</li>
        <li>How many rounds of changes are included?</li>
        <li>Will it load fast on a slow mobile network?</li>
        <li>Who owns the photos and the link once it is done?</li>
      </ol>

      <h2>Comparing with printed cards</h2>
      <p>
        Printed cards add up quietly: the card itself, the envelope, printing
        minimums, delivery, and often a second run because the first count
        falls short. With a large Kerala guest list, that becomes a real
        part of the budget. A digital link has no per-guest cost, which is why
        many families now do a link for everyone and a small printed batch for
        elders and the closest relatives. A fuller comparison is in{" "}
        <Link href="/compare/digital-vs-printed-wedding-invitations">
          digital vs printed wedding invitations
        </Link>
        .
      </p>

      <h2>Where couples overspend</h2>
      <ul>
        <li>Paying for animation that slows the page on older phones.</li>
        <li>
          Paying for a long video when guests need a map and a muhurtham
          time. See{" "}
          <Link href="/blog/digital-vs-video-wedding-invitation-whatsapp">
            link vs video
          </Link>
          .
        </li>
        <li>Rush fees because the details were not agreed in time.</li>
        <li>Buying a separate design for each function when one page works.</li>
      </ul>

      <h2>Where it is worth spending a little more</h2>
      <ul>
        <li>Good proofreading of Malayalam text.</li>
        <li>A well-placed map with the correct gate.</li>
        <li>Clear, large text for elders.</li>
        <li>The ability to update the page when details change.</li>
      </ul>

      <h2>How to set a sensible budget</h2>
      <p>
        Think of the invitation as a small part of your overall wedding spend,
        not one of the main costs. Decide first what must be on it: languages,
        number of events, whether a printed card is also needed. Then ask two
        or three providers for the same scope, not the same price. A quote
        that looks cheap but excludes edits and hosting is not actually cheaper.
      </p>

      <h2>See our pricing</h2>
      <p>
        We keep our packages on the <Link href="/pricing">pricing page</Link>,
        so you can read them without a call. If your needs are different, such
        as multiple languages or several events, <Link href="/contact">message
        us</Link> and we will give you a clear quote. You can also see finished
        pages in the <Link href="/#live-examples">live examples</Link>.
      </p>
    </BlogArticle>
  );
}
