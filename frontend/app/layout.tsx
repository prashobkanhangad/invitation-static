import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.invyto.in"),
  title: {
    default: "Digital Wedding Invitations India | WhatsApp E-Invites – Invyto",
    template: "%s | Invyto",
  },
  description:
    "Create a digital wedding invitation in minutes. Share one WhatsApp link with dates, venue map and your story. Mobile-fast and eco-friendly. Start free.",
  keywords: [
    "digital wedding invitation",
    "WhatsApp wedding invitation",
    "wedding e-invite",
    "online wedding invitation maker",
    "Malayalam wedding invitation online",
    "Kerala wedding invitation",
    "Invyto",
  ],
  authors: [{ name: "Invyto" }],
  creator: "Invyto",
  publisher: "Invyto",
  alternates: {
    canonical: "https://www.invyto.in",
  },
  openGraph: {
    title: "Digital Wedding Invitations India | WhatsApp E-Invites – Invyto",
    description:
      "Create a digital wedding invitation in minutes. Share one WhatsApp link with dates, venue map and your story.",
    url: "https://www.invyto.in",
    siteName: "Invyto",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/Invyto/og-cover.png",
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
      "Create a digital wedding invitation in minutes. Share one WhatsApp link with dates, venue map and your story.",
    images: ["/Invyto/og-cover.png"],
    creator: "@invyto",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Q3V8KPR351"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Q3V8KPR351');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
