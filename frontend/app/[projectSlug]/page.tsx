import type { Metadata } from "next";
import PublicProjectBySlugClient from "@/app/[projectSlug]/PublicProjectBySlugClient";

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

  return {
    metadataBase: new URL("https://www.invyto.in"),
    title: `${prettyName} | Photo Album`,
    description: `View the shared album for ${prettyName} on Invyto.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${prettyName} | Photo Album`,
      description: `View the shared album for ${prettyName} on Invyto.`,
      url: canonicalUrl,
      siteName: "Invyto",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${prettyName} | Photo Album`,
      description: `View the shared album for ${prettyName} on Invyto.`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function PublicProjectBySlugPage({ params }: PageProps) {
  const { projectSlug } = await params;
  return <PublicProjectBySlugClient projectSlug={projectSlug} />;
}

