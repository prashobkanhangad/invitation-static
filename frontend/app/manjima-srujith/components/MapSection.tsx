const weddingMapLink =
  "https://www.google.com/maps/search/?api=1&query=Onath+Convention+Hall";
const weddingEmbedUrl =
  "https://www.google.com/maps?q=Onath+Convention+Hall&output=embed";

export const MapSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 md:space-y-20">
        <div className="space-y-6 sm:space-y-8 text-center">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#9e1c12] font-semibold">
              Wedding Ceremony Venue
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#9e1c12] px-4 drop-shadow-sm">
              Onath Convention Hall
            </h2>
            <p className="text-[#654321] text-sm sm:text-base md:text-lg px-4 leading-relaxed font-medium">
              Mulleria - Tap below to open directions
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#DAA520]/40 hover:shadow-3xl transition-shadow duration-300">
            <iframe
              title="Onath Convention Hall Location"
              src={weddingEmbedUrl}
              width="100%"
              height="320"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full sm:h-[380px] md:h-[420px]"
            />
          </div>

          <a
            href={weddingMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:from-[#DAA520] hover:via-[#FFD700] hover:to-[#DAA520] hover:scale-105 border border-[#FFD700]/30"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};
