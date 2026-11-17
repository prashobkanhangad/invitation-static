"use client";

import MarketingShell from "@/components/landing/MarketingShell";
import PageHeader from "@/components/landing/PageHeader";
import { PageLink } from "@/components/landing/PageCta";
import { openWhatsApp } from "@/utils/whatsapp";

export default function PricingPage() {
  return (
    <MarketingShell>
      <div className="container mx-auto max-w-3xl px-6">
        <PageHeader
          title="Pricing"
          lead="Digital wedding invitation packages are quoted in Indian rupees (INR) based on design, languages and timeline. Message us on WhatsApp for a clear package for your wedding."
        />

        <section className="mt-12 border-t border-border/80 pt-10">
          <h2 className="font-display text-[1.65rem] font-light tracking-[-0.02em] text-foreground">
            Couples — wedding e-invites
          </h2>
          <p className="mt-3 text-[15px] font-light leading-[1.75] text-muted-foreground">
            Pricing depends on template complexity, Malayalam/English mix, number
            of events and how quickly you need the link live. We share a fixed
            quote before work starts — no surprise fees after you approve the
            design.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm font-light text-muted-foreground">
            <li>One shareable WhatsApp link with dates, map, timings and story</li>
            <li>Edits to core details after sharing, within package limits</li>
            <li>Hosting through your wedding season (confirm duration when booking)</li>
          </ul>
          <button
            type="button"
            onClick={() =>
              openWhatsApp(
                "Hi! Please share digital wedding invitation pricing in INR for my wedding.",
              )
            }
            className="mt-7 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Get a couple quote on WhatsApp
          </button>
        </section>

        <section className="mt-10 border-t border-border/80 pt-10">
          <h2 className="font-display text-[1.65rem] font-light tracking-[-0.02em] text-foreground">
            Photographers &amp; studios
          </h2>
          <p className="mt-3 text-[15px] font-light leading-[1.75] text-muted-foreground">
            Studio storage and delivery plans start from{" "}
            <strong className="font-medium text-foreground">₹2,999 / month</strong>.
            Plans cover tools studios use for client delivery — separate from
            couple-facing wedding invitation packages.
          </p>
        </section>

        <p className="mt-12 text-sm font-light text-muted-foreground">
          See <PageLink href="/about">about Invyto</PageLink> or{" "}
          <PageLink href="/compare/digital-vs-printed-wedding-invitations">
            digital vs printed
          </PageLink>
          .
        </p>
      </div>
    </MarketingShell>
  );
}
