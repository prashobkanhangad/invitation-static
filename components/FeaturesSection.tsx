"use client";

import { Palette, Wand2, Send } from "lucide-react";
import { openWhatsApp } from "@/utils/whatsapp";

export default function FeaturesSection() {
  const features = [
    {
      icon: Palette,
      title: "Beautiful Templates",
      description: "Choose from a curated collection of professionally designed templates for any occasion."
    },
    {
      icon: Wand2,
      title: "Easy Customization",
      description: "Personalize your invitations with your own text, photos, and colors. No design skills needed."
    },
    {
      icon: Send,
      title: "Seamless Sharing",
      description: "Share your invitations via email, WhatsApp, or social media with a single click."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Everything you need to create the perfect invitation.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
                  <Icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => openWhatsApp("Hi! Tell me more about your features.")}
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Chat on WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}
