const footerImage = "/arun-shilpa/img-20.jpeg";

export const FooterSection = () => {
  return (
    <footer className="mt-0">
      <div className="px-4 sm:px-6 py-8 sm:py-12 md:py-16 bg-fabric-texture relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl animate-fade-in-up relative">
            <div className="absolute inset-0 overlay-warm z-[1] opacity-50"></div>
            <div className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] w-full z-0">
              <img
                src={footerImage}
                alt="Shilpa & Arun"
                className="w-full h-full object-cover object-center transition-transform duration-[4000ms] ease-out hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-silk-texture text-[#6B4423] border-t border-[#B8945F]/40 shadow-lg">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-6 text-center text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.35em] md:flex-row md:items-center md:justify-between md:text-base">
          <a
            href="https://www.instagram.com/vijith_krishna_photography?igsh=NGcxMWthNWJnbWo5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7A0F0F] transition-colors duration-300 hover:text-[#8B1A1A] font-semibold"
          >
            Vijith Krishna Photography{" "}
          </a>
          <a
            href="https://invyto.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7A0F0F] transition-colors duration-300 hover:text-[#8B1A1A] font-semibold"
          >
            Made by Invyto.in
          </a>
        </div>
      </div>
    </footer>
  );
};
