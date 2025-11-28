import type { Metadata } from "next";
import {
  HeroSection,
  FullWidthPhotos,
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
  title: "Jithendra & Nanditha | Invyto Wedding Invitation",
  description:
    "Celebrate the sacred union of Jithendra and Nanditha. Explore family details, schedule, and invitation.",
  keywords: [
    "Jithendra and Nanditha wedding",
    "modern wedding invite",
    "digital wedding invitation",
    "Periya wedding",
  ],
  authors: [{ name: "Jithendra & Nanditha" }],
  creator: "Invyto",
  publisher: "Invyto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.invyto.in/jithendra-nanditha",
  },
  openGraph: {
    title: "Jithendra & Nanditha | Invyto Wedding Invitation",
    description: "Join us in celebrating a heartfelt union in Periya filled with tradition, memories, and love.",
    url: "https://www.invyto.in/jithendra-nanditha",
    siteName: "Invyto",
    images: [
      {
        url: "https://www.invyto.in/jithendra-naditha/jithendra_og.png?v=1",
        width: 1200,
        height: 630,
        alt: "Jithendra & Nanditha Wedding Portrait",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jithendra & Nanditha | Invyto Wedding Invitation",
    description: "Save the dates and celebrate with Jithendra and Nanditha.",
    images: ["https://www.invyto.in/jithendra-naditha/jithendra_og.png?v=1"],
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
        <FullWidthPhotos />
        <StorySection />
        <PhotoGallery />
        <EventDetails />
        <QASection />
        <MapSection />
        <InvitationSection />
        <FooterSection />
      </div>

      {/* Web View - Single Full Screen with 3 Images */}
      <div className="hidden md:flex fixed inset-0 w-screen h-screen overflow-hidden">
        <div className="grid grid-cols-3 w-full h-full">
          <div className="relative overflow-hidden">
            <img
              src="/jithendra-naditha/img-1.jpeg"
              alt="Wedding moment"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src="/jithendra-naditha/img-3.jpeg"
              alt="Beautiful memory"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src="/jithendra-naditha/img-2.jpeg"
              alt="Cherished moment"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Overlay with text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 pointer-events-none">
          <div className="text-center mb-8 bg-black/40 backdrop-blur-sm px-8 py-6 rounded-lg">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Jithendra & Nanditha</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2">30th November 2025</p>
            <p className="text-lg text-white/80 font-medium">Sumangali Auditorium, Periya</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm px-6 py-4 rounded-lg">
            <p className="text-lg md:text-xl text-white font-medium">
              Please use mobile browser for better experience
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
