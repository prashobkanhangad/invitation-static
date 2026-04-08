"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { openWhatsApp } from "@/utils/whatsapp";

const Hero = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-secondary/60 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.12),transparent)]" />
    </div>

    <div className="container relative z-10 mx-auto px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm font-medium uppercase tracking-[0.2em] text-primary"
      >
        Digital invitations &amp; smart albums
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="mt-6 font-display text-4xl font-semibold leading-tight text-foreground md:text-6xl md:leading-tight max-w-4xl mx-auto text-balance"
      >
        Celebrate every milestone with{" "}
        <span className="text-gradient-gold">elegant invites</span> and effortless photo sharing
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground"
      >
        Design stunning invitations, host your gallery, and let guests find their photos with AI — all in one place.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28 }}
        className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <button
          type="button"
          onClick={() => openWhatsApp("Hi! I want to get started with invitations.")}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110"
        >
          Get started free
          <ArrowRight className="h-4 w-4" />
        </button>
        <a
          href="#features"
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Explore features
        </a>
      </motion.div>
    </div>
  </section>
);

export default Hero;
