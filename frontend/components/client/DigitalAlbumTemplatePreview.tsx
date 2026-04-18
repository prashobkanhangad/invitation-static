"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { API_BASE_URL } from "@/utils/api";
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

type GalleryImageAsset = {
  id: string;
  src: string;
  originalSrc?: string | null;
};

export default function DigitalAlbumTemplatePreview(props: {
  templateId?: DigitalAlbumTemplateId | string;
  template?: DigitalAlbumTemplatePreviewConfig;
  imageThumbs?: string[];
  imageAssets?: GalleryImageAsset[];
  albumDownloadLookup?: { kind: "shareToken" | "slug"; value: string };
  bannerImage?: string | null;
  highlightImages?: string[];
  galleryTabs?: GalleryTab[];
}) {
  const { templateId, template, imageThumbs, imageAssets, albumDownloadLookup, galleryTabs } = props;
  const config = useMemo(() => {
    if (template) return template;
    if (!templateId) return digitalFallbackTemplate();
    return getDigitalAlbumTemplatePreview(templateId as DigitalAlbumTemplateId);
  }, [template, templateId]);

  const sourceImages = (imageThumbs?.length ? imageThumbs : config.thumbs).filter(Boolean);
  const imageSourceMap = useMemo(() => {
    const map = new Map<string, GalleryImageAsset>();
    (imageAssets || [])
      .filter(
        (item) =>
          typeof item?.id === "string" &&
          item.id.trim().length > 0 &&
          typeof item?.src === "string" &&
          item.src.trim().length > 0
      )
      .forEach((item) => map.set(item.src, item));
    return map;
  }, [imageAssets]);

  const resolvedGalleryTabs = useMemo<GalleryTab[]>(() => {
    // When galleryTabs is provided (including []), never fall back to template thumbs — studio create flow relies on this.
    if (galleryTabs != null) {
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

  const [activeGalleryTabId, setActiveGalleryTabId] = useState<string>(resolvedGalleryTabs[0]?.id ?? "all");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const previewAsset = previewSrc ? imageSourceMap.get(previewSrc) : undefined;
  const previewAssetId = previewAsset?.id || "";
  const previewOriginalSrc = previewAsset?.originalSrc || "";

  const activeGalleryTab = resolvedGalleryTabs.find((t) => t.id === activeGalleryTabId) ?? resolvedGalleryTabs[0];

  useEffect(() => {
    if (!resolvedGalleryTabs.length) return;
    const exists = resolvedGalleryTabs.some((t) => t.id === activeGalleryTabId);
    if (!exists) setActiveGalleryTabId(resolvedGalleryTabs[0].id);
  }, [activeGalleryTabId, resolvedGalleryTabs]);

  useEffect(() => {
    if (!previewSrc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewSrc(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewSrc]);

  useEffect(() => {
    if (!previewSrc) setDownloadMenuOpen(false);
  }, [previewSrc]);

  const triggerDownload = async (url: string, fileName: string) => {
    if (!url) throw new Error("Download URL not available");
    const res = await fetch(url);
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  };

  const filenameFromUrl = (url: string, fallback = "image") => {
    try {
      const pathname = new URL(url).pathname;
      const part = pathname.split("/").filter(Boolean).pop() || "";
      const base = decodeURIComponent(part).trim();
      return base || fallback;
    } catch {
      return fallback;
    }
  };

  const albumDownloadUrl = (imageId: string, variant: "optimized" | "original") => {
    if (!albumDownloadLookup || !albumDownloadLookup.value || !imageId) return "";
    const enc = encodeURIComponent;
    if (albumDownloadLookup.kind === "shareToken") {
      return `${API_BASE_URL}/api/public/projects/${enc(albumDownloadLookup.value)}/album-images/${enc(imageId)}/download?variant=${variant}`;
    }
    return `${API_BASE_URL}/api/public/projects/slug/${enc(albumDownloadLookup.value)}/album-images/${enc(imageId)}/download?variant=${variant}`;
  };

  return (
    <div className="overflow-hidden border border-black/5 bg-[#f5efe4]">
      <section className="border-t border-black/5 bg-[#f7f2e9] px-2 py-4 sm:py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b6914]">Gallery</p>
        {resolvedGalleryTabs.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">No gallery photos yet.</p>
        ) : (
          <>
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

        <div className="mt-4 columns-2 gap-x-2 sm:columns-3 lg:columns-4">
          {(activeGalleryTab?.images ?? []).map((src, idx) => (
            <div
              key={`${activeGalleryTab?.id ?? "tab"}-${src}-${idx}`}
              className="mb-2 break-inside-avoid overflow-hidden rounded-lg border border-black/5 bg-black/5"
            >
              <button
                type="button"
                onClick={() => setPreviewSrc(src)}
                className="block w-full"
                aria-label={`Preview gallery image ${idx + 1}`}
              >
                <Image
                  src={src}
                  alt={`Gallery image ${idx + 1}`}
                  width={1200}
                  height={800}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="h-auto w-full"
                />
              </button>
            </div>
          ))}
        </div>
          </>
        )}
      </section>

      {previewSrc ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setPreviewSrc(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewSrc(null)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white hover:bg-black/60"
            aria-label="Close image preview"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
          <div
            className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={previewSrc}
              alt="Selected gallery image"
              width={1800}
              height={1200}
              sizes="100vw"
              className="h-auto max-h-[92vh] w-full object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 z-[1] -translate-x-1/2" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {downloadMenuOpen ? (
                <div className="absolute bottom-12 left-1/2 flex w-[220px] -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-white/25 bg-black/70 backdrop-blur">
                  <button
                    type="button"
                    onClick={async () => {
                      const downloadUrl =
                        previewAssetId && albumDownloadLookup
                          ? albumDownloadUrl(previewAssetId, "optimized")
                          : previewSrc;
                      await triggerDownload(downloadUrl, filenameFromUrl(previewSrc, "image-optimized"));
                      setDownloadMenuOpen(false);
                    }}
                    className="px-4 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Download optimized
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const hi =
                        previewAssetId && albumDownloadLookup
                          ? albumDownloadUrl(previewAssetId, "original")
                          : previewOriginalSrc || previewSrc;
                      await triggerDownload(hi, filenameFromUrl(hi, "image-original"));
                      setDownloadMenuOpen(false);
                    }}
                    className="border-t border-white/20 px-4 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Download high quality
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setDownloadMenuOpen((v) => !v)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-black/40 px-5 text-sm font-semibold text-white hover:bg-black/60"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function digitalFallbackTemplate(): DigitalAlbumTemplatePreviewConfig {
  return getDigitalAlbumTemplatePreview(DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID);
}
