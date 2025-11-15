import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.invyto.in"),
  title: "Invyto – Elegant Digital Invitations",
  description:
    "Create stunning digital invitations for weddings, birthdays, and corporate events in minutes. Effortless, elegant, and eco-friendly.",
  keywords: [
    "digital invitations",
    "Invyto",
    "wedding e-invite",
    "event invitation builder",
    "online invitation maker",
  ],
  alternates: {
    canonical: "https://www.invyto.in",
  },
  openGraph: {
    title: "Invyto – Elegant Digital Invitations",
    description:
      "Create stunning digital invitations for weddings, birthdays, and corporate events in minutes. Effortless, elegant, and eco-friendly.",
    url: "https://www.invyto.in",
    siteName: "Invyto",
    type: "website",
    images: [
      {
        url: `/Invyto/og-cover.png`,
        width: 1200,
        height: 630,
        alt: "InviteElegance Digital Invitation Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invyto – Elegant Digital Invitations",
    description:
      "Create stunning digital invitations for weddings, birthdays, and corporate events in minutes. Effortless, elegant, and eco-friendly.",
    images: [`/Invyto/og-cover.png`],
    creator: "@invyto",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
