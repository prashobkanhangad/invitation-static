import { images } from "./images";

export const FullWidthPhotos = () => {
  const slides = [
    { src: images.desktop[1], label: "Jishnu" },
    { src: images.hero, label: "Anjana", classes: "object-[50%_28%]" },
  ];

  return (
    <section className="space-y-0 text-white">
      {slides.map((item, index) => (
        <div
          key={item.label}
          className="relative h-[55vh] sm:h-[60vh] md:h-[75vh] lg:h-[90vh] w-full overflow-hidden animate-fade-in"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <img
            src={item.src}
            alt={item.label}
            className={`h-full w-full object-cover transition-transform duration-[4000ms] ease-out hover:scale-105 ${
              item.classes ?? ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#7A2430]/70 via-[#9B3A48]/30 to-[#C4A574]/10" />
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-center text-white px-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/80 mb-1">
              Featuring
            </p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold drop-shadow-lg">
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};
