"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const hubs = [
  {
    href: "/wedding-invitations/malayalam",
    title: "Malayalam wedding invitation online",
    desc: "E-invites with Malayalam details, muhurtham timings and WhatsApp sharing.",
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

const AudienceHubs = () => (
  <section id="for-couples" className="border-t border-border py-24 md:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-display text-4xl font-medium text-foreground md:text-5xl">
          Built for Indian weddings
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Start with the tradition or language that fits your celebration.
        </p>
      </motion.div>

      <ul className="mx-auto mt-14 grid max-w-4xl list-none gap-4">
        {hubs.map((hub, i) => (
          <motion.li
            key={hub.href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={hub.href}
              className="block border-b border-border py-6 transition hover:border-primary/50"
            >
              <h3 className="font-display text-2xl text-foreground md:text-[1.65rem]">
                {hub.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{hub.desc}</p>
            </Link>
          </motion.li>
        ))}
      </ul>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Or browse all{" "}
        <Link
          href="/wedding-invitations"
          className="text-primary underline-offset-4 hover:underline"
        >
          digital wedding invitations
        </Link>{" "}
        and our{" "}
        <Link href="/blog" className="text-primary underline-offset-4 hover:underline">
          wedding invite guides
        </Link>
        .
      </p>
    </div>
  </section>
);

export default AudienceHubs;
