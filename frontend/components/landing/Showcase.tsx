"use client";

import Link from "next/link";

/**
 * Couple / client-specific invitations only (custom URL + proper names from each site).
 * Generic demos (romantic-wedding, elegent-wedding) are omitted.
 * surya_gayathri-subrahmanyan-2 omitted: same Sanath & Shreya content as /sanath-sreya with a mismatched path.
 */
const CUSTOM_INVITATIONS = [
  { href: "/anupriya-adarsh", name: "Anupriya & Adarsh" },
  { href: "/arun-shilpa", name: "Shilpa & Arun" },
  { href: "/jithendra_and_nanditha", name: "Jithendra & Nanditha" },
  { href: "/sanath-sreya", name: "Sanath & Shreya" },
  { href: "/srideep-shobana", name: "Sreejai Sreedeep & Shobana Rambe" },
  { href: "/surya_gayathri-subrahmanyan", name: "Surya Gayathri & Subrahmanyan" },
] as const;

const colorSchemes = [
  { colors: "from-secondary/40 to-primary/20", accent: "border-secondary/30" },
  { colors: "from-primary/30 to-muted", accent: "border-primary/30" },
  { colors: "from-foreground/5 to-muted/50", accent: "border-foreground/10" },
  { colors: "from-secondary/30 to-primary/10", accent: "border-secondary/20" },
  { colors: "from-muted to-card", accent: "border-primary/20" },
  { colors: "from-primary/40 to-muted", accent: "border-primary/40" },
];

function InviteCard({
  href,
  name,
  colors,
  accent,
}: {
  href: string;
  name: string;
  colors: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className={`flex-shrink-0 w-64 h-80 rounded-2xl bg-gradient-to-br ${colors} border ${accent} p-6 flex flex-col items-center justify-center text-center transition hover:brightness-[1.02] hover:shadow-lg hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
    >
      <div className="w-10 h-px bg-primary/50 mb-4 shrink-0" />
      <p className="font-display text-lg sm:text-xl font-semibold text-foreground leading-snug break-words px-1">
        {name}
      </p>
      <p className="text-xs text-muted-foreground mt-4 font-body">Open live invitation →</p>
      <div className="w-10 h-px bg-primary/50 mt-4 shrink-0" />
    </Link>
  );
}

const Showcase = () => {
  const cards = CUSTOM_INVITATIONS.map((t, i) => ({
    href: t.href,
    name: t.name,
    ...colorSchemes[i % colorSchemes.length],
  }));

  return (
    <section className="py-24 md:py-32 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-6 mb-12 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Invitation templates
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Real celebrations — open a live invitation to see the full experience.
        </p>
      </div>

      <div className="relative group">
        <div className="flex gap-6 animate-scroll-left hover:[animation-play-state:paused]">
          {[...cards, ...cards].map((c, i) => (
            <InviteCard key={`${c.href}-${i}`} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
