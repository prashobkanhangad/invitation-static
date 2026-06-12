import { Heart } from "lucide-react";

export const InvitationSection = () => {
  return (
    <section className="pt-12 sm:pt-16 md:pt-24 pb-0 px-4 sm:px-6 bg-fabric-texture relative">
      <div className="max-w-4xl mx-auto text-center animate-fade-in-up relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#C9A962] to-transparent" />
          <div className="w-2 h-2 rounded-full bg-[#C9A962]" />
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#C9A962] to-transparent" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2D5244] mb-4 sm:mb-6 md:mb-8 px-4 drop-shadow-sm">
          Join Us in Celebrating Our Special Occasion
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-[#5C4A3A] max-w-2xl mx-auto leading-relaxed px-4 mb-6 sm:mb-8 font-medium">
          We warmly invite you to join us in celebrating our special day. Your presence and
          blessings will make the day even more memorable.
        </p>

        <div className="mt-8 sm:mt-10 md:mt-12 flex items-center justify-center gap-2 sm:gap-3 px-4">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A7C59] fill-[#4A7C59] animate-pulse" />
          <p className="text-xl sm:text-2xl md:text-3xl font-serif text-[#2D5244] font-semibold drop-shadow-sm">
            Puneeth &amp; Suma
          </p>
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A7C59] fill-[#4A7C59] animate-pulse" />
        </div>

        <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 px-4">
          <p className="text-[#5C4A3A] text-xs sm:text-sm md:text-base font-semibold">
            With Best Compliments From:{" "}
            <span className="text-[#2D5244] font-bold">
              Smt. Late Bharathi &amp; Sri N. Nagaraju &amp; Family, Smt. Pushpa &amp; Sri
              Narayanappa, Smt. Jyothi &amp; Sri Nanjundappa, Smt. Bhagya &amp; Sri Thimmappa,
              Family, Sons, Son in Laws, Relatives &amp; Friends
            </span>
          </p>
          <p className="text-[#4A7C59] text-xs sm:text-sm md:text-base italic max-w-xl mx-auto">
            &ldquo;Your gracious presence and blessings will add joy to this special occasion as we
            unite two hearts.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};
