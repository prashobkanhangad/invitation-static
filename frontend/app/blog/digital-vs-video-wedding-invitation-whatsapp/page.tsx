import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("digital-vs-video-wedding-invitation-whatsapp")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        Video invitations are everywhere now: music, animation, couple photos
        sliding in. They look lovely in the chat. Then your aunt asks, “Where
        is the hall exactly?” and nobody can find the address inside a
        forty-second video. That is the real question to ask: what does the
        guest need to do after watching?
      </p>

      <h2>What a video invite does well</h2>
      <ul>
        <li>It feels festive and gets forwarded quickly.</li>
        <li>It suits friends who just want the vibe and the date.</li>
        <li>It is easy to make with templates.</li>
      </ul>

      <h2>Where video falls short</h2>
      <ul>
        <li>
          <strong>No map button.</strong> Guests have to screenshot, zoom and
          type the hall name into Maps.
        </li>
        <li>
          <strong>Heavy files.</strong> A large video can be slow or fail to
          download on patchy networks, which is common outside cities and for
          relatives on limited data.
        </li>
        <li>
          <strong>Hard to update.</strong> If the reception time changes, you
          must make and resend the whole video, and old copies stay in
          circulation.
        </li>
        <li>
          <strong>Fast text.</strong> Muhurtham timings flash by. Elders
          cannot pause and read comfortably.
        </li>
        <li>
          <strong>Storage.</strong> Some people do not want a big file on their
          phone, and many delete it after watching.
        </li>
      </ul>

      <h2>What a hosted link does better</h2>
      <p>
        A hosted invitation page opens in the browser, loads light, and puts
        the muhurtham, venue and a tappable map in one place. You can update
        the page when something changes, and everyone sees the new version
        through the same link. Elders can scroll at their own pace and zoom
        the text. We compare this approach with paper in{" "}
        <Link href="/compare/digital-vs-printed-wedding-invitations">
          digital vs printed wedding invitations
        </Link>
        .
      </p>

      <h2>Use both, with a clear job for each</h2>
      <p>
        You do not have to pick one. A common and sensible approach is this:
      </p>
      <ol>
        <li>
          Send a short video teaser in your friends&apos; broadcast list for
          the festive feeling.
        </li>
        <li>Put the hosted link right below it, as the place for details.</li>
        <li>
          For family and elders, send only the link, after a phone call.
        </li>
      </ol>
      <p>
        That way the video is the hello and the link is the instructions.
      </p>

      <h2>A message that points to the link</h2>
      <p>
        If you send both, make the message say what each is for:
      </p>
      <ul>
        <li>
          “Here is a little video for you. All timings and the map are in the
          link below, so please use that.”
        </li>
      </ul>
      <p>
        Without that line, people trust whichever came first and miss the
        update.
      </p>

      <h2>Quick rules of thumb</h2>
      <ul>
        <li>Out-of-town guests: always the link with map.</li>
        <li>Elders: link plus a call. Skip the long video.</li>
        <li>College and office friends: video is a fun extra.</li>
        <li>Anything with changes likely: link only.</li>
      </ul>

      <p>
        If you want a clean page that works as the main invitation, look at{" "}
        <Link href="/#live-examples">our live examples</Link> or{" "}
        <Link href="/blog/whatsapp-wedding-invitation-message-format">
          the WhatsApp message format
        </Link>{" "}
        we suggest. Questions? <Link href="/contact">Write to us</Link>.
      </p>
    </BlogArticle>
  );
}
