import { Quote } from "lucide-react";

const floralDivider = "/modern/floral-divider.svg";
const togetherImage = "/arun-shilpa/img-11.jpeg";

export const StorySection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-fabric-texture relative">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237A0F0F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <p className="text-[#8B1A1A] text-base sm:text-lg md:text-xl mb-2 font-medium">Rooted in tradition, woven with destiny.</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#7A0F0F] mb-3 sm:mb-4 drop-shadow-sm">Shilpa & Arun</h2>
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#B8945F] to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-[#B8945F]"></div>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#B8945F] to-transparent"></div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          <div className="bg-silk-texture p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl animate-fade-in-up border border-[#B8945F]/30 transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237A0F0F' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h-2zm-2 0v2H0v-2h18zm0 4v2H0v-2h18zm0 4v2H0v-2h18z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#8B1A1A] mb-3 sm:mb-4 relative z-10" />
            <p className="text-[#6B4423] text-base sm:text-lg md:text-xl leading-relaxed italic mb-3 sm:mb-4 relative z-10">
              "With immense joy and divine grace, we cordially request your esteemed presence with family on the auspicious occasion of the wedding reception of our daughter. Our journey together is a beautiful story of love, tradition, and family blessings. 💫❤️"
            </p>
            <p className="text-[#7A0F0F] font-semibold text-right text-sm sm:text-base relative z-10">— Shilpa</p>
          </div>

          <div className="bg-silk-texture p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl animate-fade-in-up border border-[#B8945F]/30 transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237A0F0F' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h-2zm-2 0v2H0v-2h18zm0 4v2H0v-2h18zm0 4v2H0v-2h18z'/%3E%3C/svg%3E")`
            }}></div>
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#8B1A1A] mb-3 sm:mb-4 relative z-10" />
            <p className="text-[#6B4423] text-base sm:text-lg md:text-xl leading-relaxed italic mb-3 sm:mb-4 relative z-10">
              "With the blessings of our families and the grace of tradition, we come together to celebrate this sacred union. Your gracious presence and blessings will add joy to this special occasion as we unite the two hearts. 💫❤️"
            </p>
            <p className="text-[#7A0F0F] font-semibold text-right text-sm sm:text-base relative z-10">— Arun</p>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12 animate-fade-in-up">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A0F0F] px-4 drop-shadow-sm">
            Marriage will be solemnized on{" "}
            <span className="text-[#B87333] font-bold">21st January 2026</span>
            {" "}at Staydium Bungalow Resort, Kozhikode
          </p>
        </div>

        <div className="mt-8 sm:mt-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl animate-fade-in-up relative">
          {/* <div className="absolute inset-0 overlay-warm z-[1] opacity-60"></div> */}
          <div className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[90vh] w-full z-0">
            <img
              src={togetherImage}
              alt="Shilpa & Arun together"
              className="h-full w-full object-cover animate-zoom hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
