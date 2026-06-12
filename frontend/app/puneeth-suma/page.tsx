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
} from "./components";
import { images, venueMapLink } from "./components/images";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.invyto.in"),
  title: "Puneeth & Suma | Invyto Wedding Invitation",
  description:
    "Celebrate the sacred union of Puneeth and Suma. Explore family details, schedule, and invitation.",
  keywords: [
    "Puneeth and Suma wedding",
    "digital wedding invitation",
    "Kaiwara wedding",
    "Chintamani wedding",
    "Karnataka wedding",
  ],
  authors: [{ name: "Puneeth & Suma" }],
  creator: "Invyto",
  publisher: "Invyto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.invyto.in/puneeth-suma",
  },
  openGraph: {
    title: "Puneeth & Suma | Invyto Wedding Invitation",
    description:
      "Join us in celebrating a heartfelt union filled with tradition, memories, and love.",
    url: "https://www.invyto.in/puneeth-suma",
    siteName: "Invyto",
    images: [
      {
        url: "https://www.invyto.in/puneeth-suma/og.jpg",
        width: 1200,
        height: 630,
        alt: "Puneeth & Suma Wedding Portrait",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Puneeth & Suma | Invyto Wedding Invitation",
    description: "Save the dates and celebrate with Puneeth and Suma.",
    images: ["https://www.invyto.in/puneeth-suma/og.jpg"],
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

export default function PuneethSumaWeddingPage() {
  return (
    <>
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

      <div className="hidden md:flex fixed inset-0 w-screen h-screen overflow-hidden">
        <div className="absolute inset-0 overlay-vintage z-[1]" />
        <div className="relative w-full h-full flex z-0">
          {images.desktop.map((src) => (
            <div key={src} className="w-1/3 h-full">
              <img src={src} alt="Puneeth & Suma" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none z-10">
          <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8 px-6 sm:px-8 py-8 sm:py-10 bg-[#2D5244]/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-[#C9A962]/30">
            <p className="text-[#FFF8DC] text-sm sm:text-base md:text-lg font-serif italic tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-semibold">
              || Sri Lakshmi Venkateshwara Prasanna ||
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#FFF8DC]/60 to-transparent" />
              <p className="text-[#FFF8DC] text-sm sm:text-base md:text-lg font-medium uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                With the blessings of our families
              </p>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#FFF8DC]/60 to-transparent" />
            </div>
            <p className="text-[#FFF8DC] text-base sm:text-lg md:text-xl font-serif mb-6 sm:mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium">
              We invite you to witness and celebrate our sacred union
            </p>

            <div className="space-y-3 sm:space-y-4">
              <p className="text-[#FFF8DC] text-base sm:text-lg md:text-xl font-light tracking-[0.2em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Solicit your gracious presence
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#FFF8DC] font-bold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                Puneeth &amp; Suma
              </h1>
            </div>

            <div className="mt-8 sm:mt-10">
              <a
                href={venueMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2D5244] via-[#3D6B58] to-[#2D5244] backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-[#FFF8DC] shadow-2xl transition-all duration-300 hover:from-[#3D6B58] hover:via-[#4F8269] hover:to-[#3D6B58] hover:scale-105 hover:shadow-3xl border border-[#C9A962]/40 pointer-events-auto"
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
