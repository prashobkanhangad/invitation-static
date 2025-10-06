"use client";

import { openWhatsApp } from "@/utils/whatsapp";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to create your stunning invitation?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of happy hosts and make your next event unforgettable.
          </p>
          <button
            onClick={() => openWhatsApp("Hi! I'd like to create a invitation now.")}
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            Create Your Invitation Now
          </button>
          <p className="text-sm text-white/80 mt-4">
            No credit card required • forever plan available
          </p>
        </div>
      </div>
    </section>
  );
}
