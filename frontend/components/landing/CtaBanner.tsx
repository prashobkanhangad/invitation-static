"use client";

import { motion } from "framer-motion";
import { openWhatsApp } from "@/utils/whatsapp";

const CtaBanner = () => (
  <section id="cta" className="border-t border-border py-24 md:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="font-display text-4xl font-medium leading-tight text-foreground md:text-5xl">
          Liked an example? Let&apos;s make yours
        </h2>
        <p className="mt-6 text-lg text-muted-foreground">
          Message us on WhatsApp with your dates, venue and a few photos. We
          craft a digital wedding invitation you can share as one link.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              openWhatsApp(
                "Hi! I'd like to create a digital wedding invitation now.",
              )
            }
            className="inline-flex rounded-full bg-primary px-10 py-4 text-base font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Create on WhatsApp
          </button>
          <a
            href="#live-examples"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            See live examples again
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CtaBanner;
