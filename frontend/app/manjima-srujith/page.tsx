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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.invyto.in"),
  title: "Manjima S & Srujith P.B | Invyto Wedding Invitation",
  description:
    "Celebrate the sacred union of Manjima and Srujith. Join us with your blessings.",
  keywords: [
    "Manjima wedding",
    "Srujith wedding",
    "digital wedding invitation",
    "Malayalam wedding invite",
    "Kerala wedding",
  ],
  authors: [{ name: "Manjima S & Srujith P.B" }],
  creator: "Invyto",
  publisher: "Invyto",
  alternates: {
    canonical: "https://www.invyto.in/manjima-srujith",
  },
  openGraph: {
    title: "Manjima S & Srujith P.B | Invyto Wedding Invitation",
    description: "A heartfelt invitation to celebrate with Manjima and Srujith.",
    url: "https://www.invyto.in/manjima-srujith",
    siteName: "Invyto",
    images: [
      {
        url: "https://www.invyto.in/manjima/Untitled%20design%20(62).png",
        width: 1200,
        height: 630,
        alt: "Manjima & Srujith Wedding Invitation",
        type: "image/png",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manjima S & Srujith P.B | Invyto Wedding Invitation",
    description: "Join us to celebrate Manjima and Srujith.",
    images: [
      "https://www.invyto.in/manjima/Untitled%20design%20(62).png",
    ],
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

export default function ManjimaSrujithPage() {
  return (
    <>
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

      <div className="hidden md:flex fixed inset-0 w-screen h-screen overflow-hidden">
        <div className="relative w-full h-full flex">
          <div className="w-1/3 h-full">
            <img
              src="/manjima/WhatsApp Image 2026-04-08 at 13.29.34 (2).jpeg"
              alt="Manjima and Srujith"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/3 h-full">
            <img
              src="/manjima/WhatsApp Image 2026-04-08 at 13.29.31.jpeg"
              alt="Manjima and Srujith"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/3 h-full">
            <img
              src="/manjima/WhatsApp Image 2026-04-08 at 13.29.35 (1).jpeg"
              alt="Manjima and Srujith"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none">
          <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8 px-6 sm:px-8 py-8 sm:py-10 bg-black/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
            <p className="text-white text-lg sm:text-xl md:text-2xl font-serif italic tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] font-semibold">
              "Together with love, we begin forever"
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              <p className="text-white text-sm sm:text-base md:text-lg font-medium uppercase tracking-[0.3em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                With the blessings of our families
              </p>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <p className="text-white text-base sm:text-lg md:text-xl font-serif mb-6 sm:mb-8 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] font-medium">
              We invite you to witness and celebrate our sacred union
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-serif text-white font-bold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              Manjima &amp; Srujith
            </h1>
            <p className="text-xl md:text-2xl text-white/95">12 April 2026 | Sunday</p>
            <p className="text-lg md:text-xl text-white/90">Onath Convention Hall</p>

            <div className="mt-8 sm:mt-10">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Onath+Convention+Hall"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-2xl transition-all duration-300 hover:from-[#DAA520] hover:via-[#FFD700] hover:to-[#DAA520] hover:scale-105 hover:shadow-3xl border border-[#FFD700]/30 pointer-events-auto"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Go to venue</span>
              </a>
            </div>

            <p className="text-lg md:text-xl text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              Please use mobile browser for better experience
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
