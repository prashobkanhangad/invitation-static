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
  title: "Anjana PM & Jishnu AV | Invyto Wedding Invitation",
  description:
    "Celebrate the sacred union of Anjana and Jishnu on 13 September 2026 at Malabar Ocean Front & Spa, Nileshwar.",
  keywords: [
    "Anjana wedding",
    "Jishnu wedding",
    "digital wedding invitation",
    "Malayalam wedding invite",
    "Kerala wedding",
    "Nileshwar wedding",
  ],
  authors: [{ name: "Anjana PM & Jishnu AV" }],
  creator: "Invyto",
  publisher: "Invyto",
  alternates: {
    canonical: "https://www.invyto.in/anjana-jishnu",
  },
  openGraph: {
    title: "Anjana PM & Jishnu AV | Invyto Wedding Invitation",
    description:
      "Join us with your blessings on Sunday, 13th September 2026 at Malabar Ocean Front & Spa, Nileshwar.",
    url: "https://www.invyto.in/anjana-jishnu",
    siteName: "Invyto",
    images: [
      {
        url: "https://www.invyto.in/anjana-jishnu/og.jpg",
        width: 1200,
        height: 630,
        alt: "Anjana & Jishnu Wedding Invitation",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anjana PM & Jishnu AV | Invyto Wedding Invitation",
    description: "Join us to celebrate Anjana and Jishnu.",
    images: ["https://www.invyto.in/anjana-jishnu/og.jpg"],
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

export default function AnjanaJishnuPage() {
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
              src={images.desktop[0]}
              alt="Anjana and Jishnu"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/3 h-full">
            <img
              src={images.desktop[1]}
              alt="Anjana and Jishnu"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/3 h-full">
            <img
              src={images.desktop[2]}
              alt="Anjana and Jishnu"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none">
          <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8 px-6 sm:px-8 py-8 sm:py-10 bg-black/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
            <p className="text-white text-lg sm:text-xl md:text-2xl font-serif italic tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] font-semibold">
              &ldquo;Together with love, we begin forever&rdquo;
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
              Anjana &amp; Jishnu
            </h1>
            <p className="text-xl md:text-2xl text-white/95">
              13 September 2026 | Sunday
            </p>
            <p className="text-lg md:text-xl text-white/90">
              Malabar Ocean Front &amp; Spa, Nileshwar
            </p>

            <div className="mt-8 sm:mt-10">
              <a
                href={venueMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7A2430] via-[#9B3A48] to-[#7A2430] backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-2xl transition-all duration-300 hover:from-[#9B3A48] hover:via-[#C4A574] hover:to-[#9B3A48] hover:scale-105 hover:shadow-3xl border border-[#C4A574]/40 pointer-events-auto"
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
