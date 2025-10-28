import Image from "next/image";

export default function Gallery() {
  const images = [
    { src: "/romanticpage/gallery-1.jpg", alt: "Couple laughing together" },
    { src: "/romanticpage/gallery-2.jpg", alt: "Wedding rings close-up" },
    { src: "/romanticpage/gallery-3.jpg", alt: "Elegant floral arrangement" },
    { src: "/romanticpage/hero-couple.jpg", alt: "Beautiful couple portrait" },
    { src: "/romanticpage/gallery-1.jpg", alt: "Romantic moment together" },
    { src: "/romanticpage/gallery-2.jpg", alt: "Save the date moment" },
  ];

  return (
    <section className="py-20 px-4 bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Our Story in Pictures
          </h2>
          <p className="text-gray-600 font-sans text-lg max-w-2xl mx-auto">
            A glimpse into our beautiful journey together
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 aspect-square"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

