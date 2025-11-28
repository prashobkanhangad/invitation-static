"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";

const floralDivider = "/modern/floral-divider.svg";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const defaultTime: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export const EventDetails = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(defaultTime);

  useEffect(() => {
    const weddingDate = new Date("2025-11-30T10:50:00").getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = weddingDate - now;

      if (difference <= 0) {
        setTimeLeft(defaultTime);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <img src={floralDivider} alt="" className="w-16 h-16 mx-auto mb-6 opacity-60" />
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">When & Where</h2>
          <p className="text-muted-foreground text-lg">We love to see you soon</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 md:p-10 text-center space-y-4 shadow-lg border border-primary/20 rounded-3xl bg-card animate-fade-in-up">
            <Calendar className="w-12 h-12 mx-auto text-primary" />
            <h3 className="text-2xl md:text-3xl font-serif text-foreground">Wedding Ceremony</h3>
            <div className="space-y-2">
              <p className="text-4xl font-serif text-primary font-bold">30</p>
              <p className="text-xl text-muted-foreground">November 2025</p>
              <p className="text-lg text-muted-foreground">Sunday</p>
            </div>
            <div className="pt-4 space-y-2 border-t border-border mt-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>Sumangali Auditorium, Periya</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span>Between 10:50 AM &amp; 11:50 AM</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 text-center space-y-4 shadow-lg border border-primary/20 rounded-3xl bg-card animate-fade-in-up">
            <Calendar className="w-12 h-12 mx-auto text-primary" />
            <h3 className="text-2xl md:text-3xl font-serif text-foreground">Sacred Details</h3>
            <div className="space-y-2 text-muted-foreground">
              <p className="text-lg">Malayalam Date</p>
              <p className="text-2xl font-serif text-primary">14th Vrischikam 1201</p>
            </div>
            <div className="pt-4 space-y-3 border-t border-border mt-6 text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Muhurtham: 10:50 AM – 11:50 AM</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm uppercase tracking-wide">Exact Muhurtham:</span>
                <span className="font-medium text-foreground">11:27 AM</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm uppercase tracking-wide">Lagnam:</span>
                <span className="font-medium text-foreground">Mithuna Lagnam</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center animate-fade-in-up">
          <h3 className="text-3xl md:text-4xl font-serif text-[#b47846] mb-6">Countdown Begins to Our Special Day!</h3>
          <p className="text-[#b58c6b] mb-8">We’re almost there—save the moment with us.</p>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((item, index) => (
              <div
                key={item.label}
                className="relative rounded-2xl border border-[#b58c6b]/30 bg-[#f9f4ef]/80 px-3 py-4 text-center shadow-[0_15px_45px_rgba(180,140,107,0.25)] backdrop-blur-sm md:px-5 md:py-6"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl md:text-5xl font-serif font-bold text-[#b47846] drop-shadow-sm">
                  {String(item.value).padStart(2, "0")}
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.4em] text-muted-foreground md:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
