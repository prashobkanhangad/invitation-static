"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { openWhatsApp } from "@/utils/whatsapp";

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah L.",
      role: "Bride",
      content: "The easiest and most beautiful way to create invitations! I got so many compliments from my guests.",
      avatar: "SL"
    },
    {
      name: "Michael R.",
      role: "Event Planner",
      content: "This platform has revolutionized how I create invitations for my clients. Professional and efficient!",
      avatar: "MR"
    },
    {
      name: "Emily Chen",
      role: "Birthday Host",
      content: "I loved how simple it was to customize everything. My daughter's birthday invitations were perfect!",
      avatar: "EC"
    },
    {
      name: "David Thompson",
      role: "Corporate Manager",
      content: "Professional templates that impressed our board members. The RSVP tracking feature is invaluable.",
      avatar: "DT"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const previousTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-[#F5F5F0]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Loved by hosts everywhere.
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <Quote className="absolute top-6 left-6 w-8 h-8 text-[#E5E5E0]" />
            
            <div className="relative">
              <div className="text-center mb-8">
                <p className="text-lg md:text-xl text-gray-700 italic leading-relaxed mb-6">
                  "{testimonials[currentTestimonial].content}"
                </p>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-[#333333] rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</p>
                    <p className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={previousTestimonial}
                  className="p-2 rounded-full bg-[#E5E5E0] hover:bg-[#D5D5D0] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-[#333333]" />
                </button>
                
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial
                          ? "bg-[#333333] w-8"
                          : "bg-[#E5E5E0]"
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-[#E5E5E0] hover:bg-[#D5D5D0] transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-[#333333]" />
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => openWhatsApp("Hi! I read the testimonials and want to know more.")}
              className="inline-block bg-[#333333] text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
            >
              Chat with Us on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
