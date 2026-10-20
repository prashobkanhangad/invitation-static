import type { Metadata } from "next";
import MarketingShell from "@/components/landing/MarketingShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Invyto — how we handle information when you create or open a digital wedding invitation.",
  alternates: { canonical: "https://www.invyto.in/privacy" },
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <article className="container mx-auto px-6 max-w-3xl prose-invert">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {new Date().getFullYear()}
        </p>
        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Invyto (&quot;we&quot;, &quot;us&quot;) operates invyto.in. This
            policy explains how we handle information when you create a digital
            wedding invitation, visit our site, or open an invitation link.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Information we collect
          </h2>
          <p>
            When you contact us or book an invitation, we collect details you
            share — such as names, wedding dates, venue text, photos you upload,
            and WhatsApp or email contact information — so we can design and host
            your invitation.
          </p>
          <p>
            We use standard analytics (for example Google Analytics) to
            understand site traffic. Invitation pages may collect basic visit
            metrics so we can improve load performance.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            How we use information
          </h2>
          <p>
            We use your information to deliver the invitation, respond to
            support requests, process payments where applicable, and improve the
            product. We do not sell personal information.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Sharing
          </h2>
          <p>
            Invitation content you approve is visible to anyone with the link.
            Hosting and infrastructure providers process data only to run the
            service. We may disclose information if required by law.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Contact
          </h2>
          <p>
            Privacy questions:{" "}
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
