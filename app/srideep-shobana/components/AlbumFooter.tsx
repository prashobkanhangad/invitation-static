export function AlbumFooter() {
  return (
    <footer className="bg-[#1c1410] text-[#c9b8a4] py-10 sm:py-12 px-5">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="flex items-center justify-center gap-2 opacity-60">
          <span className="h-px w-8 bg-[#c9a227]/50" />
          <span className="text-[#c9a227] text-xs font-serif">॥</span>
          <span className="h-px w-8 bg-[#c9a227]/50" />
        </div>
        <p className="font-serif text-[#e8d5b5] text-lg sm:text-xl tracking-wide">
          Sreejai Sreedeep &amp; Shobana Rambe
        </p>
        <p className="text-xs sm:text-sm text-[#9a8b7a] leading-relaxed max-w-sm mx-auto">
          Thank you for sharing these moments with us.
        </p>
        <a
          href="https://invyto.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#8b7355] hover:text-[#c9a227] transition-colors pt-2"
        >
          Crafted on Invyto
        </a>
      </div>
    </footer>
  );
}
