"use client";

import { useEffect, useState } from "react";
import PublicAlbumScreen from "@/components/client/PublicAlbumScreen";
import { apiFetch } from "@/utils/api";
import type { DigitalAlbumTemplatePreviewConfig } from "@/utils/digitalAlbumTemplates";

type Props = {
  projectSlug: string;
};

export default function PublicProjectBySlugClient({ projectSlug }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<DigitalAlbumTemplatePreviewConfig | null>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!projectSlug) return;
      setLoading(true);
      setError(null);

      try {
        const data = await apiFetch<{
          template: any;
          images: Array<{ id: string; url: string }>;
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
        setImages((data.images ?? []).map((img) => String(img.url)));
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
      heading="Shared Album"
      subheading="A public album preview using your project slug link."
      loading={loading}
      error={error}
      template={template}
      images={images}
    />
  );
}

