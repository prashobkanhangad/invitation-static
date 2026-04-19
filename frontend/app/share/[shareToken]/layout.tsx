import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  absoluteOgImageUrl,
  albumTitleFromPublicPayload,
  fetchPublicProjectByShareTokenForMetadata,
  heroBannerUrlFromPublicPayload,
} from "@/lib/publicAlbumForMetadata";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ shareToken: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { shareToken } = await params;
  const canonicalUrl = `https://www.invyto.in/share/${encodeURIComponent(shareToken)}`;

  const payload = await fetchPublicProjectByShareTokenForMetadata(shareToken);
  const displayName = albumTitleFromPublicPayload(payload, "Shared album");
  const heroUrlRaw = heroBannerUrlFromPublicPayload(payload);
  const heroAbsolute = heroUrlRaw ? absoluteOgImageUrl(heroUrlRaw) : "";

  const title = `${displayName} | Invyto`;
  const description = `View ${displayName} on Invyto.`;

  const ogImages =
    heroAbsolute ?
      [
        {
          url: heroAbsolute,
          width: 1200,
          height: 630,
          alt: `${displayName} — album preview`,
        },
      ]
    : undefined;

  return {
    metadataBase: new URL("https://www.invyto.in"),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Invyto",
      type: "website",
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(heroAbsolute ? { images: [heroAbsolute] } : {}),
    },
  };
}

export default function ShareAlbumLayout({ children }: LayoutProps) {
  return children;
}
