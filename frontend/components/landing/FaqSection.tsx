"use client";

import { motion } from "framer-motion";

const faqs = [
  {
    q: "What is a digital wedding invitation?",
    a: "A digital wedding invitation is an online invitation you share as a link, usually on WhatsApp, containing the wedding dates, venue map, timings and your story. Guests open it on their phone with no app needed.",
  },
  {
    q: "How do I send a digital wedding invitation on WhatsApp?",
    a: "After your Invyto invitation is ready, you get a shareable link. Paste that link into a WhatsApp chat or group. Guests tap it and see your dates, venue map, timings and story in their browser — no login required.",
  },
  {
    q: "How much does a digital wedding invitation cost in India?",
    a: "Invyto wedding invitations are priced in INR based on your design needs. Message us on WhatsApp for a package quote. Studio plans for photographers start from ₹2,999 per month for storage and tools.",
  },
  {
    q: "Is it acceptable to send only a digital invitation to elders?",
    a: "Many families use a digital invite for most guests, then add a personal call or a physical card for elders who prefer paper. A polished WhatsApp invite still feels proper when dates, map and timings open easily on a phone.",
  },
  {
    q: "Can I get my invitation in Malayalam?",
    a: "Yes. We create Kerala and Malayalam wedding invitations with English layouts and Malayalam details where needed. Tell us your preferred language mix when you message us on WhatsApp.",
  },
  {
    q: "Can guests open it without an app or login?",
    a: "Yes. Guests open the invitation link in their phone browser. No Invyto app and no login are required to view dates, venue map, timings and your story.",
  },
  {
    q: "Can I edit details after sharing the link?",
    a: "Yes, with limits. Timings, venue text and map can usually be updated so the same link stays correct. Major redesigns may need a short turnaround — ask us before your send date.",
  },
  {
    q: "How long does the invitation stay live?",
    a: "Your invitation stays live through the wedding season and beyond for guests who revisit the map or timings. Confirm long-term hosting duration when you book your package.",
  },
];

const FaqSection = () => (
  <section id="faq" className="py-24 md:py-32 bg-muted/20">
    <div className="container mx-auto px-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Straight answers about WhatsApp wedding e-invites in India.
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((item, i) => (
          <motion.details
            key={item.q}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="group rounded-2xl border border-border bg-card px-5 py-4 open:pb-5"
          >
            <summary className="cursor-pointer list-none font-semibold text-foreground pr-6 relative">
              {item.q}
              <span className="absolute right-0 top-0 text-primary group-open:rotate-45 transition-transform text-xl leading-none">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {item.a}
            </p>
          </motion.details>
        ))}
      </div>
    </div>
  </section>
);

export default FaqSection;
