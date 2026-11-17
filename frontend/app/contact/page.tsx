"use client";

import MarketingShell from "@/components/landing/MarketingShell";
import PageHeader from "@/components/landing/PageHeader";
import { openWhatsApp } from "@/utils/whatsapp";

export default function ContactPage() {
  return (
    <MarketingShell>
      <div className="container mx-auto max-w-2xl px-6">
        <PageHeader
          center
          title="Contact"
          lead="The fastest way to start a digital wedding invitation is WhatsApp. Tell us your wedding date, languages and city — we reply with next steps and an INR quote."
        />
        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() =>
              openWhatsApp(
                "Hi! I'd like to create a digital wedding invitation. Wedding date / city:",
              )
            }
            className="inline-flex rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Message us on WhatsApp
          </button>
          <p className="text-sm font-light text-muted-foreground">
            Or email{" "}
            <a
              href="mailto:hello@invyto.in"
              className="text-primary underline-offset-4 hover:underline"
            >
              hello@invyto.in
            </a>
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
