import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("kerala-wedding-invitation-muhurtham-reception-details")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        A Kerala wedding is not one event. There might be a muhurtham at the
        temple or hall in the morning, sadya after, a reception the night
        before or the same evening, and a few family functions around it. Your
        invitation has to carry all of that without becoming a wall of text.
        Here is what guests actually look for.
      </p>

      <h2>The muhurtham, written as a window</h2>
      <p>
        Guests plan travel around this one line, so make it unmissable. Write
        the time window the priest has given, and add a separate arrival time.
        For example:
      </p>
      <ul>
        <li>Muhurtham: 10:15 AM to 10:45 AM</li>
        <li>Please be seated by 9:45 AM</li>
      </ul>
      <p>
        Many couples forget the second line. Guests then arrive at the exact
        muhurtham and stand at the back of a full hall. If the hall has
        a hard morning slot, mention that too.
      </p>

      <h2>Reception details</h2>
      <p>
        If the reception is on a different day or at a different place, give
        it its own block. Name the date, time, venue and a single map link.
        Do not bury it in a paragraph. Guests who are invited only to the
        reception will look for this section first, so make it easy to find.
      </p>

      <h2>Sadya and food timing</h2>
      <p>
        Sadya is the part people plan their day around. Add a simple line such
        as “Sadya from 12:00 PM” and, if you are serving in batches, mention
        that guests may wait a little. It also helps your caterer: fewer
        guests arriving randomly at 2 PM means fewer headaches with the final
        count. If you are expecting a headcount confirmation from key
        families, ask them in your message and not on the invite itself.
      </p>
      <ul>
        <li>Say if it is vegetarian only, since some guests plan around it.</li>
        <li>Mention separate arrangements if reception dinner differs.</li>
        <li>Skip the full menu. A line is enough.</li>
      </ul>

      <h2>Venue gates and parking</h2>
      <p>
        Many Kerala auditoriums have a front gate on the main road and a
        quieter one for cars. Add the gate guests should use and the parking
        arrangement. Pair it with a pinned location, as explained in{" "}
        <Link href="/blog/how-to-add-google-maps-to-wedding-invitation">
          how to add Google Maps to a wedding invitation
        </Link>
        .
      </p>

      <h2>Family names and wording</h2>
      <p>
        Include both sets of parents, with house names if that is your
        family&apos;s custom. If you are writing the invite partly in
        Malayalam, keep the wording the same across both languages so no side
        feels left out. Our{" "}
        <Link href="/blog/malayalam-wedding-invitation-wording">
          Malayalam wording guide
        </Link>{" "}
        has sample lines.
      </p>

      <h2>A simple layout that works</h2>
      <ol>
        <li>Names and a warm one-line greeting</li>
        <li>Date and muhurtham window</li>
        <li>Venue with map button</li>
        <li>Sadya time</li>
        <li>Reception details, if separate</li>
        <li>Contact numbers for one or two family members</li>
      </ol>

      <h2>What to leave out</h2>
      <ul>
        <li>Long poems and quotes that push the venue off the first screen.</li>
        <li>Every pre-wedding function. List only those guests are invited to.</li>
        <li>Personal numbers of five different people.</li>
      </ul>

      <p>
        See how these details sit on a real page in our{" "}
        <Link href="/wedding-invitations/kerala">Kerala wedding invitations</Link>{" "}
        or open{" "}
        <Link href="/anjana-jishnu">Anjana and Jishnu&apos;s invite</Link>. If
        you want us to set up yours, <Link href="/contact">message us</Link>.
      </p>
    </BlogArticle>
  );
}
