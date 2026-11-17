"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Share your details",
    desc: "Send dates, venue, muhurtham timings, family names and photos on WhatsApp.",
  },
  {
    num: "02",
    title: "We design the invite",
    desc: "We craft a mobile invitation that matches your wedding — Kerala, Hindu or beyond.",
  },
  {
    num: "03",
    title: "Share one link",
    desc: "Paste the Invyto link into chats and groups. Guests open it instantly in the browser.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="border-t border-border bg-secondary/40 py-24 md:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-display text-4xl font-medium text-foreground md:text-5xl">
          How it works
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Three steps from your details to a WhatsApp-ready wedding e-invite.
        </p>
      </motion.div>

      <ol className="mx-auto mt-16 grid max-w-5xl list-none gap-12 md:grid-cols-3 md:gap-8">
        {steps.map((step, i) => (
          <motion.li
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center md:text-left"
          >
            <p className="font-display text-4xl font-light text-primary/80">
              {step.num}
            </p>
            <h3 className="font-display mt-4 text-2xl text-foreground">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {step.desc}
            </p>
          </motion.li>
        ))}
      </ol>

      <p className="mt-14 text-center">
        <a
          href="#live-examples"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Browse live examples first →
        </a>
      </p>
    </div>
  </section>
);

export default HowItWorks;
