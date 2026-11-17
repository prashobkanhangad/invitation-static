import type { Metadata } from "next";
import MarketingShell from "@/components/landing/MarketingShell";
import PageHeader from "@/components/landing/PageHeader";
import { articleProse } from "@/components/landing/PageCta";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for using Invyto digital wedding invitations and related services in India.",
  alternates: { canonical: "https://www.invyto.in/terms" },
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <article className="container mx-auto max-w-3xl px-6">
        <PageHeader title="Terms of Service" />
        <p className="mt-4 text-sm font-light text-muted-foreground">
          Last updated: {new Date().getFullYear()}
        </p>
        <div className={articleProse}>
          <p>
            By using invyto.in or commissioning a digital wedding invitation
            from Invyto, you agree to these terms.
          </p>
          <h2>Service</h2>
          <p>
            Invyto provides digital wedding invitations shared as a web link,
            typically on WhatsApp. Scope, languages, revisions and hosting
            duration are defined in your package quote.
          </p>
          <h2>Your content</h2>
          <p>
            You confirm you have the right to use names, photos and text you
            provide. You remain responsible for the accuracy of wedding details
            shown on your invitation.
          </p>
          <h2>Payment</h2>
          <p>
            Fees are quoted in INR. Work begins after the agreed payment terms
            in your quote. Refunds, if any, follow what we confirm in writing
            before starting.
          </p>
          <h2>Availability</h2>
          <p>
            We aim for reliable hosting but do not guarantee uninterrupted
            uptime. Invitation links remain live according to your package;
            long-term hosting must be confirmed when you book.
          </p>
          <h2>Contact</h2>
          <p>
            Questions: <a href="mailto:hello@invyto.in">hello@invyto.in</a>
          </p>
        </div>
      </article>
    </MarketingShell>
  );
}
