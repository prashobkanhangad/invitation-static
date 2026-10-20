import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";

export const metadata: Metadata = {
  title: "Kerala Wedding Invitation",
  description:
    "Digital Kerala wedding invitations for WhatsApp — dates, venue map, timings and story in one link. Popular for North Kerala celebrations.",
  alternates: {
    canonical: "https://www.invyto.in/wedding-invitations/kerala",
  },
};

export default function KeralaWeddingInvitationPage() {
  return (
    <MarketingShell>
      <article className="container mx-auto px-6 max-w-3xl">
        <p className="text-sm text-primary font-medium">
          <Link href="/wedding-invitations" className="hover:underline">
            Wedding invitations
          </Link>{" "}
          / Kerala
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-foreground text-balance">
          Kerala wedding invitation
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Kerala weddings often span multiple events and towns. An Invyto
          digital invitation puts the full schedule and venue map in one
          WhatsApp link so out-of-town guests are never guessing the hall or
          the time.
        </p>
        <h2 className="mt-12 font-display text-2xl font-semibold text-foreground">
          Designed around real Kerala guest lists
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Couples we&apos;ve worked with in places like Kanhangad and
          Thaliparamba wanted something that looked proper when shared — not a
          casual image forward — while still reaching relatives who only use
          WhatsApp. The invite replaces bulky printed runs for most guests
          without feeling less intentional to families.
        </p>
        <h2 className="mt-10 font-display text-2xl font-semibold text-foreground">
          Live Kerala examples
        </h2>
        <ul className="mt-3 list-disc pl-5 space-y-2 text-muted-foreground">
          <li>
            <Link href="/anupriya-adarsh" className="text-primary hover:underline">
              Anupriya &amp; Adarsh · Kanhangad
            </Link>
          </li>
          <li>
            <Link href="/sanath-sreya" className="text-primary hover:underline">
              Sanath &amp; Shreya · Thaliparamba
            </Link>
          </li>
          <li>
            <Link href="/anjana-jishnu" className="text-primary hover:underline">
              Anjana &amp; Jishnu · Nileshwar
            </Link>
          </li>
        </ul>
        <p className="mt-10 text-sm text-muted-foreground">
          Also see{" "}
          <Link
            href="/wedding-invitations/malayalam"
            className="text-primary underline-offset-4 hover:underline"
          >
            Malayalam wedding invitations
          </Link>{" "}
          and{" "}
          <Link
            href="/compare/digital-vs-printed-wedding-invitations"
            className="text-primary underline-offset-4 hover:underline"
          >
            digital vs printed
          </Link>
          .
        </p>
      </article>
    </MarketingShell>
  );
}
