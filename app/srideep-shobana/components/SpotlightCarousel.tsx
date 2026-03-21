"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";

const BASE = "/srideep_shobana";

const spotlightSlides = [
  { src: `${BASE}/img-13.jpeg`, alt: "Sreejai Sreedeep & Shobana Rambe — featured moment 1", fileNum: 13 },
  { src: `${BASE}/img-17.jpeg`, alt: "Sreejai Sreedeep & Shobana Rambe — featured moment 2", fileNum: 17 },
  { src: `${BASE}/img-18.jpeg`, alt: "Sreejai Sreedeep & Shobana Rambe — featured moment 3", fileNum: 18 },
  { src: `${BASE}/img-12.jpeg`, alt: "Sreejai Sreedeep & Shobana Rambe — featured moment 4", fileNum: 12 },
  { src: `${BASE}/img-15.jpeg`, alt: "Sreejai Sreedeep & Shobana Rambe — featured moment 5", fileNum: 15 },
];

export function SpotlightCarousel() {
  const [current, setCurrent] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const len = spotlightSlides.length;

  const goPrev = useCallback(() => {
    setCurrent((i) => (i - 1 + len) % len);
  }, [len]);

  const goNext = useCallback(() => {
    setCurrent((i) => (i + 1) % len);
  }, [len]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + len) % len));
  }, [len]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % len));
  }, [len]);

  const downloadLightbox = useCallback(async () => {
    if (lightboxIndex === null) return;
    const slide = spotlightSlides[lightboxIndex];
    const filename = `srideep-shobana-spotlight-${slide.fileNum}.jpeg`;
    try {
      const res = await fetch(slide.src);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      const a = document.createElement("a");
      a.href = slide.src;
      a.download = filename;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex !== null) return;
    const id = setInterval(goNext, 5000);
    return () => clearInterval(id);
  }, [goNext, lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      setCurrent(lightboxIndex);
    }
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, lightboxPrev, lightboxNext]);

  const openLightbox = () => {
    setLightboxIndex(current);
  };

  return (
    <section
      className="relative py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-5 lg:px-6 bg-[#f2ebe0]"
      aria-labelledby="spotlight-heading"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[#8b6914] text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3">
            Highlights
          </p>
          <h2
            id="spotlight-heading"
            className="font-serif text-[#2c1810] text-2xl sm:text-3xl md:text-4xl font-normal"
          >
            Moments in focus
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4 opacity-70">
            <span className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent to-[#c9a227]" />
            <span className="text-[#a67c52] text-sm font-serif">❋</span>
            <span className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent to-[#c9a227]" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl bg-[#dcd3c4]">
          <button
            type="button"
            onClick={openLightbox}
            className="relative block w-full overflow-hidden text-left cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b6914] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f2ebe0] rounded-xl sm:rounded-2xl"
            aria-label="Open current slide full screen"
          >
            <div
              className="flex transition-transform duration-500 ease-out pointer-events-none"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {spotlightSlides.map((slide, index) => (
                <div
                  key={slide.src}
                  className="min-w-full relative aspect-[4/5] sm:aspect-[3/4] md:aspect-[16/10]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#1c1410]/35 via-transparent to-[#1c1410]/10 pointer-events-none"
                    aria-hidden
                  />
                </div>
              ))}
            </div>

          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 sm:p-2.5 text-[#f7f2e9] bg-[#2c1810]/70 hover:bg-[#2c1810]/90 backdrop-blur-sm transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 sm:p-2.5 text-[#f7f2e9] bg-[#2c1810]/70 hover:bg-[#2c1810]/90 backdrop-blur-sm transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 sm:gap-2 z-10 pointer-events-auto">
            {spotlightSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 sm:w-8 bg-[#e8d5b5]"
                    : "w-1.5 sm:w-2 bg-[#f7f2e9]/50 hover:bg-[#f7f2e9]/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-pressed={i === current}
              />
            ))}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0a08]/95 p-2 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Full screen photo"
        >
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-[102] flex items-center gap-2">
            <button
              type="button"
              onClick={downloadLightbox}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 text-[#f7f2e9] bg-[#2c1810]/80 hover:bg-[#3d2418] border border-[#c9a227]/30 transition-colors text-xs sm:text-sm font-medium"
              aria-label="Download this photo"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              type="button"
              onClick={closeLightbox}
              className="rounded-full p-2.5 text-[#f7f2e9] bg-[#2c1810]/80 hover:bg-[#3d2418] border border-[#c9a227]/30 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <button
            type="button"
            onClick={lightboxPrev}
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-[102] rounded-full p-2 sm:p-3 text-[#f7f2e9] bg-[#2c1810]/80 hover:bg-[#3d2418] border border-[#c9a227]/30 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button
            type="button"
            onClick={lightboxNext}
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-[102] rounded-full p-2 sm:p-3 text-[#f7f2e9] bg-[#2c1810]/80 hover:bg-[#3d2418] border border-[#c9a227]/30 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div className="relative max-w-[min(100vw-1rem,1200px)] max-h-[min(100dvh-4rem,900px)] w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={spotlightSlides[lightboxIndex].src}
              alt={spotlightSlides[lightboxIndex].alt}
              className="max-w-full max-h-[min(100dvh-5rem,880px)] w-auto h-auto object-contain rounded-lg sm:rounded-xl shadow-2xl"
            />
          </div>
          <p className="absolute bottom-4 left-0 right-0 text-center text-[#d4c4b0] text-xs tracking-widest">
            {lightboxIndex + 1} / {len}
          </p>
        </div>
      )}
    </section>
  );
}
