"use client";

import { useEffect, useState } from "react";
import PublicAlbumScreen from "@/components/client/PublicAlbumScreen";
import { apiFetch } from "@/utils/api";
import type { DigitalAlbumTemplatePreviewConfig } from "@/utils/digitalAlbumTemplates";
import { galleryTabsFromAlbumContent } from "@/utils/publicAlbumGalleryTabs";
import { highlightsFromAlbumContent } from "@/utils/publicAlbumHighlights";
import type { PublicAlbumGalleryTab, PublicAlbumHighlightItem } from "@/components/client/PublicAlbumScreen";

type Props = {
  projectSlug: string;
};

export default function PublicProjectBySlugClient({ projectSlug }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<DigitalAlbumTemplatePreviewConfig | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [albumImageAssets, setAlbumImageAssets] = useState<
    Array<{ id: string; src: string; originalSrc?: string | null }>
  >([]);
  const [albumTitle, setAlbumTitle] = useState("Digital Album");
  const [albumStudioName, setAlbumStudioName] = useState("");
  const [albumBannerHero, setAlbumBannerHero] = useState<{
    desktopPosition: string;
    mobilePosition: string;
  } | null>(null);
  const [albumGalleryTabs, setAlbumGalleryTabs] = useState<PublicAlbumGalleryTab[] | null>(null);
  const [albumHighlights, setAlbumHighlights] = useState<PublicAlbumHighlightItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!projectSlug) return;
      setLoading(true);
      setError(null);
      setAlbumTitle("Digital Album");
      setAlbumStudioName("");
      setAlbumImageAssets([]);
      setAlbumBannerHero(null);
      setAlbumGalleryTabs(null);
      setAlbumHighlights([]);

      try {
        const data = await apiFetch<{
          project?: { name?: string; studioName?: string };
          template: any;
          images: Array<{ id: string; url: string; originalUrl?: string }>;
          bannerHero?: { desktopPosition?: string; mobilePosition?: string };
          albumContent?: {
            galleryTabs?: Array<{ id?: string; label?: string; images?: Array<{ url?: string }> }>;
            highlights?: Array<{ id?: string; url?: string }>;
          };
        }>(`/api/public/projects/slug/${encodeURIComponent(projectSlug)}`);

        if (cancelled) return;

        const tpl = data.template;
        setTemplate(
          tpl
            ? {
                id: tpl.templateId,
                title: String(tpl.title ?? ""),
                subtitle: String(tpl.subtitle ?? ""),
                category: tpl.category,
                gradient: "from-[#1c1410] to-[#f7f2e9]",
                coverSrc: String(tpl.coverSrc ?? ""),
                coverAlt: String(tpl.coverAlt ?? ""),
                thumbs: Array.isArray(tpl.thumbs) ? tpl.thumbs.map(String) : [],
                footerText: String(tpl.footerText ?? ""),
                previewVariant: Number(tpl.previewVariant ?? 1) as
                  | DigitalAlbumTemplatePreviewConfig["previewVariant"],
              }
            : null
        );
        const imageAssets = (data.images ?? [])
          .map((img) => ({
            id: String(img?.id ?? ""),
            src: String(img?.url ?? ""),
            originalSrc:
              typeof img?.originalUrl === "string" && img.originalUrl.trim().length > 0
                ? img.originalUrl
                : null,
          }))
          .filter((img) => img.id.length > 0 && img.src.length > 0);
        setAlbumImageAssets(imageAssets);
        setImages(imageAssets.map((img) => img.src));
        setAlbumTitle(String(data.project?.name ?? "Digital Album"));
        setAlbumStudioName(String(data.project?.studioName ?? "").trim());
        const bh = data.bannerHero;
        if (bh && typeof bh === "object") {
          setAlbumBannerHero({
            desktopPosition: String(bh.desktopPosition ?? "50% 50%"),
            mobilePosition: String(bh.mobilePosition ?? "50% 50%"),
          });
        } else {
          setAlbumBannerHero(null);
        }
        setAlbumGalleryTabs(galleryTabsFromAlbumContent(data.albumContent));
        setAlbumHighlights(highlightsFromAlbumContent(data.albumContent));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load album");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [projectSlug]);

  return (
    <PublicAlbumScreen
      title={albumTitle}
      studioName={albumStudioName}
      subtitle=""
      loading={loading}
      error={error}
      template={template}
      images={images}
      imageAssets={albumImageAssets}
      albumDownloadLookup={{ kind: "slug", value: projectSlug }}
      bannerHero={albumBannerHero}
      galleryTabs={albumGalleryTabs}
      highlights={albumHighlights}
    />
  );
}

