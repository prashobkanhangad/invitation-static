const groomImage = "/modern/groom-portrait.jpg";
const brideImage = "/modern/bride-portrait.jpg";

export const FullWidthPhotos = () => {
  const slides = [
    { src: groomImage, label: "Subrahmanyan" },
    { src: brideImage, label: "Surya", classes: "object-[50%_32%]" },
  ];

  return (
    <section className="space-y-0 text-white">
      {slides.map((item, index) => (
        <div
          key={item.label}
          className="relative h-[60vh] w-full overflow-hidden rounded-none animate-fade-in md:h-[75vh] lg:h-[90vh]"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <img
            src={item.src}
            alt={item.label}
            className={`h-full w-full object-cover transition-transform duration-[4000ms] ease-out hover:scale-105 ${
              item.classes ?? ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/0" />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white">
            <p className="text-sm uppercase tracking-[0.4em] text-white/80">Featuring</p>
            <p className="text-4xl md:text-5xl font-serif font-semibold">{item.label}</p>
          </div>
        </div>
      ))}
    </section>
  );
};
