const groomImage = "/sanath/img-2.jpeg";
const brideImage = "/sanath/img-3.jpeg";

export const FullWidthPhotos = () => {
  const slides = [
    { src: groomImage, label: "Sanath" },
    { src: brideImage, label: "Shreya", classes: "object-[50%_32%]" },
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#8B0000]/70 via-[#B8860B]/30 to-[#CD853F]/10" />
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-center text-white px-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/80 mb-1">Featuring</p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold drop-shadow-lg">{item.label}</p>
          </div>
        </div>
      ))}
    </section>
  );
};
