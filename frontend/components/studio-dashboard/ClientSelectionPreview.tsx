"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Download, Heart, ImageIcon, Maximize2, X } from "lucide-react";
import { CLIENT_PREVIEW_ALL_TAB_ID, type ClientPreviewTab } from "@/components/studio-dashboard/clientPreviewTypes";

type PreviewPhoto = {
  id: string;
  kind: "sample" | "upload";
  picked: boolean;
  fav: boolean;
  tabId?: string | null;
  gradient?: string;
  blobUrl?: string;
  /** Full-resolution asset URL (e.g. from your API). */
  rawUrl?: string;
  /** Pre-generated optimized / web delivery URL. */
  optimizedUrl?: string;
  fileName?: string;
  mimeType?: string;
  label: string;
};

function sanitizeDownloadFilename(name: string): string {
  const n = name.replace(/[/\\?%*:|"<>]/g, "-").trim();
  return n || "photo";
}

function extensionFromMime(mime: string | undefined): string | null {
  if (!mime) return null;
  if (mime.includes("jpeg") || mime === "image/jpg") return "jpg";
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("heic")) return "heic";
  return null;
}

function rawDownloadName(photo: PreviewPhoto): string {
  if (photo.fileName) return sanitizeDownloadFilename(photo.fileName);
  const base = sanitizeDownloadFilename(photo.label.replace(/\.[^.]+$/, "") || "photo");
  const ext = extensionFromMime(photo.mimeType) || "jpg";
  return `${base}.${ext}`;
}

function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function fetchBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not download file");
  return res.blob();
}

async function blobUrlToOptimizedJpeg(blobUrl: string, maxEdge: number): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not load image"));
    el.src = blobUrl;
  });
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) throw new Error("Invalid image");
  const scale = Math.min(1, maxEdge / Math.max(w, h));
  const tw = Math.max(1, Math.round(w * scale));
  const th = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available");
  ctx.drawImage(img, 0, 0, tw, th);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not encode image"))), "image/jpeg", 0.82);
  });
}

function canDownloadRaw(photo: PreviewPhoto): boolean {
  return Boolean(photo.rawUrl || (photo.kind === "upload" && photo.blobUrl));
}

function canDownloadOptimized(photo: PreviewPhoto): boolean {
  if (photo.optimizedUrl) return true;
  if (photo.kind === "upload" && photo.blobUrl) return true;
  if (photo.rawUrl) return true;
  return false;
}

function showDownloadUi(photo: PreviewPhoto): boolean {
  return canDownloadRaw(photo) || canDownloadOptimized(photo);
}

async function runClientPhotoDownload(photo: PreviewPhoto, kind: "raw" | "optimized"): Promise<void> {
  const base =
    sanitizeDownloadFilename((photo.fileName || photo.label).replace(/\.[^.]+$/, "") || "") || "photo";

  if (kind === "optimized") {
    if (photo.optimizedUrl) {
      const blob = await fetchBlob(photo.optimizedUrl);
      triggerFileDownload(blob, `${base}-optimized.jpg`);
      return;
    }
    if (photo.kind === "upload" && photo.blobUrl) {
      const jpeg = await blobUrlToOptimizedJpeg(photo.blobUrl, 2560);
      triggerFileDownload(jpeg, `${base}-optimized.jpg`);
      return;
    }
    if (photo.rawUrl) {
      const blob = await fetchBlob(photo.rawUrl);
      const objUrl = URL.createObjectURL(blob);
      try {
        const jpeg = await blobUrlToOptimizedJpeg(objUrl, 2560);
        triggerFileDownload(jpeg, `${base}-optimized.jpg`);
      } finally {
        URL.revokeObjectURL(objUrl);
      }
      return;
    }
  }

  if (kind === "raw") {
    if (photo.rawUrl) {
      const blob = await fetchBlob(photo.rawUrl);
      let name = photo.fileName ? sanitizeDownloadFilename(photo.fileName) : `${base}-original`;
      if (!name.includes(".")) {
        const ext = extensionFromMime(blob.type) || "jpg";
        name = `${name}.${ext}`;
      }
      triggerFileDownload(blob, name);
      return;
    }
    if (photo.kind === "upload" && photo.blobUrl) {
      const blob = await fetch(photo.blobUrl).then((r) => r.blob());
      triggerFileDownload(blob, rawDownloadName(photo));
      return;
    }
  }

  throw new Error("Nothing to download");
}

type Props = {
  studioName?: string;
  projectName: string;
  subtitle: string;
  pickedCount: number;
  photoCount: number;
  published: boolean;
  clientTabs: ClientPreviewTab[];
  photos: PreviewPhoto[];
  onClose: () => void;
  onTogglePick: (photoId: string) => void;
  onToggleFav: (photoId: string) => void;
};

export default function ClientSelectionPreview({
  studioName = "Your studio",
  projectName,
  subtitle,
  pickedCount,
  photoCount,
  published,
  clientTabs,
  photos,
  onClose,
  onTogglePick,
  onToggleFav,
}: Props) {

  const [activeTabId, setActiveTabId] = useState<string>(CLIENT_PREVIEW_ALL_TAB_ID);
  const [lightboxPhotoId, setLightboxPhotoId] = useState<string | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState<"raw" | "optimized" | null>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveTabId(CLIENT_PREVIEW_ALL_TAB_ID);
    setLightboxPhotoId(null);
    setDownloadMenuOpen(false);
  }, [projectName, clientTabs.length]);

  useEffect(() => {
    setLightboxPhotoId(null);
  }, [activeTabId]);

  useEffect(() => {
    if (lightboxPhotoId === null) setDownloadMenuOpen(false);
  }, [lightboxPhotoId]);

  useEffect(() => {
    if (!downloadMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setDownloadMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [downloadMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (lightboxPhotoId !== null) {
        setLightboxPhotoId(null);
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, lightboxPhotoId]);

  const hasTabs = clientTabs.length > 0;

  const visiblePhotos = useMemo(() => {
    if (!hasTabs || activeTabId === CLIENT_PREVIEW_ALL_TAB_ID) return photos;
    return photos.filter((ph) => ph.tabId === activeTabId);
  }, [photos, hasTabs, activeTabId]);

  const lightboxPhoto =
    lightboxPhotoId !== null ? (photos.find((ph) => ph.id === lightboxPhotoId) ?? null) : null;

  const handlePhotoDownload = async (kind: "raw" | "optimized") => {
    if (!lightboxPhoto) return;
    setDownloadBusy(kind);
    setDownloadMenuOpen(false);
    try {
      await runClientPhotoDownload(lightboxPhoto, kind);
    } catch (e) {
      console.error(e);
      window.alert(e instanceof Error ? e.message : "Download failed");
    } finally {
      setDownloadBusy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#f7f4ef] text-[#1c1917] antialiased">
      <header className="shrink-0 border-b border-stone-200/80 bg-[#fbfaf7]/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:h-16 sm:flex-nowrap sm:py-0 sm:px-6">
          <div className="flex min-w-0 flex-1 basis-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
              {studioName.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-900">{studioName}</p>
              <p className="truncate text-xs text-stone-500">Photo selection</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <span className="hidden rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-900 ring-1 ring-amber-200/80 sm:inline">
              Preview
            </span>
            {published ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-900 ring-1 ring-emerald-200/80">
                Live
              </span>
            ) : (
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600 ring-1 ring-stone-200/80">
                Draft link
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-900 shadow-sm hover:bg-stone-50"
            >
              <X className="h-4 w-4" strokeWidth={2} />
              <span className="hidden sm:inline">Close preview</span>
            </button>
          </div>
        </div>
      </header>

      <div className="shrink-0 border-b border-stone-200/60 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-500">Your gallery</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            {projectName}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {hasTabs ? (
        <div className="shrink-0 border-b border-stone-200/60 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Sections</p>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveTabId(CLIENT_PREVIEW_ALL_TAB_ID)}
                className={[
                  "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                  activeTabId === CLIENT_PREVIEW_ALL_TAB_ID
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-700 ring-1 ring-stone-200/80 hover:bg-stone-200/80",
                ].join(" ")}
              >
                All photos
              </button>
              {clientTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={[
                    "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                    activeTabId === tab.id
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-700 ring-1 ring-stone-200/80 hover:bg-stone-200/80",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="shrink-0 border-b border-stone-200/60 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-900">
              {pickedCount} selected
              {photoCount > 0 ? (
                <span className="font-normal text-stone-500">
                  {" "}
                  ·{" "}
                  {hasTabs && activeTabId !== CLIENT_PREVIEW_ALL_TAB_ID
                    ? `${visiblePhotos.length} in this tab · ${photoCount} total`
                    : `${photoCount} photos in this set`}
                </span>
              ) : null}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pickedCount === 0}
              className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm font-semibold text-stone-400 opacity-90"
              title="Connect API to enable submit"
            >
              Submit selections
            </button>
          </div>
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          {photoCount === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/80 py-20 text-center">
              <ImageIcon className="h-12 w-12 text-stone-300" strokeWidth={1.25} />
              <p className="mt-4 text-sm font-semibold text-stone-800">No photos to show yet</p>
              <p className="mt-1 max-w-sm text-sm text-stone-600">
                Close preview and add images from the studio workspace. Clients will see them here once they are in the
                set.
              </p>
            </div>
          ) : visiblePhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/80 py-20 text-center">
              <ImageIcon className="h-12 w-12 text-stone-300" strokeWidth={1.25} />
              <p className="mt-4 text-sm font-semibold text-stone-800">No photos in this section yet</p>
              <p className="mt-1 max-w-sm text-sm text-stone-600">
                Your photographer can assign images to “
                {clientTabs.find((t) => t.id === activeTabId)?.label ?? "this tab"}” from the dashboard, or try{" "}
                <button
                  type="button"
                  onClick={() => setActiveTabId(CLIENT_PREVIEW_ALL_TAB_ID)}
                  className="font-semibold text-stone-900 underline underline-offset-2"
                >
                  All photos
                </button>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {visiblePhotos.map((t) => (
                <div
                  key={t.id}
                  className={[
                    "group relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200 ring-1 ring-stone-900/5",
                    t.picked ? "ring-2 ring-stone-900 ring-offset-2 ring-offset-[#f7f4ef]" : "",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => onTogglePick(t.id)}
                    className="absolute inset-0 z-0 block h-full w-full text-left"
                    aria-label={t.picked ? "Remove from selection" : "Add to selection"}
                  >
                    <span
                      className={[
                        "absolute inset-0 bg-gradient-to-br",
                        t.kind === "sample" ? t.gradient : "from-stone-100 to-stone-300",
                      ].join(" ")}
                    />
                    {t.kind === "upload" && t.blobUrl ? (
                      <img alt="" src={t.blobUrl} className="absolute inset-0 h-full w-full object-cover" />
                    ) : null}
                    <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleFav(t.id);
                    }}
                    className={[
                      "absolute right-2 top-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full shadow-md transition",
                      t.fav
                        ? "bg-white text-rose-600"
                        : "bg-white/90 text-stone-400 hover:text-rose-500",
                    ].join(" ")}
                    aria-label={t.fav ? "Remove from must-haves" : "Mark as must-have"}
                  >
                    <Heart className={["h-4 w-4", t.fav ? "fill-current" : ""].join(" ")} strokeWidth={1.75} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLightboxPhotoId(t.id);
                    }}
                    className="absolute bottom-2 right-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200/90 bg-white/95 text-stone-800 shadow-md hover:bg-white"
                    aria-label={`View ${t.label} larger`}
                  >
                    <Maximize2 className="h-4 w-4" strokeWidth={2} />
                  </button>

                  {t.picked ? (
                    <span className="pointer-events-none absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-stone-900 shadow-md">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                      Selected
                    </span>
                  ) : (
                    <span className="pointer-events-none absolute bottom-2 left-2 z-10 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                      Tap to select
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="mt-8 text-center text-xs text-stone-500">
            This is a client-style preview from your studio dashboard. Escape closes the large photo first, then exits
            this preview.
          </p>
        </div>
      </main>

      {lightboxPhoto ? (
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Close photo"
            className="absolute inset-0 bg-black/85"
            onClick={() => setLightboxPhotoId(null)}
          />
          <div
            className={[
              "relative z-10 flex max-h-[100dvh] w-full max-w-5xl flex-col gap-2 overflow-y-auto overscroll-contain px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:max-h-[92vh] sm:gap-3 sm:px-6 sm:pb-6 sm:pt-4",
            ].join(" ")}
          >
            <div className="flex shrink-0 justify-end">
              <button
                type="button"
                onClick={() => setLightboxPhotoId(null)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
            <div className="flex shrink-0 justify-center">
              <div className="w-full max-w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/15">
                {lightboxPhoto.kind === "upload" && lightboxPhoto.blobUrl ? (
                  <img
                    src={lightboxPhoto.blobUrl}
                    alt=""
                    className="mx-auto max-h-[min(36vh,340px)] w-auto max-w-full object-contain sm:max-h-[min(64vh,620px)]"
                  />
                ) : (
                  <div
                    className={[
                      "mx-auto flex h-[min(32vh,280px)] w-full max-w-full items-center justify-center bg-gradient-to-br sm:h-[min(48vh,400px)]",
                      lightboxPhoto.gradient ?? "",
                    ].join(" ")}
                  />
                )}
              </div>
            </div>
            <p className="shrink-0 truncate px-1 text-center text-sm font-medium text-white" title={lightboxPhoto.label}>
              {lightboxPhoto.label}
            </p>
            <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
              <button
                type="button"
                onClick={() => onTogglePick(lightboxPhoto.id)}
                className="inline-flex h-auto min-h-10 min-w-0 flex-1 items-center justify-center whitespace-normal rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-center text-sm font-semibold leading-tight text-white hover:bg-white/20 sm:h-10 sm:flex-none sm:whitespace-nowrap sm:py-0"
              >
                {lightboxPhoto.picked ? "Remove from selection" : "Add to selection"}
              </button>
              <button
                type="button"
                onClick={() => onToggleFav(lightboxPhoto.id)}
                className="inline-flex h-auto min-h-10 min-w-0 flex-1 items-center justify-center gap-2 whitespace-normal rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold leading-tight text-white hover:bg-white/20 sm:h-10 sm:flex-none sm:whitespace-nowrap sm:py-0"
              >
                <Heart
                  className={["h-4 w-4 shrink-0", lightboxPhoto.fav ? "fill-current text-rose-300" : ""].join(" ")}
                  strokeWidth={1.75}
                />
                <span className="text-center">{lightboxPhoto.fav ? "Remove must-have" : "Mark must-have"}</span>
              </button>
              {showDownloadUi(lightboxPhoto) ? (
                <div className="relative w-full sm:w-auto" ref={downloadMenuRef}>
                  <button
                    type="button"
                    disabled={downloadBusy !== null}
                    onClick={() => setDownloadMenuOpen((o) => !o)}
                    className="inline-flex h-10 w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3 text-sm font-semibold text-white hover:bg-white/20 disabled:opacity-50 sm:w-auto"
                    aria-expanded={downloadMenuOpen}
                    aria-haspopup="menu"
                  >
                    <Download className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span className="min-w-0 truncate">{downloadBusy ? "Preparing…" : "Download"}</span>
                    <ChevronDown
                      className={["h-4 w-4 shrink-0 transition", downloadMenuOpen ? "rotate-180" : ""].join(" ")}
                      strokeWidth={2}
                    />
                  </button>
                  {downloadMenuOpen ? (
                    <div
                      role="menu"
                      className="absolute bottom-full left-0 right-0 z-20 mb-2 max-h-[min(45vh,280px)] overflow-y-auto rounded-xl border border-white/20 bg-stone-950/95 p-1.5 shadow-xl ring-1 ring-white/10 backdrop-blur-md sm:bottom-auto sm:left-0 sm:right-auto sm:top-full sm:mb-0 sm:mt-2 sm:w-[min(calc(100vw-1.5rem),280px)]"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        disabled={!canDownloadRaw(lightboxPhoto) || downloadBusy !== null}
                        title={
                          canDownloadRaw(lightboxPhoto)
                            ? "Full-resolution file from your photographer"
                            : "Not available for this photo"
                        }
                        onClick={() => void handlePhotoDownload("raw")}
                        className="flex w-full flex-col rounded-lg px-3 py-2.5 text-left text-sm text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="font-semibold">Original (large · RAW)</span>
                        <span className="mt-0.5 text-xs font-normal text-white/65">Best quality, biggest file</span>
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        disabled={!canDownloadOptimized(lightboxPhoto) || downloadBusy !== null}
                        title={
                          canDownloadOptimized(lightboxPhoto)
                            ? "Smaller JPEG, faster to share"
                            : "Not available for this photo"
                        }
                        onClick={() => void handlePhotoDownload("optimized")}
                        className="mt-1 flex w-full flex-col rounded-lg px-3 py-2.5 text-left text-sm text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="font-semibold">Optimized image</span>
                        <span className="mt-0.5 text-xs font-normal text-white/65">Web-sized JPEG</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
            <p className="shrink-0 px-2 pb-1 text-center text-xs leading-snug text-white/60">
              Escape or backdrop to return to the gallery
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
