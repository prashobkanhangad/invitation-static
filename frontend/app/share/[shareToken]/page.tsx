"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import PublicAlbumScreen from "@/components/client/PublicAlbumScreen";
import { apiFetch } from "@/utils/api";
import type {
  DigitalAlbumTemplatePreviewConfig,
} from "@/utils/digitalAlbumTemplates";

export default function ShareAlbumPage() {
  const params = useParams<{ shareToken: string }>();

  const shareToken = useMemo(() => {
    const v = params?.shareToken;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [template, setTemplate] = useState<
    DigitalAlbumTemplatePreviewConfig | null
  >(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!shareToken) return;
      setLoading(true);
      setError(null);

      try {
        const data = await apiFetch<{
          template: any;
          images: Array<{ id: string; url: string }>;
        }>(`/api/public/projects/${encodeURIComponent(shareToken)}`);

        if (cancelled) return;
        const tpl = data.template;
        setTemplate(
          tpl
            ? {
                id: tpl.templateId,
                title: String(tpl.title ?? ""),
                subtitle: String(tpl.subtitle ?? ""),
                category: tpl.category,
                gradient:
                  // Keep the preview gradients aligned with UI fallback.
                  "from-[#1c1410] to-[#f7f2e9]",
                coverSrc: String(tpl.coverSrc ?? ""),
                coverAlt: String(tpl.coverAlt ?? ""),
                thumbs: Array.isArray(tpl.thumbs) ? tpl.thumbs.map(String) : [],
                footerText: String(tpl.footerText ?? ""),
                previewVariant: Number(tpl.previewVariant ?? 1) as
                  | DigitalAlbumTemplatePreviewConfig["previewVariant"],
              }
            : null
        );
        setImages((data.images ?? []).map((img) => String(img.url)));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load share");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [shareToken]);

  return (
    <PublicAlbumScreen
      heading="Invitation Share"
      subheading="Public preview for anyone with this secure share link."
      loading={loading}
      error={error}
      template={template}
      images={images}
    />
  );
}

