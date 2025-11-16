import { Quote } from "lucide-react";

const floralDivider = "/modern/floral-divider.svg";
const togetherImage = "/modern/together.jpg";

export const StorySection = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-primary text-lg md:text-xl mb-2">Rooted in tradition, woven with destiny.</p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Surya & Subrahmanyan</h2>
          <img src={floralDivider} alt="" className="w-16 h-16 mx-auto mt-6 opacity-60" />
        </div>

        <div className="space-y-12">
          <div className="bg-card p-8 md:p-10 rounded-2xl shadow-lg animate-fade-in-up border border-border/50">
            <Quote className="w-8 h-8 text-primary mb-4" />
            <p className="text-foreground/90 text-lg md:text-xl leading-relaxed italic mb-4">
              "From temple courtyards to long conversations, our story felt calm and inevitable. What began as blessings from our
              elders soon became a promise we both wanted to keep forever."
            </p>
            <p className="text-primary font-medium text-right">— Surya Gayathri</p>
          </div>

          <div className="bg-card p-8 md:p-10 rounded-2xl shadow-lg animate-fade-in-up border border-border/50">
            <Quote className="w-8 h-8 text-primary mb-4" />
            <p className="text-foreground/90 text-lg md:text-xl leading-relaxed italic mb-4">
              "Every conversation with Surya Gayathrifelt like returning home. With each family ritual and every shared dream, I knew
              Payyannur would soon witness a union blessed by all those who came before us."
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
              alt="Surya & Subrahmanyan together"
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
