"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  BookOpen,
  Music,
  Timer,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Event schedule",
    desc: "Muhurtham, reception and other ceremony timings in one clear place guests can revisit.",
  },
  {
    icon: MapPin,
    title: "Venue map",
    desc: "Tap-to-open Google Maps so out-of-town relatives find the hall without chasing addresses.",
  },
  {
    icon: BookOpen,
    title: "Couple story",
    desc: "A short story section that feels personal — more than a flat image card.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp-ready link",
    desc: "One polished link you paste into chats and family groups. It looks proper when shared.",
  },
  {
    icon: Timer,
    title: "Countdown",
    desc: "A live countdown to the big day, built for mobile screens and slower networks.",
  },
  {
    icon: Music,
    title: "Music & atmosphere",
    desc: "Optional background music and motion so the invite feels celebratory, not like a PDF.",
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
          What&apos;s inside your invitation
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Only what guests need — dates, place, timings and your story — in a
          link that loads quickly on phones.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-card p-7 hover:border-primary/40 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {f.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
