"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LIVE_EXAMPLES } from "@/lib/liveExamples";

export { LIVE_EXAMPLES };

const Showcase = () => (
  <section id="live-examples" className="border-t border-border bg-muted/40 py-24 md:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-display text-4xl font-medium text-foreground md:text-5xl">
          Live wedding invitation examples
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Open a real Invyto invitation — the same experience guests get on
          WhatsApp.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {LIVE_EXAMPLES.map((example, i) => (
          <motion.div
            key={example.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.05, 0.3) }}
          >
            <Link
              href={example.href}
              className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={example.image}
                  alt={`${example.name} digital wedding invitation`}
                  width={800}
                  height={1067}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-4 py-4">
                <p className="font-display text-lg text-foreground">
                  {example.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {example.place}
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  Open invite →
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Showcase;
