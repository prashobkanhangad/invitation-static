import { Heart } from "lucide-react";

const floralDivider = "/modern/floral-divider.svg";

export const InvitationSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
        <img src={floralDivider} alt="" className="w-20 h-20 mx-auto mb-8 opacity-70" />

        <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8">
          Join Us in Celebrating Our Special Occasion
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          We warmly invite you to join us in celebrating our special day. Your presence and blessings will make the day even more memorable.
        </p>

        <div className="mt-12 flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
          <p className="text-2xl md:text-3xl font-serif text-primary">Surya & Subrahmanyan</p>
          <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
        </div>

        <p className="mt-8 text-muted-foreground text-sm md:text-base">
          Thank you for celebrating with us! We hope you enjoyed every moment as much as we did 🫶
        </p>
      </div>
    </section>
  );
};
