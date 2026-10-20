import type { Metadata } from "next";
import MarketingShell from "@/components/landing/MarketingShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for using Invyto digital wedding invitations and related services in India.",
  alternates: { canonical: "https://www.invyto.in/terms" },
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <article className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {new Date().getFullYear()}
        </p>
        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            By using invyto.in or commissioning a digital wedding invitation
            from Invyto, you agree to these terms.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Service
          </h2>
          <p>
            Invyto provides digital wedding invitations shared as a web link,
            typically on WhatsApp. Scope, languages, revisions and hosting
            duration are defined in your package quote.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Your content
          </h2>
          <p>
            You confirm you have the right to use names, photos and text you
            provide. You remain responsible for the accuracy of wedding details
            shown on your invitation.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Payment
          </h2>
          <p>
            Fees are quoted in INR. Work begins after the agreed payment terms
            in your quote. Refunds, if any, follow what we confirm in writing
            before starting.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Availability
          </h2>
          <p>
            We aim for reliable hosting but do not guarantee uninterrupted
            uptime. Invitation links remain live according to your package;
            long-term hosting must be confirmed when you book.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Contact
          </h2>
          <p>
            Questions:{" "}
            <a
              href="mailto:hello@invyto.in"
              className="text-primary underline-offset-4 hover:underline"
            >
              hello@invyto.in
            </a>
          </p>
        </div>
      </article>
    </MarketingShell>
  );
}
