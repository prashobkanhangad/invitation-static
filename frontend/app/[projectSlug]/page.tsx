import type { Metadata } from "next";
import PublicProjectBySlugClient from "@/app/[projectSlug]/PublicProjectBySlugClient";
import {
  absoluteOgImageUrl,
  albumTitleFromPublicPayload,
  fetchPublicProjectBySlugForMetadata,
  heroBannerUrlFromPublicPayload,
} from "@/lib/publicAlbumForMetadata";

type PageProps = {
  params: Promise<{ projectSlug: string }>;
};

function slugToTitle(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectSlug } = await params;
  const prettyName = slugToTitle(projectSlug) || "Shared Album";
  const canonicalUrl = `https://www.invyto.in/${projectSlug}`;

  const payload = await fetchPublicProjectBySlugForMetadata(projectSlug);
  const displayName = albumTitleFromPublicPayload(payload, prettyName);
  const heroUrlRaw = heroBannerUrlFromPublicPayload(payload);
  const heroAbsolute = heroUrlRaw ? absoluteOgImageUrl(heroUrlRaw) : "";

  const title = `${displayName} | Photo Album`;
  const description = `View the shared album for ${displayName} on Invyto.`;

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
    robots: { index: true, follow: true },
  };
}

export default async function PublicProjectBySlugPage({ params }: PageProps) {
  const { projectSlug } = await params;
  return <PublicProjectBySlugClient projectSlug={projectSlug} />;
}

