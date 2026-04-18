"use client";

import DigitalAlbumTemplatePreview from "@/components/client/DigitalAlbumTemplatePreview";
import PublicAlbumHighlightsCarousel from "@/components/client/PublicAlbumHighlightsCarousel";
import type { DigitalAlbumTemplatePreviewConfig } from "@/utils/digitalAlbumTemplates";

export type PublicAlbumGalleryTab = {
  id: string;
  label: string;
  images: string[];
};

export type PublicAlbumHighlightItem = { id: string; url: string };

type Props = {
  title: string;
  studioName?: string;
  subtitle?: string;
  loading: boolean;
  error: string | null;
  template: DigitalAlbumTemplatePreviewConfig | null;
  images: string[];
  imageAssets?: Array<{ id: string; src: string; originalSrc?: string | null }>;
  albumDownloadLookup?: { kind: "shareToken" | "slug"; value: string };
  /** Responsive hero background-position (CSS values, e.g. "42% 35%") from studio banner tuning */
  bannerHero?: { desktopPosition: string; mobilePosition: string } | null;
  /** Tab labels + images per tab from studio (`albumContent.galleryTabs`); omit to use preview fallbacks */
  galleryTabs?: PublicAlbumGalleryTab[] | null;
  /** Curated highlight images (`albumContent.highlights`); shown between hero and gallery when non-empty */
  highlights?: PublicAlbumHighlightItem[] | null;
};

export default function PublicAlbumScreen({
  title,
  studioName = "",
  subtitle = "",
  loading,
  error,
  template,
  images,
  imageAssets = [],
  albumDownloadLookup,
  bannerHero = null,
  galleryTabs = null,
  highlights = null,
}: Props) {
  const heroImage = images[0] || template?.coverSrc || "";

  const heroStyle =
    heroImage ?
      {
        backgroundImage: `url("${heroImage}")`,
        ...(bannerHero ?
          {
            "--banner-hero-desktop-pos": bannerHero.desktopPosition,
            "--banner-hero-mobile-pos": bannerHero.mobilePosition,
          }
        : {}),
      }
    : undefined;

  return (
    <main className="min-h-screen bg-[#f7f4ef] antialiased text-[#2c1810]">
      <section
        className={[
          "relative min-h-screen",
          heroImage ? "bg-cover bg-no-repeat public-album-hero" : "",
        ].join(" ")}
        style={heroStyle}
      >
        {studioName.trim() ? (
          <p
            className={[
              "absolute left-6 top-8 z-[1] text-sm tracking-[0.16em] sm:left-10 sm:top-10 sm:text-base",
              heroImage ?
                "text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]"
              : "text-[#6c5548]",
            ].join(" ")}
          >
            {studioName.trim()}
          </p>
        ) : null}
        <div className="absolute bottom-12 left-1/2 z-[1] w-full max-w-5xl -translate-x-1/2 px-4 text-center sm:bottom-16 sm:px-6">
          <h1
            className={[
              "text-2xl font-bold uppercase tracking-[0.16em] sm:text-4xl",
              heroImage ?
                "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]"
              : "text-[#2c1810]",
            ].join(" ")}
          >
            {title.trim() || "Digital Album"}
          </h1>
          {subtitle.trim() ? (
            <p
              className={[
                "mx-auto mt-3 max-w-2xl text-sm sm:text-base",
                heroImage ?
                  "text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                : "text-[#6c5548]",
              ].join(" ")}
            >
              {subtitle.trim()}
            </p>
          ) : null}
        </div>
      </section>

      {!loading && !error && highlights && highlights.length > 0 ? (
        <PublicAlbumHighlightsCarousel items={highlights} />
      ) : null}

      <section className="pb-0">
        <div className="w-full">
          {loading ? (
            <div className="rounded-2xl border border-[#d8c8ad] bg-white/80 p-6 text-sm text-[#654321]">
              Loading album preview...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm text-red-800 sm:text-base">{error}</p>
            </div>
          ) : template ? (
            <DigitalAlbumTemplatePreview
              template={template}
              imageThumbs={images}
              imageAssets={imageAssets}
              albumDownloadLookup={albumDownloadLookup}
              galleryTabs={galleryTabs ?? undefined}
            />
          ) : (
            <div className="rounded-2xl border border-black/10 bg-white/70 p-6 text-sm text-[#654321]">
              No album template found for this link.
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-[#d8c8ad]/80 px-4 py-8 text-center text-xs text-[#6c5548] sm:px-6 sm:text-sm">
        <p>
          Powered by{" "}
          <a
            href="https://invyto.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#2c1810] no-underline transition hover:opacity-90"
          >
            invyto.in
          </a>
        </p>
      </footer>
    </main>
  );
}
