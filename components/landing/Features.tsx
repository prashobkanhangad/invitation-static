"use client";

import { motion } from "framer-motion";
import { Mail, Camera, Search, ArrowRight } from "lucide-react";
import { openWhatsApp } from "@/utils/whatsapp";

const features = [
  {
    icon: Mail,
    title: "Digital Invitations",
    desc: "Beautiful, shareable e-invites for weddings & events that leave a lasting impression.",
    whatsapp:
      "Hi! I'd like to know more about digital invitations on Invyto.",
  },
  {
    icon: Camera,
    title: "Event Albums",
    desc: "Curated digital albums your guests can browse, relive, and download with ease.",
    whatsapp: "Hi! I'd like to know more about event albums on Invyto.",
  },
  {
    icon: Search,
    title: "Find Your Photos",
    desc: "Scan QR → upload selfie → instantly receive all your event photos via AI matching.",
    whatsapp: "Hi! Tell me about the AI photo finder for guests on Invyto.",
  },
];

const Features = () => (
  <section id="features" className="py-24 md:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Everything your event needs
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Three powerful tools, one seamless platform.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{f.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            <button
              type="button"
              onClick={() => openWhatsApp(f.whatsapp)}
              className="mt-6 flex items-center gap-2 text-primary text-sm font-medium cursor-pointer text-left hover:underline underline-offset-4"
            >
              Learn more <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <button
          type="button"
          onClick={() => openWhatsApp("Hi! Tell me more about your features.")}
          className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:brightness-110"
        >
          Chat on WhatsApp
        </button>
      </div>
    </div>
  </section>
);

export default Features;
