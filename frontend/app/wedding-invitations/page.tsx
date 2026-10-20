import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";

export const metadata: Metadata = {
  title: "Wedding Invitations",
  description:
    "Browse Invyto digital wedding invitations for Malayalam, Kerala and Hindu weddings — share one WhatsApp link with dates, map and story.",
  alternates: { canonical: "https://www.invyto.in/wedding-invitations" },
};

const links = [
  {
    href: "/wedding-invitations/malayalam",
    title: "Malayalam wedding invitation online",
    desc: "E-invites with Malayalam wedding details, muhurtham timings and WhatsApp sharing.",
  },
  {
    href: "/wedding-invitations/kerala",
    title: "Kerala wedding invitation",
    desc: "Digital invitations for North Kerala and wider Kerala celebrations.",
  },
  {
    href: "/wedding-invitations/hindu",
    title: "Hindu wedding e-invite",
    desc: "Schedule, muhurtham and family details in one mobile-friendly link.",
  },
];

export default function WeddingInvitationsHub() {
  return (
    <MarketingShell>
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Digital wedding invitations
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Invyto is an India-based platform for creating digital wedding
          invitations that you share as a single link on WhatsApp. Start with a
          language or tradition page below.
        </p>
        <ul className="mt-10 space-y-4">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
              >
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {l.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{l.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MarketingShell>
  );
}
