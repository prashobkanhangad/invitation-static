"use client";

import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";
import { openWhatsApp } from "@/utils/whatsapp";

export default function PricingPage() {
  return (
    <MarketingShell>
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Pricing
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Digital wedding invitation packages are quoted in Indian rupees (INR)
          based on design, languages and timeline. Message us on WhatsApp for a
          clear package for your wedding.
        </p>

        <section className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Couples — wedding e-invites
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Pricing depends on template complexity, Malayalam/English mix, number
            of events and how quickly you need the link live. We share a fixed
            quote before work starts — no surprise fees after you approve the
            design.
          </p>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-muted-foreground">
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
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Get a couple quote on WhatsApp
          </button>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Photographers &amp; studios
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Studio storage and delivery plans start from{" "}
            <strong className="text-foreground">₹2,999 / month</strong>. Plans
            cover tools studios use for client delivery — separate from
            couple-facing wedding invitation packages.
          </p>
        </section>

        <p className="mt-10 text-sm text-muted-foreground">
          See{" "}
          <Link href="/about" className="text-primary underline-offset-4 hover:underline">
            about Invyto
          </Link>{" "}
          or{" "}
          <Link href="/compare/digital-vs-printed-wedding-invitations" className="text-primary underline-offset-4 hover:underline">
            digital vs printed
          </Link>
          .
        </p>
      </div>
    </MarketingShell>
  );
}
