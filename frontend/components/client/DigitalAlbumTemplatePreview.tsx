"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID,
  getDigitalAlbumTemplatePreview,
  type DigitalAlbumTemplateId,
  type DigitalAlbumTemplatePreviewConfig,
} from "@/utils/digitalAlbumTemplates";

type GalleryTab = {
  id: string;
  label: string;
  images: string[];
};

export default function DigitalAlbumTemplatePreview({
  templateId,
  template,
  imageThumbs,
  bannerImage,
  highlightImages,
  galleryTabs,
}: {
  templateId?: DigitalAlbumTemplateId | string;
  template?: DigitalAlbumTemplatePreviewConfig;
  imageThumbs?: string[];
  bannerImage?: string | null;
  highlightImages?: string[];
  galleryTabs?: GalleryTab[];
}) {
  const config = useMemo(() => {
    if (template) return template;
    if (!templateId) return digitalFallbackTemplate();
    return getDigitalAlbumTemplatePreview(templateId as DigitalAlbumTemplateId);
  }, [template, templateId]);

  const sourceImages = (imageThumbs?.length ? imageThumbs : config.thumbs).filter(Boolean);
  const resolvedBannerImage = bannerImage ?? sourceImages[0] ?? config.coverSrc;
  const highlights = (highlightImages?.length ? highlightImages : sourceImages.length ? sourceImages : [config.coverSrc]).slice(0, 8);

  const resolvedGalleryTabs = useMemo<GalleryTab[]>(() => {
    if (galleryTabs?.length) {
      return galleryTabs.filter((t) => t.images.length > 0);
    }
    const imgs = sourceImages.length ? sourceImages : config.thumbs;
    if (imgs.length <= 6) {
      return [{ id: "all", label: "All", images: imgs }];
    }
    const third = Math.ceil(imgs.length / 3);
    return [
      { id: "all", label: "All", images: imgs },
      { id: "moments", label: "Moments", images: imgs.slice(0, third) },
      { id: "family", label: "Family", images: imgs.slice(third, third * 2) },
      { id: "ceremony", label: "Ceremony", images: imgs.slice(third * 2) },
    ].filter((t) => t.images.length > 0);
  }, [config.thumbs, galleryTabs, sourceImages]);

  const [highlightIndex, setHighlightIndex] = useState(0);
  const [activeGalleryTabId, setActiveGalleryTabId] = useState<string>(resolvedGalleryTabs[0]?.id ?? "all");

  const activeGalleryTab = resolvedGalleryTabs.find((t) => t.id === activeGalleryTabId) ?? resolvedGalleryTabs[0];

  useEffect(() => {
    if (!resolvedGalleryTabs.length) return;
    const exists = resolvedGalleryTabs.some((t) => t.id === activeGalleryTabId);
    if (!exists) setActiveGalleryTabId(resolvedGalleryTabs[0].id);
  }, [activeGalleryTabId, resolvedGalleryTabs]);

  const nextHighlight = () => {
    setHighlightIndex((idx) => (highlights.length === 0 ? 0 : (idx + 1) % highlights.length));
  };

  const prevHighlight = () => {
    setHighlightIndex((idx) =>
      highlights.length === 0 ? 0 : (idx - 1 + highlights.length) % highlights.length
    );
  };

  const currentHighlight = highlights[highlightIndex] ?? bannerImage;

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-[#f5efe4]">
      <section className="relative h-[78vh] min-h-[420px] w-full bg-black">
        <Image
          src={resolvedBannerImage}
          alt={config.coverAlt || "Album banner"}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/85">{config.subtitle}</p>
          <h2 className="mt-2 text-3xl font-serif text-white sm:text-4xl">{config.title}</h2>
        </div>
      </section>

      <section className="border-t border-black/5 bg-white/70 p-4 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b6914]">Highlights</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevHighlight}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
              aria-label="Previous highlight"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={nextHighlight}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
              aria-label="Next highlight"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-black/5 bg-black/5">
          <Image
            src={currentHighlight}
            alt={`Highlight ${highlightIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover"
          />
        </div>

        {highlights.length > 1 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {highlights.map((src, idx) => (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => setHighlightIndex(idx)}
                className={[
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border",
                  idx === highlightIndex ? "border-zinc-900" : "border-zinc-200",
                ].join(" ")}
                aria-label={`Show highlight ${idx + 1}`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="border-t border-black/5 bg-[#f7f2e9] p-4 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b6914]">Gallery</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {resolvedGalleryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveGalleryTabId(tab.id)}
              className={[
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                activeGalleryTab?.id === tab.id
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {(activeGalleryTab?.images ?? []).map((src, idx) => (
            <div
              key={`${activeGalleryTab?.id ?? "tab"}-${src}-${idx}`}
              className="relative aspect-[4/5] overflow-hidden rounded-lg border border-black/5 bg-black/5"
            >
              <Image
                src={src}
                alt={`Gallery image ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 220px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function digitalFallbackTemplate(): DigitalAlbumTemplatePreviewConfig {
  return getDigitalAlbumTemplatePreview(DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID);
}
