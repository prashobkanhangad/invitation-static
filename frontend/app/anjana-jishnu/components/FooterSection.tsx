import { images } from "./images";

export const FooterSection = () => {
  return (
    <footer className="mt-0">
      <div className="px-4 sm:px-6 py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl animate-fade-in-up">
            <div className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] w-full">
              <img
                src={images.footer}
                alt="Anjana and Jishnu"
                className="w-full h-full object-cover object-center transition-transform duration-[4000ms] ease-out hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white text-[#2C2C2C] border-t-2 border-[#C4A574]/40 shadow-lg">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-6 text-center text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.35em] md:flex-row md:items-center md:justify-between md:text-base">
          <a
            href="https://www.instagram.com/dewdropz_wedding_cinemas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7A2430] transition-colors duration-300 hover:text-[#B8860B] font-semibold"
          >
            Dew Dropz Wedding Cinemas
          </a>
          <a
            href="https://invyto.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7A2430] transition-colors duration-300 hover:text-[#B8860B] font-semibold"
          >
            Made by Invyto.in
          </a>
        </div>
      </div>
    </footer>
  );
};
