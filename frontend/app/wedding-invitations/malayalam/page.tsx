import type { Metadata } from "next";
import MarketingShell from "@/components/landing/MarketingShell";
import PageHeader from "@/components/landing/PageHeader";
import { PageAside, PageLink, articleProse } from "@/components/landing/PageCta";

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
      <article className="container mx-auto max-w-3xl px-6">
        <PageHeader
          crumbs={[
            { href: "/wedding-invitations", label: "Wedding invitations" },
            { href: "/wedding-invitations/malayalam", label: "Malayalam" },
          ]}
          title="Malayalam wedding invitation online"
          lead="A Malayalam wedding e-invite from Invyto is a mobile page you share on WhatsApp — with muhurtham timings, venue map, family details and your story in one link. Guests open it in their browser; no app required."
        />
        <div className={articleProse}>
          <h2>Built for Kerala WhatsApp sharing</h2>
          <p>
            Relatives across towns often only need the date, hall name and a map.
            One polished link replaces forwarding the same text fifty times. We
            set English layouts with Malayalam wedding details where your families
            need them — tell us the mix when you book.
          </p>
          <h2>What&apos;s on the page</h2>
          <ul>
            <li>Muhurtham, reception and related ceremony timings</li>
            <li>Venue map guests can open from their phone</li>
            <li>Couple story and countdown</li>
            <li>Optional music; loads quickly on slower networks</li>
          </ul>
          <p>
            See <PageLink href="/#live-examples">live examples</PageLink>,{" "}
            <PageLink href="/wedding-invitations/kerala">
              Kerala wedding invitations
            </PageLink>
            , or{" "}
            <PageLink href="/contact">message us on WhatsApp</PageLink>.
          </p>
        </div>
        <PageAside />
      </article>
    </MarketingShell>
  );
}
