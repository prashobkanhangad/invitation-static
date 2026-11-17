import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("how-to-add-google-maps-to-wedding-invitation")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        The number one phone call a bride&apos;s father gets on the wedding
        morning is not about the muhurtham. It is “Where exactly is the
        entrance?” A good Google Maps pin on your invitation prevents most of
        those calls. A bad one sends a bus of relatives to the back lane of the
        hall. Here is how to do it properly.
      </p>

      <h2>Hall name versus the exact gate</h2>
      <p>
        Searching for the hall name works only when the hall has a clean
        Google listing. Many auditoriums in Kerala have two or three listings,
        an old one, a new one and one named after the road. Before you copy
        anything, check which pin sits on the real front entrance.
      </p>
      <ol>
        <li>Open Google Maps and search for the hall.</li>
        <li>Zoom into satellite view and find the main gate and parking.</li>
        <li>Long-press on the gate itself to drop a pin there.</li>
        <li>Tap Share and copy the link.</li>
        <li>Open the copied link on another phone to confirm it lands correctly.</li>
      </ol>
      <p>
        Better still, visit the venue and drop the pin while standing at the
        gate. It takes ten minutes and saves hours.
      </p>

      <h2>Use the short link, and test it on mobile data</h2>
      <p>
        Long map URLs can break when pasted into WhatsApp and some guests use
        phones without the latest Maps app. Use the short “share” link and
        always tap it from a fresh chat on mobile data. If it opens the map
        app directly, you are good.
      </p>

      <h2>When there are two venues</h2>
      <p>
        Muhurtham at a temple or church, then sadya at a hall ten minutes away?
        Put two separate map buttons, with clear labels, and not one link
        that tries to do both. For example:
      </p>
      <ul>
        <li>Muhurtham: Sree temple, east nada entrance</li>
        <li>Sadya and reception: Auditorium, main gate on the highway side</li>
      </ul>
      <p>
        Our{" "}
        <Link href="/blog/kerala-wedding-invitation-muhurtham-reception-details">
          Kerala invite details guide
        </Link>{" "}
        shows how to lay out times beside each location.
      </p>

      <h2>Parking and the last 200 metres</h2>
      <p>
        Maps gets people to the road. It does not tell them that the car
        park is behind the building or that a procession is blocking the main
        lane. Add one line next to the map:
      </p>
      <ul>
        <li>“Car parking inside the ground behind the hall. Enter from the left lane.”</li>
        <li>“Two-wheelers near the side gate. Buses please drop at the main gate.”</li>
        <li>“Landmark: opposite the old petrol pump.”</li>
      </ul>
      <p>
        If you expect many cars, ask a friend or cousin to stand at the
        turning with a phone. Guests will always trust a person over an app.
      </p>

      <h2>Help for guests coming from far</h2>
      <p>
        For relatives coming by train or flight, add the nearest railway
        station or airport and an honest travel time. “Around 40 minutes from
        Kozhikode station by taxi” is more useful than a general address. If
        you have booked rooms or a block at a nearby lodge, put its pin too.
      </p>

      <h2>Mistakes to avoid</h2>
      <ul>
        <li>Pinning the town centre rather than the venue.</li>
        <li>Pinning the old hall name that no longer exists.</li>
        <li>Forgetting the second venue entirely.</li>
        <li>Sending a screenshot of the map instead of a live link.</li>
      </ul>

      <p>
        Invyto pages come with map buttons built in. See how it looks in the{" "}
        <Link href="/#live-examples">live examples</Link>, or check our{" "}
        <Link href="/wedding-invitations/kerala">Kerala designs</Link>.
      </p>
    </BlogArticle>
  );
}
