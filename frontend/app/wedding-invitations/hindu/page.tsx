import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";

export const metadata: Metadata = {
  title: "Hindu Wedding E-Invite",
  description:
    "Hindu wedding e-invite with muhurtham timings, venue map and ceremony schedule — share one WhatsApp link with your guests.",
  alternates: {
    canonical: "https://www.invyto.in/wedding-invitations/hindu",
  },
};

export default function HinduWeddingInvitePage() {
  return (
    <MarketingShell>
      <article className="container mx-auto px-6 max-w-3xl">
        <p className="text-sm text-primary font-medium">
          <Link href="/wedding-invitations" className="hover:underline">
            Wedding invitations
          </Link>{" "}
          / Hindu
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-foreground text-balance">
          Hindu wedding e-invite
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          A Hindu wedding e-invite from Invyto is a digital invitation built
          around ceremony timings — muhurtham, related rituals and reception —
          plus a venue map and your story, shared as one WhatsApp link.
        </p>
        <h2 className="mt-12 font-display text-2xl font-semibold text-foreground">
          Clear schedule, fewer clarifying chats
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Guests often ask which day is which, when to arrive, and where the
          hall is. Putting the schedule and map on a mobile page cuts those
          messages. Elders who prefer paper can still receive a card or a
          personal call while the rest of the guest list uses the link.
        </p>
        <h2 className="mt-10 font-display text-2xl font-semibold text-foreground">
          Languages we support today
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          We currently focus on English and Malayalam wedding detail layouts
          for Hindu ceremonies in Kerala. If you need another language mix,
          ask us when you message on WhatsApp — we only claim languages we can
          deliver well.
        </p>
        <p className="mt-10 text-sm text-muted-foreground">
          Explore{" "}
          <Link
            href="/wedding-invitations/malayalam"
            className="text-primary underline-offset-4 hover:underline"
          >
            Malayalam
          </Link>{" "}
          and{" "}
          <Link
            href="/wedding-invitations/kerala"
            className="text-primary underline-offset-4 hover:underline"
          >
            Kerala
          </Link>{" "}
          invitation pages, or{" "}
          <Link
            href="/pricing"
            className="text-primary underline-offset-4 hover:underline"
          >
            get pricing
          </Link>
          .
        </p>
      </article>
    </MarketingShell>
  );
}
