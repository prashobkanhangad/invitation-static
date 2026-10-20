"use client";

import { motion } from "framer-motion";
import { openWhatsApp } from "@/utils/whatsapp";

const CtaBanner = () => (
  <section id="cta" className="py-24 md:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-gradient-to-br from-primary/20 via-muted to-secondary/10 border border-primary/20 py-20 px-8 text-center"
      >
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground max-w-3xl mx-auto leading-tight">
          Ready for a wedding invite that looks right on{" "}
          <span className="text-gradient-gold">WhatsApp</span>?
        </h2>
        <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto">
          Couples across Kerala already share one Invyto link for dates, venue
          map and story — instead of repeating details in fifty chats.
        </p>
        <button
          type="button"
          onClick={() =>
            openWhatsApp(
              "Hi! I'd like to create a digital wedding invitation now.",
            )
          }
          className="mt-10 inline-block px-10 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:brightness-110 transition shadow-xl shadow-primary/20 cursor-pointer"
        >
          Create your invitation
        </button>
      </motion.div>
    </div>
  </section>
);

export default CtaBanner;
