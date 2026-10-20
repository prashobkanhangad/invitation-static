"use client";

import MarketingShell from "@/components/landing/MarketingShell";
import { openWhatsApp } from "@/utils/whatsapp";

export default function ContactPage() {
  return (
    <MarketingShell>
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Contact
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          The fastest way to start a digital wedding invitation is WhatsApp. Tell
          us your wedding date, languages and city — we reply with next steps
          and an INR quote.
        </p>
        <button
          type="button"
          onClick={() =>
            openWhatsApp(
              "Hi! I'd like to create a digital wedding invitation. Wedding date / city:",
            )
          }
          className="mt-10 inline-flex rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Message us on WhatsApp
        </button>
        <p className="mt-6 text-sm text-muted-foreground">
          Or email{" "}
          <a
            href="mailto:hello@invyto.in"
            className="text-primary underline-offset-4 hover:underline"
          >
            hello@invyto.in
          </a>
        </p>
      </div>
    </MarketingShell>
  );
}
