import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/landing/BlogArticle";
import { getBlogPost } from "@/lib/blogPosts";
import { blogMetadata } from "@/lib/blogMeta";

const post = getBlogPost("malayalam-wedding-invitation-wording")!;
export const metadata: Metadata = blogMetadata(post);

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p>
        Most Kerala families end up with a mix: English for the part everyone
        will read on a phone, and Malayalam for the blessings, the parents&apos;
        names and the muhurtham, where it feels right to have it in the
        mother tongue. There is no single correct format. What matters is that
        elders recognise their own family in the wording, and a cousin in
        Dubai can still understand the date and time at a glance.
      </p>
      <p>
        Below are lines you can use or adapt, plus notes on what to include,
        what to skip and what usually goes wrong.
      </p>

      <h2>English lines that work well on WhatsApp</h2>
      <p>
        &quot;With the blessings of our families, we invite you and your family to
        the wedding of [Bride], daughter of [Father] &amp; [Mother], and [Groom],
        son of [Father] &amp; [Mother].&quot;
      </p>
      <p>
        &quot;Muhurtham: [time] to [time] on [Day, Date] at [Hall], [Town]. Please
        open the link for the map and the full schedule.&quot;
      </p>
      <p>
        &quot;Reception: [Day, Date] from [time] onwards at [Venue].&quot;
      </p>
      <p>
        Keep each sentence to one idea. On a small screen, long sentences with
        three commas turn into a wall of text that nobody finishes.
      </p>

      <h2>Malayalam lines you can adapt</h2>
      <p>
        സ്നേഹത്തോടെ ക്ഷണിക്കുന്നു. ഞങ്ങളുടെ മകൾ/മകൻ [പേര്]ന്റെ വിവാഹം [തീയതി],
        [ദിവസം] [സമയം] മുതൽ [സമയം] വരെയുള്ള ശുഭമുഹൂർത്തത്തിൽ [സ്ഥലം] വെച്ച്
        നടത്തുവാൻ നിശ്ചയിച്ചിരിക്കുന്നു.
      </p>
      <p>
        ഈ ശുഭകർമ്മത്തിൽ കുടുംബസമേതം പങ്കെടുത്ത് നവദമ്പതികളെ അനുഗ്രഹിക്കണമെന്ന്
        വിനീതമായി അഭ്യർത്ഥിക്കുന്നു.
      </p>
      <p>
        Have an elder in the family read the Malayalam once before it goes to
        the maker. Small spelling or spacing errors in Malayalam script are
        easy to miss if you are not a regular reader, and they show up
        immediately to the person who is.
      </p>

      <h2>What to put on a Kerala digital invitation</h2>
      <ul>
        <li>
          Names of the bride and groom the way elders know them, including
          house name or initials if that is the practice in your family
        </li>
        <li>Parents&apos; names, and grandparents if the family wants them shown</li>
        <li>
          Muhurtham as a clear window with AM or PM, not just &quot;around 10&quot;
        </li>
        <li>Reception date and time, if it is a separate event</li>
        <li>Venue name and a map button that opens the correct location</li>
        <li>
          A line for guests who are coming from outside: stay, parking, a phone
          number to call
        </li>
        <li>A short note from the couple, if you want one</li>
      </ul>
      <p>
        For how the muhurtham and reception details are usually arranged, see{" "}
        <Link href="/blog/kerala-wedding-invitation-muhurtham-reception-details">
          muhurtham and reception details in Kerala invitations
        </Link>
        .
      </p>

      <h2>Tone for North Kerala families</h2>
      <p>
        In Malabar, the expectation is usually a respectful and personal tone.
        &quot;You and your family&quot; works better than &quot;you guys&quot; even if the
        couple is young. Mention the families first and the couple after. Avoid
        jokes, hashtags and slang in the main wording. If you want a lighter
        voice, keep it for the couple&apos;s note at the bottom of the page.
      </p>
      <p>
        Some families in Kozhikode, Kannur and Malappuram also prefer a plain
        and simple invite with no religious symbols in the header. Decide this
        as a family before the design starts, not after. Our note on{" "}
        <Link href="/blog/north-kerala-wedding-invitation-etiquette">
          North Kerala wedding invitation etiquette
        </Link>{" "}
        covers a few more habits worth knowing.
      </p>

      <h2>Sample closing lines</h2>
      <p>
        &quot;Your presence and blessings will make this day complete. With love,
        [Bride] &amp; [Groom], and families.&quot;
      </p>
      <p>
        &quot;We look forward to welcoming you. Kindly confirm your presence by
        calling [Name] on [Number].&quot;
      </p>

      <h2>Common mistakes in wording</h2>
      <ul>
        <li>
          <strong>Translating word by word.</strong> English wording translated
          directly into Malayalam sounds stiff. Write it as a person from your
          family would say it.
        </li>
        <li>
          <strong>Putting too many names.</strong> A list of twelve relatives
          pushes the date down the page. Use a short family line and keep the
          rest for verbal invitations.
        </li>
        <li>
          <strong>Mixing the date formats.</strong> Pick one: &quot;14 December
          2026&quot;. Do not write one in Malayalam calendar and the other in
          English without saying so.
        </li>
        <li>
          <strong>Leaving the muhurtham vague.</strong> Guests plan travel
          around it. Give the actual window.
        </li>
        <li>
          <strong>Sending the full text in WhatsApp.</strong> Keep the chat
          message short. Use{" "}
          <Link href="/blog/whatsapp-wedding-invitation-message-format">
            these WhatsApp message formats
          </Link>{" "}
          and put the details on the page.
        </li>
      </ul>

      <h2>Where to see this in practice</h2>
      <p>
        The{" "}
        <Link href="/wedding-invitations/malayalam">
          Malayalam wedding invitation
        </Link>{" "}
        page shows how the text and layout come together, and the{" "}
        <Link href="/wedding-invitations/kerala">Kerala wedding invitation</Link>{" "}
        page covers the wider style. Live examples include{" "}
        <Link href="/anjana-jishnu">Anjana &amp; Jishnu</Link> and{" "}
        <Link href="/anupriya-adarsh">Anupriya &amp; Adarsh</Link>. If you are
        sending to elders, read{" "}
        <Link href="/blog/is-digital-wedding-invitation-ok-for-elders">
          this note on elders
        </Link>{" "}
        too, and compare formats in{" "}
        <Link href="/compare/digital-vs-printed-wedding-invitations">
          digital vs printed wedding invitations
        </Link>
        .
      </p>

      <p>
        Browse more at <Link href="/#live-examples">live examples</Link> or{" "}
        <Link href="/contact">send your wording to Invyto</Link> and we will
        fit it to the page.
      </p>
    </BlogArticle>
  );
}
