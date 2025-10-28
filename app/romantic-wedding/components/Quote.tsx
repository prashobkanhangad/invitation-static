import Image from "next/image";

export default function Quote() {
  return (
    <section className="relative py-32 px-4">
      <div className="absolute inset-0">
        <Image
          src="/romanticpage/quote-bg.jpg"
          alt="Quote background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#333333]/80 to-[#555555]/80" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <svg
          className="w-16 h-16 mx-auto mb-8 text-white opacity-40"
          fill="currentColor"
          viewBox="0 0 32 32"
        >
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
        
        <blockquote className="text-2xl md:text-4xl font-serif font-medium text-white leading-relaxed mb-8">
          Love is not about how many days, months, or years you have been together.
          Love is about how much you love each other every single day.
        </blockquote>
        
        <p className="text-white/80 font-sans text-lg">
          — Unknown
        </p>
      </div>
    </section>
  );
}

