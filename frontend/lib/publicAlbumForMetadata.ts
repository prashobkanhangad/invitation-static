/**
 * Server-only helpers for Open Graph / Twitter cards on public digital album routes.
 * Hero in the app uses the same banner URL with laptop `background-position` (CSS);
 * social crawlers only see the image URL, so we use that banner asset for previews.
 */

const SITE_ORIGIN = "https://www.invyto.in";

function apiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
}

export function absoluteOgImageUrl(imageUrl: string): string {
  const t = imageUrl.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return new URL(t.startsWith("/") ? t : `/${t}`, SITE_ORIGIN).href;
}

/** Published album payload: `images[0]` is the banner; `albumContent.bannerImage` when present. */
export function heroBannerUrlFromPublicPayload(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as {
    albumContent?: { bannerImage?: { url?: string } };
    images?: Array<{ url?: string }>;
  };
  const fromBanner = d.albumContent?.bannerImage?.url;
  if (typeof fromBanner === "string" && fromBanner.trim()) return fromBanner.trim();
  const first = d.images?.[0]?.url;
  if (typeof first === "string" && first.trim()) return first.trim();
  return null;
}

export async function fetchPublicProjectBySlugForMetadata(slug: string): Promise<unknown | null> {
  const s = String(slug || "").trim();
  if (!s) return null;
  const path = `/api/public/projects/slug/${encodeURIComponent(s)}`;
  try {
    const res = await fetch(`${apiBaseUrl()}${path}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  }
}

export async function fetchPublicProjectByShareTokenForMetadata(shareToken: string): Promise<unknown | null> {
  const t = String(shareToken || "").trim();
  if (!t) return null;
  const path = `/api/public/projects/${encodeURIComponent(t)}`;
  try {
    const res = await fetch(`${apiBaseUrl()}${path}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  }
}

export function albumTitleFromPublicPayload(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const name = (data as { project?: { name?: string } }).project?.name;
  if (typeof name === "string" && name.trim()) return name.trim();
  return fallback;
}
