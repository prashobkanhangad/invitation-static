import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";

export const metadata: Metadata = {
  title: "Malayalam Wedding Invitation Online",
  description:
    "Create a Malayalam wedding invitation online. Share one WhatsApp link with muhurtham timings, venue map and your story. Made for Kerala families.",
  alternates: {
    canonical: "https://www.invyto.in/wedding-invitations/malayalam",
  },
};

export default function MalayalamWeddingInvitationPage() {
  return (
    <MarketingShell>
      <article className="container mx-auto px-6 max-w-3xl">
        <p className="text-sm text-primary font-medium">
          <Link href="/wedding-invitations" className="hover:underline">
            Wedding invitations
          </Link>{" "}
          / Malayalam
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-foreground text-balance">
          Malayalam wedding invitation online
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          A Malayalam wedding e-invite from Invyto is a mobile page you share on
          WhatsApp — with muhurtham timings, venue map, family details and your
          story in one link. Guests open it in their browser; no app required.
        </p>
        <h2 className="mt-12 font-display text-2xl font-semibold text-foreground">
          Built for Kerala WhatsApp sharing
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Relatives across towns often only need the date, hall name and a map.
          One polished link replaces forwarding the same text fifty times. We
          set English layouts with Malayalam wedding details where your families
          need them — tell us the mix when you book.
        </p>
        <h2 className="mt-10 font-display text-2xl font-semibold text-foreground">
          What&apos;s on the page
        </h2>
        <ul className="mt-3 list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Muhurtham, reception and related ceremony timings</li>
          <li>Venue map guests can open from their phone</li>
          <li>Couple story and countdown</li>
          <li>Optional music; loads quickly on slower networks</li>
        </ul>
        <p className="mt-10 text-sm text-muted-foreground">
          See{" "}
          <Link
            href="/#live-examples"
            className="text-primary underline-offset-4 hover:underline"
          >
            live examples
          </Link>
          ,{" "}
          <Link
            href="/wedding-invitations/kerala"
            className="text-primary underline-offset-4 hover:underline"
          >
            Kerala wedding invitations
          </Link>
          , or{" "}
          <Link
            href="/pricing"
            className="text-primary underline-offset-4 hover:underline"
          >
            pricing
          </Link>
          .
        </p>
      </article>
    </MarketingShell>
  );
}
