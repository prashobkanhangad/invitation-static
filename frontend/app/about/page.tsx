import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";

export const metadata: Metadata = {
  title: "About Invyto",
  description:
    "Invyto is an India-based platform for creating digital wedding invitations that you share as a single link on WhatsApp.",
  alternates: { canonical: "https://www.invyto.in/about" },
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <article className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          About Invyto
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Invyto is an India-based platform for creating digital wedding
          invitations that you share as a single link on WhatsApp.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          We focus on Kerala and Malayalam weddings first: polished mobile
          pages with dates, venue map, timings and your story — so couples stop
          repeating the same details in fifty chats. Invitations are built to
          load quickly on slower networks and to feel proper when families open
          them from WhatsApp.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Invyto is not Invyt.io. We are a separate India-focused wedding
          invitation product at{" "}
          <Link href="https://www.invyto.in" className="text-primary underline-offset-4 hover:underline">
            invyto.in
          </Link>
          .
        </p>
        <h2 className="mt-12 font-display text-2xl font-semibold text-foreground">
          What we ship for couples
        </h2>
        <ul className="mt-4 list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Event schedule (muhurtham, reception and related ceremonies)</li>
          <li>Venue map guests can open from their phone</li>
          <li>Couple story, countdown and optional music</li>
          <li>English and Malayalam wedding detail layouts</li>
          <li>One WhatsApp-ready link — no guest app or login</li>
        </ul>
        <p className="mt-8 text-sm text-muted-foreground">
          Questions?{" "}
          <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
            Contact us
          </Link>{" "}
          or see{" "}
          <Link href="/pricing" className="text-primary underline-offset-4 hover:underline">
            pricing
          </Link>
          .
        </p>
      </article>
    </MarketingShell>
  );
}
