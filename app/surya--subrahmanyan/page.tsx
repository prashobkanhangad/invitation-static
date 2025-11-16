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
} from "./components";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.invyto.in"),
  title: "Surya Gayathri & Subrahmanyan | Invyto Wedding Invitation",
  description:
    "Celebrate the sacred union of Surya Gayathri M and Subrahmanyan Namboodiri P. Explore family details, schedule, and invitation.",
  keywords: [
    "Surya Gayathri and Subrahmanyan wedding",
    "modern wedding invite",
    "digital wedding invitation",
    "Payyannur wedding",
  ],
  authors: [{ name: "Surya Gayathri & Subrahmanyan" }],
  creator: "Invyto",
  publisher: "Invyto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.invyto.in/surya--subrahmanyan",
  },
  openGraph: {
    title: "Surya Gayathri & Subrahmanyan | Invyto Wedding Invitation",
    description: "Join us in celebrating a heartfelt union in Payyannur filled with tradition, memories, and love.",
    url: "https://www.invyto.in/surya--subrahmanyan",
    siteName: "Invyto",
    images: [
      {
        url: "https://www.invyto.in/Invyto/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Surya Gayathri & Subrahmanyan Wedding Portrait",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surya Gayathri & Subrahmanyan | Invyto Wedding Invitation",
    description: "Save the dates and celebrate with Surya Gayathri and Subrahmanyan.",
    images: ["https://www.invyto.in/Invyto/og-cover.png"],
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
