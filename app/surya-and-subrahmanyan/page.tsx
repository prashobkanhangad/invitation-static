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
    canonical: "https://www.invyto.in/modern-wedding",
  },
  openGraph: {
    title: "Surya & Subrahmanyan | Modern Wedding Invitation",
    description: "Join us in celebrating a heartfelt union in Payyannur filled with tradition, memories, and love.",
    url: "https://www.invyto.in/modern-wedding",
    siteName: "Invyto",
    images: [
      {
        url: "/modern/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Surya & Subrahmanyan Wedding Portrait",
      },
      {
        url: "/modern/gallery-1.jpg",
        width: 1080,
        height: 1080,
        alt: "Surya & Subrahmanyan moments",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surya & Subrahmanyan | Modern Wedding Invitation",
    description: "Save the dates and celebrate with Surya and Subrahmanyan.",
    images: ["/modern/og-cover.png"],
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
