"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const heroImage = "/sanath/img-17.jpeg";

const rotatingTexts = [
  { prefix: "Namaskaram", main: "I'm Sanath" },
  { prefix: "and I am", main: "Shreya" },
  { prefix: "We're tying the knot", main: "13 · 12 · 2025" },
];

export const HeroSection = () => {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Wedding couple" 
          className="w-full h-full object-cover scale-105 transition-transform duration-[20s] ease-out" 
        />
      </div>

      <div className="relative z-10 w-full flex flex-col h-screen">
        {/* Upper Section - All Text Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-48 sm:pb-56 md:pb-64 lg:pb-72">
          <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up">
            <p className="text-white text-lg sm:text-xl md:text-2xl font-serif italic tracking-wide drop-shadow-lg font-semibold">
              "Two souls, one heart, forever united"
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              <p className="text-white text-sm sm:text-base md:text-lg font-medium uppercase tracking-[0.3em]">
                With the blessings of our families
              </p>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <p className="text-white text-base sm:text-lg md:text-xl font-serif mb-6 sm:mb-8 font-medium">
              We invite you to witness and celebrate our sacred union
            </p>
            
            {/* Rotating Text */}
            <div className="space-y-3 sm:space-y-4">
              <p className="text-white/90 text-base sm:text-lg md:text-xl font-light tracking-[0.2em] uppercase animate-fade-in">
                {rotatingTexts[currentText].prefix}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-white font-bold leading-tight drop-shadow-2xl animate-fade-in-up">
                {rotatingTexts[currentText].main}
              </h1>
            </div>

            {/* Button */}
            <div className="mt-8 sm:mt-10">
              <a
                href="https://maps.app.goo.gl/?q=Dream+Palace+Auditorium+Thaliparamba"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-2xl transition-all duration-300 hover:from-[#DAA520] hover:via-[#FFD700] hover:to-[#DAA520] hover:scale-105 hover:shadow-3xl border border-[#FFD700]/30"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Go to venue</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/60 rounded-full flex items-start justify-center p-1.5 sm:p-2">
          <div className="w-1 h-2 sm:h-3 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
};
