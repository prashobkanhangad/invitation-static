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
    setCurrentIndex((prev) => (prev - 1 + images.carousel.length) % images.carousel.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.carousel.length);
  };

  return (
    <div className="mt-12 sm:mt-16 md:mt-20 animate-fade-in-up">
      <div className="relative max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.carousel.map((image, index) => (
              <div key={index} className="min-w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover relative z-0"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FFF8DC]/90 hover:bg-[#FFF8DC] rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#2D5244]" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#FFF8DC]/90 hover:bg-[#FFF8DC] rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#2D5244]" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.carousel.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#C9A962] w-6 sm:w-8"
                    : "bg-[#FFF8DC]/60 hover:bg-[#FFF8DC]/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
