"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { openWhatsApp } from "@/utils/whatsapp";

const testimonials = [
  {
    name: "Anupriya & Adarsh",
    role: "Kanhangad",
    initials: "AA",
    gradient: "from-secondary to-primary/60",
    text: "We didn’t want bulky printed cards, but our families still expected something ‘proper.’ The Invyto invite looked polished on WhatsApp and everyone could open it on their phone without fuss. A few relatives told us they kept going back to check the map and timings.",
  },
  {
    name: "Sanath & Shreya",
    role: "Thaliparamba",
    initials: "SS",
    gradient: "from-primary/80 to-secondary/70",
    text: "Half our guest list was out of town. One link for dates, venue, and the story section saved us from repeating the same details in fifty chats. A few people said the page loaded quickly even on slower networks.",
  },
  {
    name: "Sreejai Sreedeep & Shobana Rambe",
    role: "Photo album",
    initials: "SB",
    gradient: "from-muted to-primary/40",
    text: "After the wedding we wanted something calmer than a flood of WhatsApp forwards for photos. The album layout felt intentional—people could actually browse instead of scrolling a messy camera roll. Family shared it in our groups and it stayed easy to open on mobile.",
  },
];

const Testimonials = () => (
  <section id="testimonials" className="py-24 md:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          From couples we’ve worked with
        </h2>
        <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
          Short, honest feedback—how the invite and album worked in real celebrations.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-8 hover:border-primary/30 transition-colors"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-foreground/90 leading-relaxed mb-6 text-[15px]">&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-[10px] font-bold text-primary-foreground leading-tight text-center px-0.5 shrink-0`}
              >
                {t.initials}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm leading-snug">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <button
          type="button"
          onClick={() => openWhatsApp("Hi! I read the testimonials and want to know more.")}
          className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Chat with us on WhatsApp
        </button>
      </div>
    </div>
  </section>
);

export default Testimonials;
