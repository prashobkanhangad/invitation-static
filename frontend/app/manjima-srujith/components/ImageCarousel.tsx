"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselImages = [
  { src: "/manjima/WhatsApp Image 2026-04-08 at 13.29.34 (2).jpeg", alt: "Moment 1" },
  { src: "/manjima/WhatsApp Image 2026-04-08 at 13.29.34 (3).jpeg", alt: "Moment 2" },
  { src: "/manjima/WhatsApp Image 2026-04-08 at 13.29.34.jpeg", alt: "Moment 3" },
  { src: "/manjima/WhatsApp Image 2026-04-08 at 13.29.35 (1).jpeg", alt: "Moment 4" },
  { src: "/manjima/WhatsApp Image 2026-04-08 at 13.29.35.jpeg", alt: "Moment 5" },
  { src: "/manjima/WhatsApp Image 2026-04-08 at 13.29.36.jpeg", alt: "Moment 6" },
  { src: "/manjima/WhatsApp Image 2026-04-08 at 13.29.37.jpeg", alt: "Moment 7" },
];

export const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <div className="mt-12 sm:mt-16 md:mt-20 animate-fade-in-up">
      <div className="relative max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#D4AF37]/40">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {carouselImages.map((image) => (
              <div key={image.src} className="min-w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#9e1c12]" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#9e1c12]" />
          </button>
        </div>
      </div>
    </div>
  );
};
