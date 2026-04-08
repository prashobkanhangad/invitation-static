"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { openWhatsApp } from "@/utils/whatsapp";

const plans = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    desc: "Perfect for small gatherings",
    features: ["1 event", "Up to 50 guests", "Basic invitation templates", "Photo album (100 photos)"],
  },
  {
    name: "Pro",
    monthly: 19,
    yearly: 15,
    desc: "For weddings & larger events",
    popular: true,
    features: [
      "Unlimited events",
      "Up to 500 guests",
      "Premium templates",
      "AI Photo Finder",
      "Custom branding",
      "Priority support",
    ],
  },
  {
    name: "Business",
    monthly: 49,
    yearly: 39,
    desc: "For planners & photographers",
    features: [
      "Everything in Pro",
      "Unlimited guests",
      "White-label option",
      "API access",
      "Team collaboration",
      "Dedicated support",
    ],
  },
];

const Pricing = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 md:py-32 bg-muted/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">Start free. Upgrade when you&apos;re ready.</p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm ${!yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setYearly(!yearly)}
              aria-pressed={yearly}
              className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 block w-5 h-5 rounded-full bg-foreground transition-transform ${
                  yearly ? "translate-x-[1.375rem]" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm ${yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Yearly <span className="text-primary text-xs">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-primary bg-card shadow-xl shadow-primary/10 scale-105"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-2xl font-semibold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
              <div className="mt-6 mb-6">
                <span className="font-display text-5xl font-bold text-foreground">
                  ${yearly ? plan.yearly : plan.monthly}
                </span>
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() =>
                  openWhatsApp(
                    plan.monthly === 0
                      ? `Hi! I'm interested in the ${plan.name} plan on Invyto.`
                      : `Hi! I'd like to know more about the ${plan.name} plan on Invyto.`
                  )
                }
                className={`w-full py-3 rounded-full text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "border border-primary/40 text-primary hover:bg-primary/10"
                }`}
              >
                {plan.monthly === 0 ? "Get Started Free" : "Start Free Trial"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
