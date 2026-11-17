"use client";

import { motion } from "framer-motion";
import { HOME_FAQS } from "@/lib/homeFaqs";

const FaqSection = () => (
  <section id="faq" className="border-t border-border bg-muted/30 py-24 md:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-display text-4xl font-medium text-foreground md:text-5xl">
          Wedding invitation FAQ
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Answers couples ask before sending a digital invite on WhatsApp.
        </p>
      </motion.div>

      <div className="mx-auto mt-14 max-w-3xl divide-y divide-border">
        {HOME_FAQS.map((item, i) => (
          <motion.details
            key={item.q}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.24) }}
            className="group py-5"
          >
            <summary className="cursor-pointer list-none font-display text-xl text-foreground marker:content-none">
              <span className="flex items-start justify-between gap-4">
                {item.q}
                <span className="mt-1 text-primary transition group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </motion.details>
        ))}
      </div>
    </div>
  </section>
);

export default FaqSection;
