import { venueEmbedUrl, venueMapLink } from "./images";

export const MapSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-fabric-texture relative">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 md:space-y-20 relative z-10">
        <div className="space-y-6 sm:space-y-8 text-center">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#4A7C59] font-semibold">
              Marriage &amp; Reception Venue
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2D5244] px-4 drop-shadow-sm">
              Sri Rama Palace
            </h2>
            <p className="text-[#5C4A3A] text-sm sm:text-base md:text-lg px-4 leading-relaxed font-medium">
              Mastenahalli Road, Kaiwara, Chintamani Taluk · Tap below to open directions
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-[#C9A962]/40 hover:shadow-3xl transition-shadow duration-300">
            <iframe
              title="Sri Rama Palace Location"
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
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#2D5244] via-[#3D6B58] to-[#2D5244] px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-[#FFF8DC] shadow-lg hover:shadow-xl transition-all duration-300 hover:from-[#3D6B58] hover:via-[#4F8269] hover:to-[#3D6B58] hover:scale-105 border border-[#C9A962]/40"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};
