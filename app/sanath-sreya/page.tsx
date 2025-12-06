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
  title: "Sanath & Shreya | Invyto Wedding Invitation",
  description:
    "Celebrate the sacred union of Sanath and Shreya. Explore family details, schedule, and invitation.",
  keywords: [
    "Sanath and Shreya wedding",
    "modern wedding invite",
    "digital wedding invitation",
    "Thaliparamba wedding",
  ],
  authors: [{ name: "Sanath & Shreya" }],
  creator: "Invyto",
  publisher: "Invyto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.invyto.in/sanath-sreya",
  },
      openGraph: {
        title: "Sanath & Shreya | Invyto Wedding Invitation",
        description: "Join us in celebrating a heartfelt union in Thaliparamba filled with tradition, memories, and love.",
        url: "https://www.invyto.in/sanath-sreya",
        siteName: "Invyto",
        images: [
          {
            url: "https://www.invyto.in/sanath/og.jpg",
            width: 1200,
            height: 630,
            alt: "Sanath & Shreya Wedding Portrait",
            type: "image/jpeg",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Sanath & Shreya | Invyto Wedding Invitation",
        description: "Save the dates and celebrate with Sanath and Shreya.",
        images: ["https://www.invyto.in/sanath/og.jpg"],
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
      <div className="min-h-screen bg-background md:hidden">
        <HeroSection />
        <StorySection />
        <PhotoGallery />
        <EventDetails />
        <QASection />
        <MapSection />
        <InvitationSection />
        <FooterSection />
      </div>

      {/* Web View - Single Full Screen with Image */}
      <div className="hidden md:flex fixed inset-0 w-screen h-screen overflow-hidden">
        <div className="relative w-full h-full">
          <img
            src="/sanath/img-15.jpeg"
            alt="Sanath & Shreya"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Overlay with text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none">
          <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8">
            <p className="text-white text-lg sm:text-xl md:text-2xl font-serif italic tracking-wide drop-shadow-lg font-semibold">
              "Two souls, one heart, forever united"
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              <p className="text-white text-sm sm:text-base md:text-lg font-medium uppercase tracking-[0.3em] drop-shadow-lg">
                With the blessings of our families
              </p>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <p className="text-white text-base sm:text-lg md:text-xl font-serif mb-6 sm:mb-8 drop-shadow-lg font-medium">
              We invite you to witness and celebrate our sacred union
            </p>
            
            <div className="space-y-3 sm:space-y-4">
              <p className="text-white text-base sm:text-lg md:text-xl font-light tracking-[0.2em] uppercase drop-shadow-lg">
                Namaskaram
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-white font-bold leading-tight drop-shadow-2xl">
                I'm Sanath
              </h1>
            </div>

            <div className="mt-8 sm:mt-10">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Dream+Palace+Auditorium+Thaliparamba+Kannur"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-2xl transition-all duration-300 hover:from-[#DAA520] hover:via-[#FFD700] hover:to-[#DAA520] hover:scale-105 hover:shadow-3xl border border-[#FFD700]/30 pointer-events-auto"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Go to venue</span>
              </a>
            </div>

            <div className="mt-8">
              <p className="text-lg md:text-xl text-white font-medium drop-shadow-lg">
                Please use mobile browser for better experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
