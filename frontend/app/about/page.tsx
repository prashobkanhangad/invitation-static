import type { Metadata } from "next";
import MarketingShell from "@/components/landing/MarketingShell";
import PageHeader from "@/components/landing/PageHeader";
import { PageAside, PageLink, articleProse } from "@/components/landing/PageCta";

export const metadata: Metadata = {
  title: "About Invyto",
  description:
    "Invyto is an India-based platform for creating digital wedding invitations that you share as a single link on WhatsApp.",
  alternates: { canonical: "https://www.invyto.in/about" },
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <article className="container mx-auto max-w-3xl px-6">
        <PageHeader
          title="About Invyto"
          lead="Invyto is an India-based platform for creating digital wedding invitations that you share as a single link on WhatsApp."
        />
        <div className={articleProse}>
          <p>
            We focus on Kerala and Malayalam weddings first: polished mobile
            pages with dates, venue map, timings and your story — so couples stop
            repeating the same details in fifty chats. Invitations are built to
            load quickly on slower networks and to feel proper when families open
            them from WhatsApp.
          </p>
          <p>
            Invyto is not Invyt.io. We are a separate India-focused wedding
            invitation product at{" "}
            <PageLink href="https://www.invyto.in">invyto.in</PageLink>.
          </p>
          <h2>What we ship for couples</h2>
          <ul>
            <li>Event schedule (muhurtham, reception and related ceremonies)</li>
            <li>Venue map guests can open from their phone</li>
            <li>Couple story, countdown and optional music</li>
            <li>English and Malayalam wedding detail layouts</li>
            <li>One WhatsApp-ready link — no guest app or login</li>
          </ul>
        </div>
        <PageAside />
      </article>
    </MarketingShell>
  );
}
