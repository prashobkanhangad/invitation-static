const footerImage = "/sanath/img-6.jpeg";

export const FooterSection = () => {
  return (
    <footer className="mt-0">
      <div className="relative w-full overflow-hidden">
        <div className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] w-full">
          <img
            src={footerImage}
            alt="Sanath & Shreya"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-[20s] ease-out hover:scale-110"
          />
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#FFF8DC] to-[#F5E6D3] text-[#654321] border-t-2 border-[#DAA520]/40 shadow-lg">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-6 text-center text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.35em] md:flex-row md:items-center md:justify-between md:text-base">
          <a
            href="https://www.instagram.com/dewdropz_wedding_cinemas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B0000] transition-colors duration-300 hover:text-[#B8860B] font-semibold"
          >
            Dew Dropz Wedding Cinemas{" "}
          </a>
          <a
            href="https://invyto.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B4513] transition-colors duration-300 hover:text-[#B8860B] font-semibold"
          >
            Made by Invyto.in
          </a>
        </div>
      </div>
    </footer>
  );
};
