import { Quote } from "lucide-react";
import { images } from "./images";

const floralDivider = "/modern/floral-divider.svg";

export const StorySection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <p className="text-[#7A2430] text-base sm:text-lg md:text-xl mb-2 font-medium">
            Rooted in tradition, woven with destiny.
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#7A2430] mb-3 sm:mb-4 drop-shadow-sm">
            Anjana &amp; Jishnu
          </h2>
          <img
            src={floralDivider}
            alt=""
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mt-4 sm:mt-6 opacity-60"
          />
        </div>

        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl animate-fade-in-up border-2 border-[#C4A574]/40 transition-all duration-300 hover:scale-[1.01]">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#7A2430] mb-3 sm:mb-4" />
            <p className="text-[#5C4A3A] text-base sm:text-lg md:text-xl leading-relaxed italic mb-3 sm:mb-4">
              &ldquo;With immense joy and divine grace, we cordially invite you
              and your family to grace the auspicious occasion of our wedding
              celebrations.&rdquo;
            </p>
            <p className="text-[#7A2430] font-semibold text-right text-sm sm:text-base">
              — Anjana
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl animate-fade-in-up border-2 border-[#C4A574]/40 transition-all duration-300 hover:scale-[1.01]">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#7A2430] mb-3 sm:mb-4" />
            <p className="text-[#5C4A3A] text-base sm:text-lg md:text-xl leading-relaxed italic mb-3 sm:mb-4">
              &ldquo;With the blessings of our families, we come together to
              celebrate this sacred union. Your gracious presence and blessings
              will make the occasion truly memorable.&rdquo;
            </p>
            <p className="text-[#7A2430] font-semibold text-right text-sm sm:text-base">
              — Jishnu
            </p>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12 animate-fade-in-up">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A2430] px-4 drop-shadow-sm">
            Save the date{" "}
            <span className="text-[#B8860B] font-bold">13.09.2026</span>
          </p>
        </div>

        <div className="mt-8 sm:mt-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl animate-fade-in-up">
          <div className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[90vh] w-full">
            <img
              src={images.story}
              alt="Anjana and Jishnu together"
              className="h-full w-full object-cover transition-transform duration-[4000ms] ease-out hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
