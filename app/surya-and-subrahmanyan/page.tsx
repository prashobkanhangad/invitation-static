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
  title: "Surya & Subrahmanyan | Invyto Wedding Invitation",
  description:
    "Celebrate the sacred union of Surya Gayathri M and Subrahmanyan Namboodiri P. Explore family details, schedule, and invitation.",
  keywords: [
    "Surya and Subrahmanyan wedding",
    "modern wedding invite",
    "digital wedding invitation",
    "Payyannur wedding",
  ],
  alternates: {
    canonical: "https://www.invyto.in/surya-and-subrahmanyan",
  },
  openGraph: {
    title: "Surya & Subrahmanyan | Modern Wedding Invitation",
    description: "Join us in celebrating a heartfelt union in Payyannur filled with tradition, memories, and love.",
    url: "https://www.invyto.in/surya-and-subrahmanyan",
    siteName: "Invyto",
    images: [
      {
        url: "https://www.invyto.in/modern/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Surya & Subrahmanyan Wedding Portrait",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surya & Subrahmanyan | Modern Wedding Invitation",
    description: "Save the dates and celebrate with Surya and Subrahmanyan.",
    images: ["https://www.invyto.in/modern/og-cover.png"],
    creator: "@invyto",
  },
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
