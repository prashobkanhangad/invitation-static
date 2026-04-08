import { Quote } from "lucide-react";

const floralDivider = "/modern/floral-divider.svg";
const togetherImage = "/modern/together.jpg";

export const StorySection = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-primary text-lg md:text-xl mb-2">Rooted in tradition, woven with destiny.</p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Surya Gayathri & Subrahmanyan</h2>
          <img src={floralDivider} alt="" className="w-16 h-16 mx-auto mt-6 opacity-60" />
        </div>

        <div className="space-y-12">
          <div className="bg-card p-8 md:p-10 rounded-2xl shadow-lg animate-fade-in-up border border-border/50">
            <Quote className="w-8 h-8 text-primary mb-4" />
            <p className="text-foreground/90 text-lg md:text-xl leading-relaxed italic mb-4">
              "Same city. Same Mangalore. Yet strangers… until a blind date at Top House. Me checking his picture, looking up at every boy walking in — and then he arrived. And that day, as we walked through the streets of Mangalore, our story truly began. 💫❤️"
            </p>
            <p className="text-primary font-medium text-right">— Surya Gayathri</p>
          </div>

          <div className="bg-card p-8 md:p-10 rounded-2xl shadow-lg animate-fade-in-up border border-border/50">
            <Quote className="w-8 h-8 text-primary mb-4" />
            <p className="text-foreground/90 text-lg md:text-xl leading-relaxed italic mb-4">
            I remember scanning the place, wondering who she might be… and then I saw her — sitting there, checking her phone, a little nervous but beautifully calm...It felt like the beginning of something I didn’t even know I was waiting for. 💫❤️"
            </p>
            <p className="text-primary font-medium text-right">— Subrahmanyan</p>
          </div>
        </div>

        <div className="text-center mt-12 animate-fade-in-up">
          <p className="text-2xl md:text-3xl font-serif text-foreground">
            Payyannur will ring with our wedding bells on{" "}
            <span className="text-primary font-bold">23.11.2025</span>
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl shadow-2xl animate-fade-in-up">
          <div className="relative h-[60vh] w-full md:h-[75vh] lg:h-[90vh]">
            <img
              src={togetherImage}
              alt="Surya Gayathri & Subrahmanyan together"
              className="h-full w-full object-cover transition-transform duration-[4000ms] ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white">
              <p className="text-sm uppercase tracking-[0.4em] text-white/80">Featuring</p>
              <p className="text-4xl md:text-5xl font-serif font-semibold">Together</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
