"use client";

import Link from "next/link";

/** Consented demo / showcase invitations — wedding invites only. */
const LIVE_EXAMPLES = [
  {
    href: "/anjana-jishnu",
    name: "Anjana & Jishnu",
    place: "Nileshwar · Kerala",
  },
  {
    href: "/puneeth-suma",
    name: "Puneeth & Suma",
    place: "Kaiwara · Karnataka",
  },
  {
    href: "/anupriya-adarsh",
    name: "Anupriya & Adarsh",
    place: "Kanhangad · Kerala",
  },
  {
    href: "/sanath-sreya",
    name: "Sanath & Shreya",
    place: "Thaliparamba · Kerala",
  },
  {
    href: "/arun-shilpa",
    name: "Shilpa & Arun",
    place: "Kerala wedding",
  },
  {
    href: "/manjima-srujith",
    name: "Manjima & Srujith",
    place: "Malayalam wedding",
  },
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
  place,
  colors,
  accent,
}: {
  href: string;
  name: string;
  place: string;
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
      <p className="text-xs text-muted-foreground mt-2">{place}</p>
      <p className="text-xs text-primary mt-4 font-medium">
        Open live invitation →
      </p>
      <div className="w-10 h-px bg-primary/50 mt-4 shrink-0" />
    </Link>
  );
}

const Showcase = () => {
  const cards = LIVE_EXAMPLES.map((t, i) => ({
    ...t,
    ...colorSchemes[i % colorSchemes.length],
  }));

  return (
    <section id="live-examples" className="py-24 md:py-32 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-6 mb-12 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Live wedding invitation examples
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Open a real Invyto invitation to see how it looks when shared on
          WhatsApp — dates, map, timings and story in one link.
        </p>
      </div>

      <div className="relative">
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
