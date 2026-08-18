"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { images } from "./images";

export const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.carousel.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + images.carousel.length) % images.carousel.length,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.carousel.length);
  };

  return (
    <div className="mt-12 sm:mt-16 md:mt-20 animate-fade-in-up">
      <div className="relative max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#C4A574]/40">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.carousel.map((image) => (
              <div
                key={image.src}
                className="min-w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative"
              >
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
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#7A2430]" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#7A2430]" />
          </button>
        </div>
      </div>
    </div>
  );
};
