import type { Metadata } from "next";
import HomeShell from "@/components/landing/HomeShell";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Showcase from "@/components/landing/Showcase";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import AudienceHubs from "@/components/landing/AudienceHubs";
import FaqSection from "@/components/landing/FaqSection";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";
import JsonLd from "@/components/landing/JsonLd";

export const metadata: Metadata = {
  title: {
    absolute:
      "Digital Wedding Invitations India | WhatsApp E-Invites – Invyto",
  },
  description:
    "Create a digital wedding invitation for WhatsApp. See live Kerala & Malayalam examples, then get one polished link with dates, venue map, timings and your story.",
  keywords: [
    "digital wedding invitation",
    "WhatsApp wedding invitation",
    "wedding e-invite India",
    "online wedding invitation maker",
    "Malayalam wedding invitation online",
    "Kerala wedding invitation",
    "Hindu wedding e-invite",
    "Invyto",
  ],
  alternates: {
    canonical: "https://www.invyto.in",
  },
  openGraph: {
    title: "Digital Wedding Invitations India | WhatsApp E-Invites – Invyto",
    description:
      "Browse live digital wedding invitations, then create yours for WhatsApp — dates, map, timings and story in one link.",
    url: "https://www.invyto.in",
    siteName: "Invyto",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.invyto.in/Invyto/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Invyto digital wedding invitation shared on WhatsApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Wedding Invitations India | WhatsApp E-Invites – Invyto",
    description:
      "Browse live digital wedding invitations, then create yours for WhatsApp.",
    images: ["https://www.invyto.in/Invyto/og-cover.png"],
    creator: "@invyto",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <HomeShell>
      <JsonLd />
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <Features />
        <HowItWorks />
        <AudienceHubs />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </HomeShell>
  );
}
