"use client";

import { motion } from "framer-motion";
import { Shield, Clock, Zap } from "lucide-react";
import { openWhatsApp } from "@/utils/whatsapp";

const benefits = [
  { icon: Zap, text: "No manual distribution hassle" },
  { icon: Clock, text: "Saves hours of sorting & sharing" },
  { icon: Shield, text: "Privacy-first facial recognition" },
];

function MockUI() {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 max-w-sm mx-auto">
      <div className="rounded-xl bg-muted/50 border border-border border-dashed p-8 flex flex-col items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/30" />
        </div>
        <p className="text-sm text-muted-foreground">Upload your selfie</p>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-4">
        <motion.div
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
          className="h-full rounded-full bg-primary"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2.5 + i * 0.1 }}
            className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20"
          />
        ))}
      </div>
    </div>
  );
}

const PhotoFinder = () => (
  <section className="py-24 md:py-32">
    <div className="container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <MockUI />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground leading-tight">
            Find yourself in <span className="text-gradient-gold">every frame</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg">
            Our AI-powered photo finder matches your selfie across thousands of event photos in seconds.
          </p>
          <div className="mt-8 space-y-5">
            {benefits.map((b) => (
              <div key={b.text} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium">{b.text}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => openWhatsApp("Hi! I'd like to know more about the AI photo finder for my event.")}
            className="mt-10 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Chat on WhatsApp
          </button>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PhotoFinder;
