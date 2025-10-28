import type { Metadata } from "next";
import Hero from "./components/Hero";
import Quote from "./components/Quote";
import VenueMap from "./components/VenueMap";
import Gallery from "./components/Gallery";
import RSVP from "./components/RSVP";
// import Gallery from "./components/Gallery";
// import Quote from "./components/Quote";
// import VenueMap from "./components/VenueMap";
// import RSVP from "./components/RSVP";

export const metadata: Metadata = {
  title: "Sarah & James Wedding - June 15, 2025 | Tuscany, Italy",
  description: "Join us for the wedding celebration of Sarah & James on June 15, 2025 at Villa Bellissima in beautiful Tuscany, Italy. View our story, gallery, and RSVP for this special day.",
  keywords: ["wedding invitation", "Sarah and James wedding", "Tuscany wedding", "Villa Bellissima", "wedding 2025", "destination wedding", "Italy wedding"],
  authors: [{ name: "Sarah & James" }],
  creator: "InviteElegance",
  publisher: "InviteElegance",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Sarah & James Wedding - June 15, 2025",
    description: "Join us for our wedding celebration in Tuscany, Italy. A day filled with love, laughter, and beautiful memories.",
    url: "https://www.invyto.in/romantic-wedding",
    siteName: "InviteElegance Wedding Invitations",
    images: [
      {
        url: "/romanticpage/hero-couple.jpg",
        width: 1200,
        height: 630,
        alt: "Sarah & James Wedding Photo",
      },
      {
        url: "/romanticpage/gallery-1.jpg",
        width: 800,
        height: 600,
        alt: "Wedding celebration moments",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarah & James Wedding - June 15, 2025",
    description: "Join us for our wedding celebration in Tuscany, Italy",
    images: ["/romanticpage/hero-couple.jpg"],
    creator: "@inviteelegance",
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
  alternates: {
    canonical: "https://www.invyto.in/romantic-wedding",
  },
  category: "wedding",
};

export default function RomanticWedding() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Gallery />
      <Quote />
      <VenueMap />
      <RSVP />
    </div>
  );
}

