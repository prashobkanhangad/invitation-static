import { venueMapLink, venueEmbedUrl } from "./images";

export const MapSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 md:space-y-20">
        <div className="space-y-6 sm:space-y-8 text-center">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#7A2430] font-semibold">
              Wedding Ceremony Venue
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#7A2430] px-4 drop-shadow-sm">
              Malabar Ocean Front &amp; Spa
            </h2>
            <p className="text-[#5C4A3A] text-sm sm:text-base md:text-lg px-4 leading-relaxed font-medium">
              Nileshwar — tap below to open directions
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#C4A574]/40 hover:shadow-3xl transition-shadow duration-300">
            <iframe
              title="Malabar Ocean Front & Spa Location"
              src={venueEmbedUrl}
              width="100%"
              height="320"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full sm:h-[380px] md:h-[420px]"
            />
          </div>

          <a
            href={venueMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7A2430] via-[#9B3A48] to-[#7A2430] px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:from-[#9B3A48] hover:via-[#C4A574] hover:to-[#9B3A48] hover:scale-105 border border-[#C4A574]/40"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};
