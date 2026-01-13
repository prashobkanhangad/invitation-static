"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { ImageCarousel } from "./ImageCarousel";

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
    const weddingDate = new Date("2026-01-21T10:00:00").getTime();

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
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#B8945F] to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-[#B8945F]"></div>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#B8945F] to-transparent"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#7A0F0F] mb-2 sm:mb-4 drop-shadow-sm">When & Where</h2>
          <p className="text-[#6B4423] text-base sm:text-lg font-medium">We love to see you soon</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
          <div className="p-6 sm:p-8 md:p-10 text-center space-y-3 sm:space-y-4 shadow-xl border border-[#B8945F]/40 rounded-2xl sm:rounded-3xl bg-silk-texture animate-fade-in-up hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237A0F0F' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h-2zm-2 0v2H0v-2h18zm0 4v2H0v-2h18zm0 4v2H0v-2h18z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-[#7A0F0F] to-[#8B1A1A] rounded-full flex items-center justify-center mb-2 shadow-lg relative z-10">
              <Calendar className="w-7 h-7 sm:w-8 sm:h-8 md:w-12 md:h-12 text-[#FFF8DC]" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A0F0F] font-semibold relative z-10">Marriage Ceremony</h3>
            <div className="space-y-1 sm:space-y-2 relative z-10">
              <p className="text-3xl sm:text-4xl font-serif text-[#B87333] font-bold drop-shadow-sm">21</p>
              <p className="text-lg sm:text-xl text-[#7A0F0F] font-medium">January 2026</p>
              <p className="text-base sm:text-lg text-[#6B4423]">Wednesday</p>
            </div>
            <div className="pt-3 sm:pt-4 space-y-2 border-t border-[#7A0F0F]/30 mt-4 sm:mt-6 relative z-10">
              <div className="flex items-center justify-center gap-2 text-[#6B4423] text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#7A0F0F]" />
                <span className="leading-tight">Staydium Bungalow Resort, Bilathikulam Rd, West Nadakkave, Vandipetta, Bilathikkulam, Kozhikode, Kerala</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#6B4423] text-sm sm:text-base">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#7A0F0F]" />
                <span>Time: 10:00 AM</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10 text-center space-y-3 sm:space-y-4 shadow-xl border border-[#B8945F]/40 rounded-2xl sm:rounded-3xl bg-silk-texture animate-fade-in-up hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237A0F0F' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h-2zm-2 0v2H0v-2h18zm0 4v2H0v-2h18zm0 4v2H0v-2h18z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-[#7A0F0F] to-[#8B1A1A] rounded-full flex items-center justify-center mb-2 shadow-lg relative z-10">
              <Calendar className="w-7 h-7 sm:w-8 sm:h-8 md:w-12 md:h-12 text-[#FFF8DC]" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A0F0F] font-semibold relative z-10">Wedding Reception</h3>
            <div className="space-y-1 sm:space-y-2 relative z-10">
              <p className="text-3xl sm:text-4xl font-serif text-[#B87333] font-bold drop-shadow-sm">25</p>
              <p className="text-lg sm:text-xl text-[#7A0F0F] font-medium">January 2026</p>
              <p className="text-base sm:text-lg text-[#6B4423]">Sunday</p>
            </div>
            <div className="pt-3 sm:pt-4 space-y-2 border-t border-[#7A0F0F]/30 mt-4 sm:mt-6 relative z-10">
              <div className="flex items-center justify-center gap-2 text-[#6B4423] text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#7A0F0F]" />
                <span className="leading-tight">Bekal Club & Resort, Kanhangad, Kasaragod</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#6B4423] text-sm sm:text-base">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#7A0F0F]" />
                <span>Time: 11:30 AM – 3:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center animate-fade-in-up">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#7A0F0F] mb-4 sm:mb-6 drop-shadow-sm">Countdown Begins to Our Special Day!</h3>
          <p className="text-[#8B1A1A] mb-6 sm:mb-8 text-sm sm:text-base font-medium">We're almost there—save the moment with us.</p>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4 lg:gap-5">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((item, index) => (
              <div
                key={item.label}
                className="relative rounded-xl sm:rounded-2xl border border-[#B8945F]/40 bg-silk-texture px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#7A0F0F] drop-shadow-md">
                  {String(item.value).padStart(2, "0")}
                </div>
                <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#6B4423] font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image Carousel */}
        <ImageCarousel />
      </div>
    </section>
  );
};
