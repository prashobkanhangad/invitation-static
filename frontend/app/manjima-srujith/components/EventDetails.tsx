"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { ImageCarousel } from "./ImageCarousel";

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
    const weddingDate = new Date("2026-04-12T11:30:00").getTime();

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
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
          <img src={floralDivider} alt="" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 opacity-60" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#9e1c12] mb-2 sm:mb-4 drop-shadow-sm">
            When & Where
          </h2>
          <p className="text-[#654321] text-base sm:text-lg font-medium">We love to see you soon</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
          <div className="p-6 sm:p-8 md:p-10 text-center space-y-3 sm:space-y-4 shadow-xl border-2 border-[#D4AF37]/40 rounded-2xl sm:rounded-3xl bg-white animate-fade-in-up hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] sm:col-span-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-[#DAA520] to-[#B8860B] rounded-full flex items-center justify-center mb-2 shadow-lg">
              <Calendar className="w-7 h-7 sm:w-8 sm:h-8 md:w-12 md:h-12 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#9e1c12] font-semibold">
              Wedding Ceremony
            </h3>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-3xl sm:text-4xl font-serif text-[#B8860B] font-bold drop-shadow-sm">12</p>
              <p className="text-lg sm:text-xl text-[#9e1c12] font-medium">April 2026</p>
              <p className="text-base sm:text-lg text-[#654321]">Sunday</p>
            </div>
            <div className="pt-3 sm:pt-4 space-y-2 border-t border-[#9e1c12]/30 mt-4 sm:mt-6">
              <div className="flex items-center justify-center gap-2 text-[#654321] text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#9e1c12]" />
                <span className="leading-tight">Onath Convention Hall, Mulleria</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#654321] text-sm sm:text-base">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#9e1c12]" />
                <span>Muhurtham: 11:30 AM - 12:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center animate-fade-in-up">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#9e1c12] mb-4 sm:mb-6 drop-shadow-sm">
            Countdown Begins to Our Special Day!
          </h3>
          <p className="text-[#9e1c12] mb-6 sm:mb-8 text-sm sm:text-base font-medium">
            We are almost there - save the moment with us.
          </p>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4 lg:gap-5">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((item) => (
              <div
                key={item.label}
                className="relative rounded-xl sm:rounded-2xl border-2 border-[#D4AF37]/40 bg-white px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#9e1c12] drop-shadow-md">
                  {String(item.value).padStart(2, "0")}
                </div>
                <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#654321] font-medium">
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
