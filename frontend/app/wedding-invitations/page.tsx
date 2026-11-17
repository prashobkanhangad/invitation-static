import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";
import PageHeader from "@/components/landing/PageHeader";
import { PageAside } from "@/components/landing/PageCta";

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
      <div className="container mx-auto max-w-3xl px-6">
        <PageHeader
          title="Digital wedding invitations"
          lead="Invyto is an India-based platform for creating digital wedding invitations that you share as a single link on WhatsApp. Start with a language or tradition page below."
        />
        <ul className="mt-12 list-none">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block border-b border-border/80 py-7 transition hover:border-primary/45"
              >
                <h2 className="font-display text-[1.55rem] font-light tracking-[-0.02em] text-foreground md:text-[1.7rem]">
                  {l.title}
                </h2>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                  {l.desc}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <PageAside />
      </div>
    </MarketingShell>
  );
}
