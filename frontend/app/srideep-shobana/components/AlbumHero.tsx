import Image from "next/image";
import { heroPhoto } from "../photos";

export function AlbumHero() {
  return (
    <header className="relative min-h-[100dvh] min-h-[100svh] flex flex-col overflow-hidden bg-[#1c1410]">
      <div className="absolute inset-0">
        <Image
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 w-full px-5 sm:px-8 pb-8 sm:pb-10">
        <div
          className="max-w-4xl mx-auto w-full text-center [text-shadow:0_2px_16px_rgba(0,0,0,0.75),0_1px_4px_rgba(0,0,0,0.9)] pt-[max(4.75rem,env(safe-area-inset-top,0px))] sm:pt-[max(5.5rem,env(safe-area-inset-top,0px))] md:pt-[max(6.25rem,env(safe-area-inset-top,0px))]"
        >
          <p className="text-[#faf6ef] text-[10px] sm:text-xs tracking-[0.35em] uppercase font-medium mb-4">
            A cherished collection
          </p>
          <div className="flex items-center justify-center gap-3 mb-5 opacity-90">
            <span className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent to-[#f5e6c8]" />
            <span className="text-[#faf6ef] text-lg font-serif">॥</span>
            <span className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent to-[#f5e6c8]" />
          </div>
          <h1 className="font-serif text-[#faf6ef] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.15] tracking-tight">
            Sreejai Sreedeep
            <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 text-[#f5e6c8] font-light tracking-wide">
              &amp; Shobana Rambe
            </span>
          </h1>
          <p className="mt-6 text-[#faf6ef] text-sm sm:text-base max-w-md mx-auto leading-relaxed font-light">
            A collection of cherished moments — preserved with warmth and grace.
          </p>
          <div className="mt-8 flex justify-center">
            <span
              className="inline-flex flex-col items-center gap-2 text-[#f5e6c8] text-[10px] tracking-[0.2em] uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]"
              aria-hidden
            >
              <span className="animate-bounce">Scroll</span>
              <span className="w-px h-8 bg-gradient-to-b from-[#c9a227] to-transparent" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
