import { Quote } from "lucide-react";

const floralDivider = "/modern/floral-divider.svg";
const togetherImage = "/sanath/img-14.jpeg";

export const StorySection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#FFF8DC] via-[#F5E6D3] to-[#F5DEB3]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <p className="text-[#8B0000] text-base sm:text-lg md:text-xl mb-2 font-medium">Rooted in tradition, woven with destiny.</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#8B0000] mb-3 sm:mb-4 drop-shadow-sm">Sanath & Shreya</h2>
          <img src={floralDivider} alt="" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mt-4 sm:mt-6 opacity-60" />
        </div>

        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          <div className="bg-gradient-to-br from-[#FFF8DC] to-[#F5E6D3] p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl animate-fade-in-up border-2 border-[#DAA520]/30 transition-all duration-300 hover:scale-[1.01]">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#8B0000] mb-3 sm:mb-4" />
            <p className="text-[#654321] text-base sm:text-lg md:text-xl leading-relaxed italic mb-3 sm:mb-4">
              "Our journey together is a beautiful story of love, tradition, and family blessings. We are grateful for this moment and excited to begin our new chapter together. 💫❤️"
            </p>
            <p className="text-[#8B0000] font-semibold text-right text-sm sm:text-base">— Shreya</p>
          </div>

          <div className="bg-gradient-to-br from-[#FFF8DC] to-[#F5E6D3] p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl animate-fade-in-up border-2 border-[#DAA520]/30 transition-all duration-300 hover:scale-[1.01]">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#8B0000] mb-3 sm:mb-4" />
            <p className="text-[#654321] text-base sm:text-lg md:text-xl leading-relaxed italic mb-3 sm:mb-4">
              "With the blessings of our families and the grace of tradition, we come together to celebrate this sacred union. This is the beginning of our beautiful journey. 💫❤️"
            </p>
            <p className="text-[#8B0000] font-semibold text-right text-sm sm:text-base">— Sanath</p>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12 animate-fade-in-up">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif text-[#8B0000] px-4 drop-shadow-sm">
            Thaliparamba will ring with our wedding bells on{" "}
            <span className="text-[#B8860B] font-bold">13.12.2025</span>
          </p>
        </div>

        <div className="mt-8 sm:mt-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl animate-fade-in-up">
          <div className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[90vh] w-full">
            <img
              src={togetherImage}
              alt="Sanath & Shreya together"
              className="h-full w-full object-cover transition-transform duration-[4000ms] ease-out hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
