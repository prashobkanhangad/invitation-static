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
    canonical: "https://www.invyto.in/sanath-shreya",
  },
  openGraph: {
    title: "Sanath & Shreya | Invyto Wedding Invitation",
    description: "Join us in celebrating a heartfelt union in Thaliparamba filled with tradition, memories, and love.",
    url: "https://www.invyto.in/sanath-shreya",
    siteName: "Invyto",
    images: [
      {
        url: "https://www.invyto.in/sanath-shreya.jpg",
        width: 1200,
        height: 630,
        alt: "Sanath & Shreya Wedding Portrait",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanath & Shreya | Invyto Wedding Invitation",
    description: "Save the dates and celebrate with Sanath and Shreya.",
    images: ["https://www.invyto.in/sanath-shreya.jpg"],
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
    <div className="min-h-screen bg-background">
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
  );
}
