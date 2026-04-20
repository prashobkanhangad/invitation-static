import type { Metadata } from "next";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

type PublicPhotoSelectionMetadataPayload = {
  project?: {
    name?: string;
    studioName?: string;
  };
  photoSelection?: {
    ogImage?: { url?: string };
  };
};

const SITE_ORIGIN = "https://www.invyto.in";

function apiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
}

function absoluteUrl(url: string): string {
  const trimmed = String(url || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return new URL(trimmed.startsWith("/") ? trimmed : `/${trimmed}`, SITE_ORIGIN).href;
}

function buildTitleAndDescription(projectNameRaw: string, studioNameRaw: string) {
  const projectName = projectNameRaw.trim() || "Photo selection";
  const studioName = studioNameRaw.trim();
  const line = [projectName, studioName, "Invyto.in"].filter(Boolean).join(" | ");
  return {
    title: line,
    description: `View ${line}.`,
  };
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalUrl = `${SITE_ORIGIN}/photos/${encodeURIComponent(slug)}`;

  let payload: PublicPhotoSelectionMetadataPayload | null = null;
  try {
    const res = await fetch(`${apiBaseUrl()}/api/public/photos/${encodeURIComponent(slug)}`, {
      next: { revalidate: 120 },
    });
    if (res.ok) {
      payload = (await res.json()) as PublicPhotoSelectionMetadataPayload;
    }
  } catch {
    payload = null;
  }

  const projectName = String(payload?.project?.name ?? "");
  const studioName = String(payload?.project?.studioName ?? "");
  const { title, description } = buildTitleAndDescription(projectName, studioName);
  const ogImageUrl = absoluteUrl(String(payload?.photoSelection?.ogImage?.url ?? ""));

  return {
    metadataBase: new URL(SITE_ORIGIN),
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
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };
}

export default function PublicPhotoSelectionLayout({ children }: LayoutProps) {
  return children;
}
