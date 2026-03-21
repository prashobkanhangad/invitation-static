"use client";

import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { albumPhotos } from "../photos";

export function AlbumGallery() {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => {
    setIndex((i) => (i === null ? null : i === 0 ? albumPhotos.length - 1 : i - 1));
  }, []);
  const next = useCallback(() => {
    setIndex((i) => (i === null ? null : (i + 1) % albumPhotos.length));
  }, []);

  const downloadCurrent = useCallback(async () => {
    if (index === null) return;
    const src = albumPhotos[index].src;
    const filename = `srideep-shobana-photo-${index + 1}.jpeg`;
    try {
      const res = await fetch(src);
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
      a.href = src;
      a.download = filename;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  return (
    <section
      className="relative py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-5 lg:px-6 bg-[#ebe4d8]"
      aria-labelledby="gallery-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[#8b6914] text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3">
            Gallery
          </p>
          <h2
            id="gallery-heading"
            className="font-serif text-[#2c1810] text-2xl sm:text-3xl md:text-4xl font-normal"
          >
            Every photograph, a memory
          </h2>
          <p className="mt-3 text-[#5c5046] text-sm max-w-md mx-auto">
            Tap any image to view full screen. Use arrows or swipe to browse.
          </p>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 list-none p-0 m-0">
          {albumPhotos.map((photo, i) => (
            <li key={photo.src} className="m-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative w-full aspect-[4/5] overflow-hidden rounded-lg sm:rounded-xl bg-[#dcd3c4] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b6914] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ebe4d8]"
                aria-label={`Open photo ${i + 1} of ${albumPhotos.length}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading={i < 8 ? "eager" : "lazy"}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-[#1a120c]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {index !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0a08]/95 p-2 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Full screen photo"
        >
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-[102] flex items-center gap-2">
            <button
              type="button"
              onClick={downloadCurrent}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 text-[#f7f2e9] bg-[#2c1810]/80 hover:bg-[#3d2418] border border-[#c9a227]/30 transition-colors text-xs sm:text-sm font-medium"
              aria-label="Download this photo"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              type="button"
              onClick={close}
              className="rounded-full p-2.5 text-[#f7f2e9] bg-[#2c1810]/80 hover:bg-[#3d2418] border border-[#c9a227]/30 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <button
            type="button"
            onClick={prev}
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-[102] rounded-full p-2 sm:p-3 text-[#f7f2e9] bg-[#2c1810]/80 hover:bg-[#3d2418] border border-[#c9a227]/30 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-[102] rounded-full p-2 sm:p-3 text-[#f7f2e9] bg-[#2c1810]/80 hover:bg-[#3d2418] border border-[#c9a227]/30 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div className="relative max-w-[min(100vw-1rem,1200px)] max-h-[min(100dvh-4rem,900px)] w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={albumPhotos[index].src}
              alt={albumPhotos[index].alt}
              className="max-w-full max-h-[min(100dvh-5rem,880px)] w-auto h-auto object-contain rounded-lg sm:rounded-xl shadow-2xl"
            />
          </div>
          <p className="absolute bottom-4 left-0 right-0 text-center text-[#d4c4b0] text-xs tracking-widest">
            {index + 1} / {albumPhotos.length}
          </p>
        </div>
      )}
    </section>
  );
}
