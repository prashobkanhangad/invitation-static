"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const heroImage = "/jithendra-naditha/img-3.jpeg";

const rotatingTexts = [
  { prefix: "Namaskaram", main: "I'm Jithendra" },
  { prefix: "and I am", main: "Nanditha" },
  { prefix: "We're tying the knot", main: "30 · 11 · 2025" },
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
    <section className="relative min-h-screen flex items-end md:items-center justify-center overflow-hidden pb-32 md:pb-0">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Wedding couple" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-overlay)" }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
        <div className="mb-4 space-y-2">
          <p className="text-white text-lg md:text-xl font-light tracking-wide">
            {rotatingTexts[currentText].prefix}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white font-bold">
            {rotatingTexts[currentText].main}
          </h1>
        </div>

        <div className="mt-2">
          <a
            href="https://maps.app.goo.gl/?q=Sumangali+Auditorium+Periya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary/90 px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary"
          >
            <MapPin className="w-5 h-5 text-white" />
            <span className="text-white">Go to venue</span>
          </a>
        </div>
{/* 
        <p className="mt-16 text-white/90 text-sm md:text-base">
          Payyannur witnesses our vows on 23rd November 2025.
          <br />
          Kindly view this invite on mobile for the best experience.
        </p> */}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};
