import Image from "next/image";

const MAGMA_LOGO = "/srideep_shobana/magma-logo.png";

export function AlbumPartnerLogo() {
  return (
    <section
      className="relative py-0 px-3 sm:px-4 md:px-5 lg:px-6 bg-[#ebe4d8] border-t border-[#d4c4b0]/60"
      aria-label="Magma"
    >
      <div className="max-w-6xl mx-auto flex justify-center">
        <div className="relative w-full max-w-[min(96vw,880px)] h-40 sm:h-52 md:h-64 lg:h-80 overflow-hidden">
          <Image
            src={MAGMA_LOGO}
            alt="Magma — wedding company"
            fill
            sizes="(max-width: 768px) 96vw, 880px"
            className="object-contain object-center [clip-path:inset(28%_0_28%_0)]"
          />
        </div>
      </div>
    </section>
  );
}
