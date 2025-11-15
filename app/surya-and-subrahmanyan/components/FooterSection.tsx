const footerImage = "/modern/WhatsApp Image 2025-11-15 at 22.34.16.jpeg";

export const FooterSection = () => {
  return (
    <footer className="mt-16">
      <div className="relative w-full overflow-hidden">
        <img src={footerImage} alt="Surya & Subrahmanyan" className="h-[320px] w-full object-cover md:h-[480px]" />
      </div>
      <div className="bg-[#f9f4ef] text-[#4a3a2c] border-t border-[#b58c6b]/30">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-center text-sm uppercase tracking-[0.35em] md:flex-row md:items-center md:justify-between md:text-base">
          <a
            href="https://www.instagram.com/vijith_krishna_photography?igsh=NGcxMWthNWJnbWo5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#b47846] transition hover:text-[#8f5e32]"
          >
            Vijith Krishna Photography
          </a>
          <a
            href="https://invyto.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#b58c6b] transition hover:text-[#8f5e32]"
          >
            Made by InvYto.in
          </a>
        </div>
      </div>
    </footer>
  );
};
