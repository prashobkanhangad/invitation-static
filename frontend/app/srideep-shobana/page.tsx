import type { Metadata } from "next";
import {
  AlbumFooter,
  AlbumGallery,
  AlbumHero,
  AlbumIntro,
  AlbumPartnerLogo,
  SpotlightCarousel,
} from "./components";
import { ALBUM_COVER } from "./photos";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.invyto.in"),
  title: "Sreejai Sreedeep & Shobana Rambe | Photo Album",
  description:
    "A traditional photo album celebrating Sreejai Sreedeep and Shobana Rambe — cherished moments in a timeless presentation.",
  keywords: [
    "Sreejai Sreedeep",
    "Shobana Rambe",
    "photo album",
    "wedding album",
    "Invyto",
  ],
  alternates: {
    canonical: "https://www.invyto.in/srideep-shobana",
  },
  openGraph: {
    title: "Sreejai Sreedeep & Shobana Rambe | Photo Album",
    description:
      "Cherished moments — a timeless photographic collection. Mobile-friendly viewing experience.",
    url: "https://www.invyto.in/srideep-shobana",
    siteName: "Invyto",
    type: "website",
    images: [
      {
        url: ALBUM_COVER,
        width: 1200,
        height: 630,
        alt: "Sreejai Sreedeep & Shobana Rambe",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sreejai Sreedeep & Shobana Rambe | Photo Album",
    description: "A collection of cherished moments.",
    images: [ALBUM_COVER],
  },
  robots: { index: true, follow: true },
};

export default function SrideepShobanaAlbumPage() {
  return (
    <main className="min-h-screen bg-[#ebe4d8] antialiased text-[#2c1810]">
      <AlbumHero />
      <AlbumIntro />
      <SpotlightCarousel />
      <AlbumGallery />
      <AlbumPartnerLogo />
      <AlbumFooter />
    </main>
  );
}
