"use client";

import { Search, Palette, Share2 } from "lucide-react";
import { openWhatsApp } from "@/utils/whatsapp";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      number: "1",
      title: "Choose a Template",
      description: "Browse our library of stunning templates and find the perfect one for your event."
    },
    {
      icon: Palette,
      number: "2",
      title: "Customize Your Design",
      description: "Add your event details, upload photos, and personalize the design to match your style."
    },
    {
      icon: Share2,
      number: "3",
      title: "Share with Your Guests",
      description: "Send your beautiful invitations to your guests and manage your RSVPs with ease."
    }
  ];

  return (
    <section className="py-20 bg-[#F5F5F0]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Create your perfect invitation in 3 simple steps.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-[#E5E5E0]">
                    <div className="absolute right-0 -top-1 w-3 h-3 bg-[#333333] rounded-full"></div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#333333] rounded-full opacity-10 scale-150"></div>
                    <div className="relative w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-[#333333] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.number}
                      </span>
                      <Icon className="w-10 h-10 text-[#333333]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-12 text-center">
        <button
          onClick={() => openWhatsApp("Hi! Can you help me create my invitation in 3 steps?")}
          className="inline-block bg-[#333333] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#555555] transition-colors"
        >
          Try It Now
        </button>
      </div>
    </section>
  );
}
