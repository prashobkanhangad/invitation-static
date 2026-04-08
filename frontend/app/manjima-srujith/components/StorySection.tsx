import { Quote } from "lucide-react";

const floralDivider = "/modern/floral-divider.svg";
const togetherImage = "/manjima/WhatsApp Image 2026-04-08 at 13.29.34.jpeg";

export const StorySection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <p className="text-[#9e1c12] text-base sm:text-lg md:text-xl mb-2 font-medium">
            Rooted in tradition, woven with destiny.
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#9e1c12] mb-3 sm:mb-4 drop-shadow-sm">
            Manjima & Srujith
          </h2>
          <img
            src={floralDivider}
            alt=""
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mt-4 sm:mt-6 opacity-60"
          />
        </div>

        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl animate-fade-in-up border-2 border-[#D4AF37]/40 transition-all duration-300 hover:scale-[1.01]">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#9e1c12] mb-3 sm:mb-4" />
            <p className="text-[#654321] text-base sm:text-lg md:text-xl leading-relaxed italic mb-3 sm:mb-4">
              "With immense joy and divine grace, we cordially invite your
              esteemed presence with family on the auspicious occasion of our
              wedding."
            </p>
            <p className="text-[#9e1c12] font-semibold text-right text-sm sm:text-base">
              — Manjima
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl animate-fade-in-up border-2 border-[#D4AF37]/40 transition-all duration-300 hover:scale-[1.01]">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#9e1c12] mb-3 sm:mb-4" />
            <p className="text-[#654321] text-base sm:text-lg md:text-xl leading-relaxed italic mb-3 sm:mb-4">
              "With the blessings of our families and the grace of tradition,
              we come together to celebrate this sacred union. Your gracious
              presence and blessings will add joy to this special occasion."
            </p>
            <p className="text-[#9e1c12] font-semibold text-right text-sm sm:text-base">
              — Srujith
            </p>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12 animate-fade-in-up">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif text-[#9e1c12] px-4 drop-shadow-sm">
            Save the date{" "}
            <span className="text-[#B8860B] font-bold">12.04.2026</span>
          </p>
        </div>

        <div className="mt-8 sm:mt-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl animate-fade-in-up">
          <div className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[90vh] w-full">
            <img
              src={togetherImage}
              alt="Manjima and Srujith together"
              className="h-full w-full object-cover transition-transform duration-[4000ms] ease-out hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
