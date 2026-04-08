"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { openWhatsApp } from "@/utils/whatsapp";

const tabs = {
  guests: {
    label: "For Guests",
    steps: [
      { num: "01", title: "Receive Invite", desc: "Get a beautiful digital invitation link" },
      { num: "02", title: "Scan QR Code", desc: "Attend the event and scan the QR code at the venue" },
      { num: "03", title: "Upload Selfie", desc: "Take a quick selfie for AI photo matching" },
      { num: "04", title: "Get Your Photos", desc: "Instantly receive all photos you appear in" },
    ],
  },
  organizers: {
    label: "For Organizers",
    steps: [
      { num: "01", title: "Create Event", desc: "Set up your event on Invyto in minutes" },
      { num: "02", title: "Upload Photos", desc: "Upload all event photos in bulk" },
      { num: "03", title: "Share QR Code", desc: "Display the event QR code at your venue" },
      { num: "04", title: "Guests Self-Serve", desc: "Guests find their own photos automatically" },
    ],
  },
};

type TabKey = keyof typeof tabs;

const HowItWorks = () => {
  const [active, setActive] = useState<TabKey>("guests");

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">Simple for everyone involved.</p>
        </motion.div>

        <div className="flex justify-center mb-14">
          <div className="relative inline-flex rounded-full bg-muted p-1">
            {(Object.keys(tabs) as TabKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  active === key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active === key && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 z-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tabs[key].label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-4 gap-6"
          >
            {tabs[active].steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/40 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-xl font-semibold text-primary">{step.num}</span>
                </div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={() => openWhatsApp("Hi! Can you help me create my invitation in 3 steps?")}
            className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Try it now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
