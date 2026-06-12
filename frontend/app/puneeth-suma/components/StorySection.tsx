import { Quote } from "lucide-react";
import { images } from "./images";

export const StorySection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-fabric-texture relative">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232D5244' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <p className="text-[#4A7C59] text-base sm:text-lg md:text-xl mb-2 font-medium">
            Solicit your gracious presence with family &amp; friends
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2D5244] mb-3 sm:mb-4 drop-shadow-sm">
            Puneeth &amp; Suma
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A962] to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#C9A962]" />
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A962] to-transparent" />
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          <div className="bg-silk-texture p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl animate-fade-in-up border border-[#C9A962]/30 transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A7C59] mb-3 sm:mb-4 relative z-10" />
            <p className="text-[#5C4A3A] text-base sm:text-lg md:text-xl leading-relaxed italic mb-3 sm:mb-4 relative z-10">
              &ldquo;On the auspicious occasion of the marriage of our son Chi. Ry. Puneeth N. M.A., B.Ed.
              (Only S/o Smt. Late Bharathi &amp; Sri N. Nagaraju) with Chi. Sou. Suma (Narasamma)
              (Third D/o Smt. Bhagya &amp; Sri Thimmappa).&rdquo;
            </p>
            <p className="text-[#2D5244] font-semibold text-right text-sm sm:text-base relative z-10">
              — Smt. Late Bharathi &amp; Sri N. Nagaraju
            </p>
          </div>

          <div className="bg-silk-texture p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl animate-fade-in-up border border-[#C9A962]/30 transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A7C59] mb-3 sm:mb-4 relative z-10" />
            <p className="text-[#5C4A3A] text-base sm:text-lg md:text-xl leading-relaxed italic mb-3 sm:mb-4 relative z-10">
              &ldquo;Awaiting your presence and blessings on this sacred union. Your gracious presence
              will add joy to this special occasion as we unite two hearts in the presence of
              Sri Lakshmi Venkateshwara.&rdquo;
            </p>
            <p className="text-[#2D5244] font-semibold text-right text-sm sm:text-base relative z-10">
              — Smt. Bhagya &amp; Sri Thimmappa
            </p>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12 animate-fade-in-up">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif text-[#2D5244] px-4 drop-shadow-sm">
            Marriage will be solemnized on{" "}
            <span className="text-[#4A7C59] font-bold">21st June 2026</span> at Sri Rama Palace,
            Kaiwara
          </p>
        </div>

        <div className="mt-8 sm:mt-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl animate-fade-in-up relative">
          <div className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[90vh] w-full z-0">
            <img
              src={images.story}
              alt="Puneeth & Suma together"
              className="h-full w-full object-cover animate-zoom hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
