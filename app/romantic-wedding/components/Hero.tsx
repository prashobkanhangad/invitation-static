"use client";

import Image from "next/image";

export default function Hero() {
  const scrollToRSVP = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/romanticpage/hero-couple.jpg"
          alt="Wedding couple"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>
      
      <div className="relative z-10 text-center px-4 py-20 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <p className="text-white/90 font-sans text-lg md:text-xl mb-4 tracking-wide">
            We're Getting Married
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight">
            Sarah & James
          </h1>
          <div className="w-24 h-px bg-white/60 mx-auto mb-8" />
          <p className="text-white/90 font-sans text-xl md:text-2xl mb-12">
            June 15, 2025 • Tuscany, Italy
          </p>
          <button 
            onClick={scrollToRSVP}
            className="bg-[#333333] hover:bg-[#555555] text-white font-sans text-lg px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105"
          >
            RSVP Now
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-white/70" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}

