"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Event schedule",
    desc: "Muhurtham, reception and ceremony timings guests can reopen anytime.",
  },
  {
    title: "Venue map",
    desc: "Tap-to-open Google Maps so relatives find the hall without chasing chats.",
  },
  {
    title: "Families & story",
    desc: "Names, addresses and a short story that feels personal — not a flat PDF.",
  },
  {
    title: "Photo gallery",
    desc: "A curated set of portraits that match the mood of your celebration.",
  },
  {
    title: "Countdown",
    desc: "A live countdown built for mobile screens and slower networks.",
  },
  {
    title: "WhatsApp-ready link",
    desc: "One polished link for every group chat. Guests need no app or login.",
  },
];

const Features = () => (
  <section id="features" className="border-t border-border py-24 md:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-display text-4xl font-medium text-foreground md:text-5xl">
          What&apos;s inside your invitation
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything guests need in one mobile page — dates, place, timings and
          your story.
        </p>
      </motion.div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display mt-3 text-2xl font-normal text-foreground">
              {f.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
