import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import {
  HeroSection,
  StorySection,
  PhotoGallery,
  EventDetails,
  QASection,
  MapSection,
  InvitationSection,
  FooterSection,
}  from "./components";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.invyto.in"),
  title: "Shilpa & Arun | Invyto Wedding Invitation",
  description:
    "Celebrate the sacred union of Shilpa and Arun. Explore family details, schedule, and invitation.",
  keywords: [
    "Shilpa and Arun wedding",
    "modern wedding invite",
    "digital wedding invitation",
    "Kozhikode wedding",
    "Kasaragod wedding",
  ],
  authors: [{ name: "Shilpa & Arun" }],
  creator: "Invyto",
  publisher: "Invyto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.invyto.in/arun-shilpa",
  },
      openGraph: {
        title: "Shilpa & Arun | Invyto Wedding Invitation",
        description: "Join us in celebrating a heartfelt union filled with tradition, memories, and love.",
        url: "https://www.invyto.in/arun-shilpa",
        siteName: "Invyto",
        images: [
          {
            url: "https://www.invyto.in/arun-shilpa/og.jpg",
            width: 1200,
            height: 630,
            alt: "Shilpa & Arun Wedding Portrait",
            type: "image/jpeg",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Shilpa & Arun | Invyto Wedding Invitation",
        description: "Save the dates and celebrate with Shilpa and Arun.",
        images: ["https://www.invyto.in/arun-shilpa/og.jpg"],
        creator: "@invyto",
      },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "wedding",
};

export default function ModernWeddingPage() {
  return (
    <>
      {/* Mobile View - Full Page */}
      <div className="min-h-screen bg-[#FDF6E3] md:hidden relative">
        <HeroSection />
        <StorySection />
        <PhotoGallery />
        <EventDetails />
        <QASection />
        <MapSection />
        <InvitationSection />
        <FooterSection />
      </div>

      {/* Web View - Three Images Side by Side */}
      <div className="hidden md:flex fixed inset-0 w-screen h-screen overflow-hidden">
        <div className="absolute inset-0 overlay-vintage z-[1]"></div>
        <div className="relative w-full h-full flex z-0">
          <div className="w-1/3 h-full">
            <img
              src="/arun-shilpa/img-18.jpeg"
              alt="Shilpa & Arun"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/3 h-full">
            <img
              src="/arun-shilpa/img-17.jpeg"
              alt="Shilpa & Arun"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/3 h-full">
            <img
              src="/arun-shilpa/img-19.jpeg"
              alt="Shilpa & Arun"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Overlay with text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none z-10">
          <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8 px-6 sm:px-8 py-8 sm:py-10 bg-[#7A0F0F]/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-[#B8945F]/30">
            <p className="text-[#FFF8DC] text-lg sm:text-xl md:text-2xl font-serif italic tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-semibold">
              "Two souls, one heart, forever united"
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#FFF8DC]/60 to-transparent"></div>
              <p className="text-[#FFF8DC] text-sm sm:text-base md:text-lg font-medium uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                With the blessings of our families
              </p>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#FFF8DC]/60 to-transparent"></div>
            </div>
            <p className="text-[#FFF8DC] text-base sm:text-lg md:text-xl font-serif mb-6 sm:mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium">
              We invite you to witness and celebrate our sacred union
            </p>
            
            <div className="space-y-3 sm:space-y-4">
              <p className="text-[#FFF8DC] text-base sm:text-lg md:text-xl font-light tracking-[0.2em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Namaskaram
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#FFF8DC] font-bold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                Shilpa & Arun
              </h1>
            </div>

            <div className="mt-8 sm:mt-10">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Staydium+Bungalow+Resort+Bilathikulam+Rd+West+Nadakkave+Vandipetta+Bilathikkulam+Kozhikode+Kerala"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7A0F0F] via-[#A01D2E] to-[#7A0F0F] backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-[#FFF8DC] shadow-2xl transition-all duration-300 hover:from-[#A01D2E] hover:via-[#C41E3A] hover:to-[#A01D2E] hover:scale-105 hover:shadow-3xl border border-[#B8945F]/40 pointer-events-auto"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Go to venue</span>
              </a>
            </div>

            <div className="mt-8">
              <p className="text-lg md:text-xl text-[#FFF8DC] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Please use mobile browser for better experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
