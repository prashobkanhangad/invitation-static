export function AlbumIntro() {
  return (
    <section
      className="relative py-14 sm:py-20 px-5 sm:px-8 bg-[#f7f2e9]"
      aria-labelledby="album-intro-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, #5c4033 0px, #5c4033 1px, transparent 1px, transparent 24px),
            repeating-linear-gradient(0deg, #5c4033 0px, #5c4033 1px, transparent 1px, transparent 24px)`,
        }}
        aria-hidden
      />
      <div className="relative max-w-2xl mx-auto text-center">
        <p className="text-[#8b6914] text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-4">
          With gratitude
        </p>
        <h2
          id="album-intro-heading"
          className="font-serif text-[#2c1810] text-2xl sm:text-3xl md:text-4xl font-normal leading-snug"
        >
          Moments woven in time
        </h2>
        <div className="flex items-center justify-center gap-2 my-6">
          <span className="h-px w-12 bg-[#c9a227]/60" />
          <span className="text-[#a67c52] text-sm font-serif">❋</span>
          <span className="h-px w-12 bg-[#c9a227]/60" />
        </div>
        <p className="text-[#4a3f35] text-sm sm:text-base leading-[1.75] font-light">
          This album brings together photographs from our journey — shared in the spirit of family,
          tradition, and togetherness. We hope each frame carries the same warmth it held for us.
        </p>
      </div>
    </section>
  );
}
