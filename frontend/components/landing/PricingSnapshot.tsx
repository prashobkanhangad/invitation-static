"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { openWhatsApp } from "@/utils/whatsapp";

const PricingSnapshot = () => (
  <section id="pricing-snapshot" className="py-24 md:py-32 bg-muted/30">
    <div className="container mx-auto px-6 max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Pricing in India (INR)
        </h2>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          Wedding invitation packages are quoted in Indian rupees based on your
          design, languages and timeline. Message us on WhatsApp for a clear
          package for your wedding.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Photographers and studios: storage plans start from{" "}
          <strong className="text-foreground">₹2,999 / month</strong>. See{" "}
          <Link href="/pricing" className="text-primary underline-offset-4 hover:underline">
            full pricing
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={() =>
            openWhatsApp(
              "Hi! Please share digital wedding invitation pricing in INR.",
            )
          }
          className="mt-8 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Get a quote on WhatsApp
        </button>
      </motion.div>
    </div>
  </section>
);

export default PricingSnapshot;
