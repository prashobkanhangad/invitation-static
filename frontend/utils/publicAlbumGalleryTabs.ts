/**
 * Maps public API `albumContent.galleryTabs` to the shape expected by
 * `DigitalAlbumTemplatePreview`. Prepends a synthetic **All** tab (deduped union
 * of every gallery image across tabs) so the public album always shows “All”
 * first, then each dashboard tab. Returns `null` when absent or unusable so the
 * preview can fall back to synthetic tab labels.
 */
export function galleryTabsFromAlbumContent(albumContent: unknown): Array<{
  id: string;
  label: string;
  images: string[];
}> | null {
  if (!albumContent || typeof albumContent !== "object") return null;
  const raw = (albumContent as { galleryTabs?: unknown }).galleryTabs;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const mapped = raw
    .map((tab: unknown) => {
      if (!tab || typeof tab !== "object") return null;
      const t = tab as { id?: string; label?: string; images?: unknown };
      const id = String(t.id ?? "").trim();
      const label = String(t.label ?? "Gallery").trim() || "Gallery";
      const images = Array.isArray(t.images)
        ? t.images
            .map((img: unknown) => {
              if (!img || typeof img !== "object") return "";
              return String((img as { url?: string }).url ?? "").trim();
            })
            .filter(Boolean)
        : [];
      if (!id || images.length === 0) return null;
      return { id, label, images };
    })
    .filter((x): x is { id: string; label: string; images: string[] } => x != null);

  if (mapped.length === 0) return null;

  const seen = new Set<string>();
  const allImages: string[] = [];
  for (const tab of mapped) {
    for (const url of tab.images) {
      if (!seen.has(url)) {
        seen.add(url);
        allImages.push(url);
      }
    }
  }
  if (allImages.length === 0) return null;

  /** Stable id so it never clashes with Mongo tab ids (`tab-main`, `tab_…`). */
  const allTab = { id: "__all", label: "All", images: allImages };

  return [allTab, ...mapped];
}
