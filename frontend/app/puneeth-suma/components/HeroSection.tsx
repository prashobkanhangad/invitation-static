"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { images, venueMapLink } from "./images";

const rotatingTexts = [
  {
    prefix: "|| Sri Lakshmi Venkateshwara Prasanna ||",
    type: "names" as const,
    prefixClass: "text-xs sm:text-sm md:text-base tracking-[0.12em]",
  },
  {
    prefix: "Save the date",
    main: "21 · 06 · 2026",
    type: "date" as const,
    prefixClass: "text-base sm:text-lg md:text-xl tracking-[0.2em]",
  },
];

export const HeroSection = () => {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const slide = rotatingTexts[currentText];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={images.hero}
          alt="Puneeth & Suma"
          className="w-full h-full object-cover animate-zoom"
          style={{ objectPosition: "center 30%" }}
        />
      </div>

      <div className="relative z-10 w-full flex flex-col h-screen">
        <div className="px-4 sm:px-6 pt-16 sm:pt-20 md:pt-24">
          <div className="text-center max-w-5xl mx-auto animate-fade-in-up">
            <div key={currentText} className="space-y-3 sm:space-y-4">
              <p
                className={`text-[#FFF8DC]/90 font-light uppercase animate-fade-in drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${slide.prefixClass}`}
              >
                {slide.prefix}
              </p>
              {slide.type === "names" ? (
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#FFF8DC] font-bold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] animate-fade-in-up">
                  Puneeth{" "}
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light italic tracking-wide">
                    with
                  </span>{" "}
                  Suma
                </h1>
              ) : (
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#FFF8DC] font-bold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] animate-fade-in-up">
                  {slide.main}
                </h1>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="px-4 sm:px-6 pb-24 sm:pb-32 md:pb-40">
          <div className="text-center max-w-5xl mx-auto animate-fade-in-up">
            <a
              href={venueMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2D5244] via-[#3D6B58] to-[#2D5244] backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-[#FFF8DC] shadow-2xl transition-all duration-300 hover:from-[#3D6B58] hover:via-[#4F8269] hover:to-[#3D6B58] hover:scale-105 hover:shadow-3xl border border-[#C9A962]/40"
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Go to venue</span>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-[#FFF8DC]/60 rounded-full flex items-start justify-center p-1.5 sm:p-2">
          <div className="w-1 h-2 sm:h-3 bg-[#FFF8DC]/60 rounded-full" />
        </div>
      </div>
    </section>
  );
};
