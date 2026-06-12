"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { ImageCarousel } from "./ImageCarousel";
import { venueMapLink } from "./images";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const defaultTime: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export const EventDetails = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(defaultTime);

  useEffect(() => {
    const weddingDate = new Date("2026-06-21T09:00:00").getTime();

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
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-fabric-texture relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A962] to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#C9A962]" />
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A962] to-transparent" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2D5244] mb-2 sm:mb-4 drop-shadow-sm">
            When &amp; Where
          </h2>
          <p className="text-[#5C4A3A] text-base sm:text-lg font-medium">We love to see you soon</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
          <div className="p-6 sm:p-8 md:p-10 text-center space-y-3 sm:space-y-4 shadow-xl border border-[#C9A962]/40 rounded-2xl sm:rounded-3xl bg-silk-texture animate-fade-in-up hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-[#4A7C59] to-[#1F3D34] rounded-full flex items-center justify-center mb-2 shadow-lg relative z-10">
              <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFF8DC]" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#2D5244] font-semibold relative z-10">
              Marriage Ceremony
            </h3>
            <div className="space-y-1 sm:space-y-2 relative z-10">
              <p className="text-3xl sm:text-4xl font-serif text-[#4A7C59] font-bold drop-shadow-sm">21</p>
              <p className="text-lg sm:text-xl text-[#2D5244] font-medium">June 2026</p>
              <p className="text-base sm:text-lg text-[#5C4A3A]">Sunday</p>
            </div>
            <div className="pt-3 sm:pt-4 space-y-2 border-t border-[#2D5244]/30 mt-4 sm:mt-6 relative z-10">
              <div className="flex items-center justify-center gap-2 text-[#5C4A3A] text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#2D5244]" />
                <span className="leading-tight">
                  Sri Rama Palace, Mastenahalli Road, Kaiwara, Chintamani Taluk
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#5C4A3A] text-sm sm:text-base">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#2D5244]" />
                <span>Muhurtham: 9:00 AM – 9:44 AM</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10 text-center space-y-3 sm:space-y-4 shadow-xl border border-[#C9A962]/40 rounded-2xl sm:rounded-3xl bg-silk-texture animate-fade-in-up hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-[#2D5244] to-[#3D6B58] rounded-full flex items-center justify-center mb-2 shadow-lg relative z-10">
              <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFF8DC]" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#2D5244] font-semibold relative z-10">
              Reception
            </h3>
            <div className="space-y-1 sm:space-y-2 relative z-10">
              <p className="text-3xl sm:text-4xl font-serif text-[#4A7C59] font-bold drop-shadow-sm">20</p>
              <p className="text-lg sm:text-xl text-[#2D5244] font-medium">June 2026</p>
              <p className="text-base sm:text-lg text-[#5C4A3A]">Saturday</p>
            </div>
            <div className="pt-3 sm:pt-4 space-y-2 border-t border-[#2D5244]/30 mt-4 sm:mt-6 relative z-10">
              <div className="flex items-center justify-center gap-2 text-[#5C4A3A] text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#2D5244]" />
                <span className="leading-tight">
                  Sri Rama Palace, Mastenahalli Road, Kaiwara, Chintamani Taluk
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#5C4A3A] text-sm sm:text-base">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#2D5244]" />
                <span>7:00 PM Onwards</span>
              </div>
              <div className="pt-2">
                <a
                  href={venueMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D5244] via-[#3D6B58] to-[#2D5244] px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#FFF8DC] shadow-lg hover:shadow-xl transition-all duration-300 hover:from-[#3D6B58] hover:via-[#4F8269] hover:to-[#3D6B58] hover:scale-105 border border-[#C9A962]/40"
                >
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10 text-center space-y-3 sm:space-y-4 shadow-xl border border-[#C9A962]/40 rounded-2xl sm:rounded-3xl bg-silk-texture animate-fade-in-up hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-[#C9A962] to-[#A68B4B] rounded-full flex items-center justify-center mb-2 shadow-lg relative z-10">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFF8DC]" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#2D5244] font-semibold relative z-10">
              Lagna
            </h3>
            <div className="space-y-1 sm:space-y-2 relative z-10">
              <p className="text-3xl sm:text-4xl font-serif text-[#4A7C59] font-bold drop-shadow-sm">Kataka</p>
              <p className="text-base sm:text-lg text-[#5C4A3A]">Auspicious star alignment</p>
            </div>
          </div>
        </div>

        <div className="text-center animate-fade-in-up">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#2D5244] mb-4 sm:mb-6 drop-shadow-sm">
            Countdown Begins to Our Special Day!
          </h3>
          <p className="text-[#3D6B58] mb-6 sm:mb-8 text-sm sm:text-base font-medium">
            We&apos;re almost there—save the moment with us.
          </p>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4 lg:gap-5">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((item, index) => (
              <div
                key={item.label}
                className="relative rounded-xl sm:rounded-2xl border border-[#C9A962]/40 bg-silk-texture px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#2D5244] drop-shadow-md">
                  {String(item.value).padStart(2, "0")}
                </div>
                <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#5C4A3A] font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <ImageCarousel />
      </div>
    </section>
  );
};
