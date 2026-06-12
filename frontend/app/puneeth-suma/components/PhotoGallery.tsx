"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { images } from "./images";

export const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 md:px-5 lg:px-6 bg-fabric-texture relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A962] to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#C9A962]" />
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A962] to-transparent" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2D5244] mb-2 sm:mb-3 drop-shadow-sm">
            Some Sneak Peaks
          </h2>
          <p className="text-[#5C4A3A] text-sm sm:text-base md:text-lg mt-2 sm:mt-4 font-medium">
            Capturing our beautiful moments together
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {images.gallery.map((photo, index) => (
            <div
              key={photo.src}
              className="group relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer animate-fade-in-up aspect-[7/6] transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedImage(photo.src)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-0"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D5244]/80 via-[#3D6B58]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[2]" />
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-[3]">
                <p className="text-[#FFF8DC] text-xs sm:text-sm font-medium truncate">{photo.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {isClient && selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D5244]/95 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 rounded-full bg-[#FFF8DC]/90 p-2 text-[#2D5244] shadow-lg transition hover:bg-[#FFF8DC] z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Gallery photo"
              className="max-h-[85vh] w-auto rounded-lg sm:rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </section>
  );
};
