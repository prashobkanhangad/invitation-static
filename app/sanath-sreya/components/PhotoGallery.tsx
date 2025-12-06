"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const floralDivider = "/modern/floral-divider.svg";

const photos = [
  { src: "/sanath/img-5.jpeg", alt: "Wedding moment" },
  // { src: "/sanath/img-6.jpeg", alt: "Beautiful memory" },
  { src: "/sanath/img-7.jpeg", alt: "Special occasion" },
  { src: "/sanath/img-8.jpeg", alt: "Cherished moment" },
  { src: "/sanath/img-9.jpeg", alt: "Celebration" },
  { src: "/sanath/img-10.jpeg", alt: "Joyful memory" },
  { src: "/sanath/img-11.jpeg", alt: "Beautiful day" },
  { src: "/sanath/img-12.jpeg", alt: "Memorable moment" },
  { src: "/sanath/img-13.jpeg", alt: "Special day" },
  // { src: "/sanath/img-14.jpeg", alt: "Wedding celebration" },
  { src: "/sanath/img-15.jpeg", alt: "Love story" },
  { src: "/sanath/img-1.jpeg", alt: "Together forever" },
];

export const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#F5E6D3] via-[#FFF8DC] to-[#F5DEB3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <img src={floralDivider} alt="" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 opacity-60" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#8B0000] mb-2 sm:mb-3 drop-shadow-sm">Some Sneak Peaks</h2>
          <p className="text-[#654321] text-sm sm:text-base md:text-lg mt-2 sm:mt-4 font-medium">Capturing our beautiful moments together</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.alt}
              className="group relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg border-2 border-[#DAA520]/20 hover:border-[#DAA520]/50 cursor-pointer animate-fade-in-up aspect-square transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedImage(photo.src)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs sm:text-sm font-medium truncate">{photo.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {isClient && selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 rounded-full bg-background/90 p-2 text-foreground shadow-lg transition hover:bg-background"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={selectedImage} alt="Gallery photo" className="max-h-[85vh] w-auto rounded-2xl object-contain" />
          </div>
        )}
      </div>
    </section>
  );
};
