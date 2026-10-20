"use client";

import { motion } from "framer-motion";

const DefinitionBlock = () => (
  <section
    id="what-is-digital-wedding-invitation"
    className="pb-16 md:pb-20"
    aria-labelledby="definition-heading"
  >
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/80 px-6 py-8 md:px-10 md:py-10 text-center"
      >
        <h2
          id="definition-heading"
          className="font-display text-2xl md:text-3xl font-semibold text-foreground"
        >
          What is a digital wedding invitation?
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed text-[15px] md:text-base">
          A digital wedding invitation is an online invitation you share as a
          single link — usually on WhatsApp — with your wedding dates, venue
          map, timings and story. Guests open it on their phone in a browser,
          with no app download and no login.
        </p>
        <p className="mt-4 text-sm text-foreground/80 leading-relaxed">
          <strong className="font-semibold text-foreground">Invyto</strong> is
          an India-based platform for creating digital wedding invitations that
          you share as a single link on WhatsApp.
        </p>
      </motion.div>
    </div>
  </section>
);

export default DefinitionBlock;
