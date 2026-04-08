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
        <h2 className="font-display text-4xl md:text-6xl font-semibold text-foreground max-w-3xl mx-auto leading-tight">
          Make every moment <span className="text-gradient-gold">unforgettable</span>
        </h2>
        <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto">
          Join thousands of couples and event planners who trust Invyto to make their celebrations shine.
        </p>
        <button
          type="button"
          onClick={() => openWhatsApp("Hi! I'd like to create a invitation now.")}
          className="mt-10 inline-block px-10 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:brightness-110 transition shadow-xl shadow-primary/20 relative overflow-hidden group cursor-pointer"
        >
          <span className="relative z-10">Create Your First Invitation</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
        </button>
      </motion.div>
    </div>
  </section>
);

export default CtaBanner;
