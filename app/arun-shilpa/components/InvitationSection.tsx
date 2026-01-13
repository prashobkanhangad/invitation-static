import { Heart } from "lucide-react";

export const InvitationSection = () => {
  return (
    <section className="pt-12 sm:pt-16 md:pt-24 pb-0 px-4 sm:px-6 bg-fabric-texture relative">
      <div className="max-w-4xl mx-auto text-center animate-fade-in-up relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#B8945F] to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-[#B8945F]"></div>
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#B8945F] to-transparent"></div>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#7A0F0F] mb-4 sm:mb-6 md:mb-8 px-4 drop-shadow-sm">
          Join Us in Celebrating Our Special Occasion
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-[#6B4423] max-w-2xl mx-auto leading-relaxed px-4 mb-6 sm:mb-8 font-medium">
          We warmly invite you to join us in celebrating our special day. Your presence and blessings will make the day even more memorable.
        </p>

        <div className="mt-8 sm:mt-10 md:mt-12 flex items-center justify-center gap-2 sm:gap-3 px-4">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B1A1A] fill-[#8B1A1A] animate-pulse" />
          <p className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A0F0F] font-semibold drop-shadow-sm">Shilpa & Arun</p>
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B1A1A] fill-[#8B1A1A] animate-pulse" />
        </div>

        <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 px-4">
          <p className="text-[#6B4423] text-xs sm:text-sm md:text-base font-semibold">
            With Best Compliments From: <span className="text-[#7A0F0F] font-bold">Ashwin, Medha & Dhyan</span>
          </p>
          <p className="text-[#8B1A1A] text-xs sm:text-sm md:text-base italic max-w-xl mx-auto">
            "Your gracious presence and blessings will add joy to this special occasion as we unite the two hearts."
          </p>
         
        </div>
      </div>
    </section>
  );
};
