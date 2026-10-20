"use client";

import { motion } from "framer-motion";
import { openWhatsApp } from "@/utils/whatsapp";

const steps = [
  {
    num: "01",
    title: "Choose a style",
    desc: "Pick a look that fits your wedding — Kerala, Hindu or Christian celebrations we craft often.",
  },
  {
    num: "02",
    title: "Add your details",
    desc: "Share dates, venue, muhurtham timings, family names and photos. We build the page for you.",
  },
  {
    num: "03",
    title: "Share on WhatsApp",
    desc: "Get one link. Paste it into chats and groups. Guests open it on their phone with no login.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 md:py-32 bg-muted/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          How it works for couples
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Three steps from idea to a WhatsApp-ready wedding e-invite.
        </p>
      </motion.div>

      <ol className="grid md:grid-cols-3 gap-8 list-none max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <motion.li
            key={step.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <span className="font-display text-xl font-semibold text-primary">
                {step.num}
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.desc}
            </p>
          </motion.li>
        ))}
      </ol>

      <div className="mt-14 text-center">
        <button
          type="button"
          onClick={() =>
            openWhatsApp(
              "Hi! I want to create a digital wedding invitation in 3 steps.",
            )
          }
          className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Start on WhatsApp
        </button>
      </div>
    </div>
  </section>
);

export default HowItWorks;
