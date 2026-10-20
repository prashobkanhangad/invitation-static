"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    href: "/wedding-invitations/malayalam",
    title: "Malayalam wedding invitation online",
    desc: "Kerala-style e-invites with muhurtham timings, venue map and WhatsApp sharing.",
  },
  {
    href: "/wedding-invitations/kerala",
    title: "Kerala wedding invitation",
    desc: "Digital invitations crafted for North Kerala and wider Kerala celebrations.",
  },
  {
    href: "/wedding-invitations/hindu",
    title: "Hindu wedding e-invite",
    desc: "Schedule, muhurtham and family details in one mobile-friendly link.",
  },
  {
    href: "/compare/digital-vs-printed-wedding-invitations",
    title: "Digital vs printed",
    desc: "Cost, edits, reach and etiquette — when a WhatsApp invite is enough.",
  },
  {
    href: "/blog",
    title: "Wedding invitation guides",
    desc: "WhatsApp message formats, Malayalam & Hindu wording, and phone how-tos.",
  },
];

const CategoryTeaser = () => (
  <section id="categories" className="py-24 md:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Wedding invitations by language &amp; tradition
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Start with the long-tail pages India searches for — Malayalam, Kerala
          and Hindu wedding e-invites — then share on WhatsApp.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {categories.map((c, i) => (
          <motion.div
            key={c.href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={c.href}
              className="block h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
            >
              <h3 className="font-display text-xl font-semibold text-foreground">
                {c.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {c.desc}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryTeaser;
