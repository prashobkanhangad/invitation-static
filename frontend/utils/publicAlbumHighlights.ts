/** Maps public API `albumContent.highlights` to `{ id, url }[]` for the public highlights carousel. */
export function highlightsFromAlbumContent(albumContent: unknown): Array<{ id: string; url: string }> {
  if (!albumContent || typeof albumContent !== "object") return [];
  const raw = (albumContent as { highlights?: unknown }).highlights;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item: unknown) => {
      if (!item || typeof item !== "object") return null;
      const img = item as { id?: string; url?: string };
      const id = String(img.id ?? "").trim();
      const url = String(img.url ?? "").trim();
      if (!id || !url) return null;
      return { id, url };
    })
    .filter((x): x is { id: string; url: string } => x != null);
}
