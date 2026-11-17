import type { Metadata } from "next";
import MarketingShell from "@/components/landing/MarketingShell";
import PageHeader from "@/components/landing/PageHeader";
import { PageAside, PageLink, articleProse } from "@/components/landing/PageCta";

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
      <article className="container mx-auto max-w-3xl px-6">
        <PageHeader
          crumbs={[
            { href: "/wedding-invitations", label: "Wedding invitations" },
            { href: "/wedding-invitations/hindu", label: "Hindu" },
          ]}
          title="Hindu wedding e-invite"
          lead="A Hindu wedding e-invite from Invyto is a digital invitation built around ceremony timings — muhurtham, related rituals and reception — plus a venue map and your story, shared as one WhatsApp link."
        />
        <div className={articleProse}>
          <h2>Clear schedule, fewer clarifying chats</h2>
          <p>
            Guests often ask which day is which, when to arrive, and where the
            hall is. Putting the schedule and map on a mobile page cuts those
            messages. Elders who prefer paper can still receive a card or a
            personal call while the rest of the guest list uses the link.
          </p>
          <h2>Languages we support today</h2>
          <p>
            We currently focus on English and Malayalam wedding detail layouts
            for Hindu ceremonies in Kerala. If you need another language mix,
            ask us when you message on WhatsApp — we only claim languages we can
            deliver well.
          </p>
          <p>
            Explore <PageLink href="/wedding-invitations/malayalam">Malayalam</PageLink>{" "}
            and <PageLink href="/wedding-invitations/kerala">Kerala</PageLink>{" "}
            invitation pages, or{" "}
            <PageLink href="/contact">get in touch</PageLink>.
          </p>
        </div>
        <PageAside />
      </article>
    </MarketingShell>
  );
}
