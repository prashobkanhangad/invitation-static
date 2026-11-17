import type { Metadata } from "next";
import MarketingShell from "@/components/landing/MarketingShell";
import PageHeader from "@/components/landing/PageHeader";
import { PageAside, PageLink, articleProse } from "@/components/landing/PageCta";

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
      <article className="container mx-auto max-w-3xl px-6">
        <PageHeader
          crumbs={[
            { href: "/wedding-invitations", label: "Wedding invitations" },
            { href: "/wedding-invitations/kerala", label: "Kerala" },
          ]}
          title="Kerala wedding invitation"
          lead="Kerala weddings often span multiple events and towns. An Invyto digital invitation puts the full schedule and venue map in one WhatsApp link so out-of-town guests are never guessing the hall or the time."
        />
        <div className={articleProse}>
          <h2>Designed around real Kerala guest lists</h2>
          <p>
            Couples we&apos;ve worked with in places like Kanhangad and
            Thaliparamba wanted something that looked proper when shared — not a
            casual image forward — while still reaching relatives who only use
            WhatsApp. The invite replaces bulky printed runs for most guests
            without feeling less intentional to families.
          </p>
          <h2>Live Kerala examples</h2>
          <ul>
            <li>
              <PageLink href="/anupriya-adarsh">
                Anupriya &amp; Adarsh · Kanhangad
              </PageLink>
            </li>
            <li>
              <PageLink href="/sanath-sreya">
                Sanath &amp; Shreya · Thaliparamba
              </PageLink>
            </li>
            <li>
              <PageLink href="/anjana-jishnu">
                Anjana &amp; Jishnu · Nileshwar
              </PageLink>
            </li>
          </ul>
          <p>
            Also see{" "}
            <PageLink href="/wedding-invitations/malayalam">
              Malayalam wedding invitations
            </PageLink>{" "}
            and{" "}
            <PageLink href="/compare/digital-vs-printed-wedding-invitations">
              digital vs printed
            </PageLink>
            .
          </p>
        </div>
        <PageAside />
      </article>
    </MarketingShell>
  );
}
