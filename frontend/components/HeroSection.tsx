"use client";

import Image from "next/image";
import { openWhatsApp } from "@/utils/whatsapp";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 bg-gradient-to-br from-[#F5F5F0] via-white to-[#F5F5F0] overflow-hidden">
      {/* Animated celebration elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Confetti pieces - distributed top to bottom */}
        <div className="absolute top-[10%] left-[10%] w-4 h-4 bg-pink-400 rounded-sm animate-float-slow opacity-60"></div>
        <div className="absolute top-[25%] left-[80%] w-3 h-5 bg-[#333333] rounded-sm animate-float-medium opacity-50 rotate-45"></div>
        <div className="absolute top-[45%] left-[25%] w-3 h-4 bg-yellow-400 rounded-sm animate-float-fast opacity-60 -rotate-12"></div>
        <div className="absolute bottom-[35%] left-[60%] w-4 h-3 bg-blue-400 rounded-sm animate-float-slow opacity-50 rotate-90"></div>
        <div className="absolute bottom-[15%] left-[15%] w-3 h-4 bg-green-400 rounded-sm animate-float-medium opacity-60 rotate-180"></div>
        
        {/* Hearts - spread across screen */}
        <div className="absolute top-[35%] left-[70%] text-pink-400 text-2xl animate-float-slow opacity-40">♥</div>
        <div className="absolute top-[15%] left-[45%] text-red-400 text-xl animate-float-fast opacity-30">♥</div>
        <div className="absolute bottom-[20%] left-[90%] text-pink-300 text-3xl animate-float-medium opacity-40">♥</div>
        
        {/* Sparkles - distributed vertically */}
        <div className="absolute top-[20%] left-[35%] text-yellow-400 text-xl animate-pulse opacity-60">✨</div>
        <div className="absolute top-[55%] left-[85%] text-yellow-300 text-2xl animate-pulse opacity-50">✨</div>
        <div className="absolute bottom-[10%] left-[20%] text-yellow-400 text-lg animate-pulse opacity-70">✨</div>
        
        {/* Stars - full screen coverage */}
        <div className="absolute top-[30%] left-[50%] text-[#333333] text-xl animate-spin-slow opacity-50">★</div>
        <div className="absolute bottom-[25%] left-[30%] text-blue-400 text-2xl animate-spin-slow opacity-40">★</div>
        <div className="absolute top-[8%] left-[65%] text-pink-400 text-lg animate-spin-slow opacity-60">★</div>
        
        {/* Dots - evenly distributed */}
        <div className="absolute top-[18%] left-[75%] w-2 h-2 bg-[#333333] rounded-full animate-float-fast opacity-70"></div>
        <div className="absolute top-[60%] left-[40%] w-3 h-3 bg-pink-300 rounded-full animate-float-slow opacity-60"></div>
        <div className="absolute bottom-[30%] left-[95%] w-2 h-2 bg-yellow-300 rounded-full animate-float-medium opacity-80"></div>
        <div className="absolute bottom-[8%] left-[55%] w-2 h-2 bg-blue-300 rounded-full animate-float-fast opacity-70"></div>
        <div className="absolute top-[50%] left-[5%] w-3 h-3 bg-green-300 rounded-full animate-float-medium opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Craft unforgettable moments with stunning digital invitations.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Design and send personalized invitations for weddings, birthdays, and corporate events in minutes. 
              Effortless, elegant, and eco-friendly.
            </p>
            <button
              onClick={() => openWhatsApp("Hi! I want to get started with invitations.")}
              className="bg-[#333333] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#555555] transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#333333] to-[#555555] rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative grid grid-cols-2 gap-4">
              {/* Image column 1 */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-xl p-2 transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="relative h-48 lg:h-auto lg:pb-[100%] w-full overflow-hidden rounded-md">
                    <Image
                      src="/demo/329622924_102507426080828_7061139934666021224_n.jpg"
                      alt="Invitation preview 1"
                      fill
                      sizes="(max-width: 1024px) 50vw, 400px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-xl p-2 transform -rotate-2 hover:rotate-0 transition-transform">
                  <div className="relative h-48 lg:h-auto lg:pb-[100%] w-full overflow-hidden rounded-md">
                    <Image
                      src="/demo/Screenshot 2025-10-06 at 9.30.46 PM.png"
                      alt="Invitation preview 2"
                      fill
                      sizes="(max-width: 1024px) 50vw, 400px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Image column 2 */}
              <div className="space-y-4 mt-8">
                <div className="bg-white rounded-lg shadow-xl p-2 transform -rotate-3 hover:rotate-0 transition-transform">
                  <div className="relative h-48 lg:h-auto lg:pb-[100%] w-full overflow-hidden rounded-md">
                    <Image
                      src="/demo/82a4c6c83c2241892d5f40c17831b1571675789564626396_original.avif"
                      alt="Invitation preview 3"
                      fill
                      sizes="(max-width: 1024px) 50vw, 400px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-xl p-2 transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="relative h-48 lg:h-auto lg:pb-[100%] w-full overflow-hidden rounded-md">
                    <Image
                      src="/demo/Screenshot 2025-10-06 at 9.32.48 PM.png"
                      alt="Invitation preview 4"
                      fill
                      sizes="(max-width: 1024px) 50vw, 400px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
