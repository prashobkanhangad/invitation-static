"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const floralDivider = "/modern/floral-divider.svg";

const photos = [
  { src: "/modern/gallery-1.jpg", alt: "Couple in garden" },
  { src: "/modern/gallery-2.jpg", alt: "Golden hour portrait" },
  { src: "/modern/gallery-3.jpg", alt: "Candid laughter" },
  { src: "/modern/gallery-4.jpg", alt: "Sunset silhouette" },
  { src: "/modern/gallery-5.jpg", alt: "Traditional ceremony" },
  { src: "/modern/gallery-6.jpg", alt: "Modern casual shoot" },
  { src: "/modern/gallery-7.jpg", alt: "Intimate moment" },
  { src: "/modern/gallery-8.jpg", alt: "Full length portrait" },
];

export const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <img src={floralDivider} alt="" className="w-16 h-16 mx-auto mb-6 opacity-60" />
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Some Sneak Peaks</h2>
          <p className="text-muted-foreground text-lg mt-4">Capturing our beautiful moments together</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.alt}
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer animate-fade-in-up aspect-square"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedImage(photo.src)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
