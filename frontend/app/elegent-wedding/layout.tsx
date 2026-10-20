import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elegant Wedding Invitation Demo",
  description: "Sample elegant wedding invitation template from Invyto.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Elegant Wedding Invitation Demo | Invyto",
    description: "Sample elegant wedding invitation template from Invyto.",
    images: [
      {
        url: "/Invyto/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Invyto elegant wedding invitation demo",
      },
    ],
  },
};

export default function ElegantWeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
