"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Check, Download, ChevronDown, X } from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/utils/api";

type PublicSelectionTab = {
  id: string;
  label: string;
};

type PublicSelectionPhoto = {
  id: string;
  url: string;
  originalUrl: string | null;
  tabId: string | null;
  picked: boolean;
  fav: boolean;
  label: string;
  fileName: string;
  mimeType: string;
};

export type PublicPhotoLookup =
  | { kind: "slug"; slug: string }
  | { kind: "shareToken"; shareToken: string };

function photoSelectionPhotoApiPath(lookup: PublicPhotoLookup, photoId: string) {
  const enc = encodeURIComponent;
  const tail = `/photo-selection/photos/${enc(photoId)}`;
  if (lookup.kind === "slug") {
    return `/api/public/photos/${enc(lookup.slug)}${tail}`;
  }
  return `/api/public/projects/${enc(lookup.shareToken)}${tail}`;
}

type Props = {
  subheading: string;
  loading: boolean;
  error: string | null;
  publicLookup: PublicPhotoLookup;
  /** Bearer from `/verify-pin` when the selection uses a PIN (slug or share link). */
  accessToken?: string | null;
  /** Studio display name from the owning account (public API). */
  studioName?: string;
  projectName: string;
  tabs: PublicSelectionTab[];
  photos: PublicSelectionPhoto[];
};

const ALL_TAB_ID = "__all__";

const shimmerBar =
  "bg-gradient-to-r from-stone-200 via-stone-50 to-stone-200 bg-[length:200%_100%] animate-shimmer";

function sanitizeFilename(name: string) {
  const safe = name.replace(/[/\\?%*:|"<>]/g, "-").trim();
  return safe || "photo";
}

function triggerDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function PublicPhotoSelectionScreen({
  subheading,
  loading,
  error,
  publicLookup,
  accessToken = null,
  studioName = "",
  projectName,
  tabs,
  photos,
}: Props) {
  const [activeTabId, setActiveTabId] = useState<string>(ALL_TAB_ID);
  const [lightboxPhotoId, setLightboxPhotoId] = useState<string | null>(null);
  const [selectedById, setSelectedById] = useState<Record<string, boolean>>({});
  const [favById, setFavById] = useState<Record<string, boolean>>({});
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState<"original" | "optimized" | null>(null);

  useEffect(() => {
    setSelectedById(
      Object.fromEntries(photos.map((photo) => [photo.id, Boolean(photo.picked)]))
    );
    setFavById(Object.fromEntries(photos.map((photo) => [photo.id, Boolean(photo.fav)])));
  }, [photos]);

  const visiblePhotos = useMemo(() => {
    if (activeTabId === ALL_TAB_ID) return photos;
    return photos.filter((photo) => photo.tabId === activeTabId);
  }, [activeTabId, photos]);

  const selectedCount = useMemo(
    () => photos.filter((p) => selectedById[p.id]).length,
    [photos, selectedById]
  );

  const lightboxPhoto = lightboxPhotoId ? photos.find((p) => p.id === lightboxPhotoId) ?? null : null;
  useEffect(() => {
    if (!lightboxPhoto) setDownloadMenuOpen(false);
  }, [lightboxPhoto]);

  const toggleSelected = (photoId: string) => {
    const nextPicked = !selectedById[photoId];
    setSelectedById((prev) => ({ ...prev, [photoId]: nextPicked }));
    void apiFetch(photoSelectionPhotoApiPath(publicLookup, photoId), {
      method: "PATCH",
      body: { picked: nextPicked },
      token: accessToken || null,
    }).catch(() => {
      setSelectedById((prev) => ({ ...prev, [photoId]: !nextPicked }));
      window.alert("Failed to save selection. Please try again.");
    });
  };

  const toggleFav = (photoId: string) => {
    const nextFav = !favById[photoId];
    setFavById((prev) => ({ ...prev, [photoId]: nextFav }));
    void apiFetch(photoSelectionPhotoApiPath(publicLookup, photoId), {
      method: "PATCH",
      body: { fav: nextFav },
      token: accessToken || null,
    }).catch(() => {
      setFavById((prev) => ({ ...prev, [photoId]: !nextFav }));
      window.alert("Failed to save favourite. Please try again.");
    });
  };

  const downloadPhoto = async (kind: "original" | "optimized") => {
    if (!lightboxPhoto) return;
    const idKey = publicLookup.kind === "slug" ? publicLookup.slug : publicLookup.shareToken;
    if (!idKey) return;
    setDownloadBusy(kind);
    setDownloadMenuOpen(false);
    try {
      const path = `${photoSelectionPhotoApiPath(publicLookup, lightboxPhoto.id)}/download?variant=${kind}`;
      const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
      const headers: Record<string, string> = {};
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const text = await res.text();
        let msg = "Download failed";
        try {
          const j = JSON.parse(text) as { message?: string };
          if (j?.message) msg = j.message;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      triggerDownload(objectUrl);
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Download failed");
    } finally {
      setDownloadBusy(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f7f4ef] antialiased text-stone-900">
      <section className="border-b border-black/5 bg-gradient-to-b from-[#faf6ef] to-[#f7f4ef] px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="space-y-4">
              <div className={`h-2.5 w-40 rounded-md ${shimmerBar}`} />
              <div className={`h-9 max-w-md rounded-lg sm:h-10 ${shimmerBar}`} />
              <div className={`h-3 w-48 rounded-md ${shimmerBar}`} />
            </div>
          ) : (
            <div>
              {studioName.trim() ? (
                <p className="mb-3 text-sm font-semibold tracking-wide text-stone-800 sm:text-base">
                  {studioName.trim()}
                </p>
              ) : null}
              <h1 className={studioName.trim() ? "mt-0 text-3xl font-display sm:text-4xl" : "text-3xl font-display sm:text-4xl"}>
                {projectName || "Gallery"}
              </h1>
              {subheading.trim() ? (
                <p className="mt-2 max-w-2xl text-sm text-stone-600 sm:text-base">{subheading}</p>
              ) : null}
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
                {selectedCount} selected · {photos.length} photos
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-10 shrink-0 rounded-full ${shimmerBar} ${i === 0 ? "w-28" : "w-20"}`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={`aspect-[4/5] rounded-2xl ${shimmerBar}`} />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm text-red-800 sm:text-base">{error}</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setActiveTabId(ALL_TAB_ID)}
                  className={[
                    "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                    activeTabId === ALL_TAB_ID
                      ? "bg-stone-900 text-white"
                      : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50",
                  ].join(" ")}
                >
                  All photos
                </button>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    className={[
                      "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                      activeTabId === tab.id
                        ? "bg-stone-900 text-white"
                        : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {visiblePhotos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white/80 p-8 text-center text-sm text-stone-600">
                  No photos in this section yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {visiblePhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100"
                    >
                      <button
                        type="button"
                        onClick={() => setLightboxPhotoId(photo.id)}
                        className="absolute inset-0"
                        aria-label={`Open ${photo.label}`}
                      >
                        <Image
                          src={photo.url}
                          alt={photo.label}
                          fill
                          sizes="(max-width: 768px) 50vw, 220px"
                          className="object-cover"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                      </button>
                      <span className="pointer-events-none absolute bottom-2 left-2 max-w-[70%] truncate rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white">
                        {photo.label}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFav(photo.id);
                        }}
                        className={[
                          "absolute left-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow ring-1 ring-stone-200/90 transition hover:bg-white",
                          favById[photo.id] ? "text-rose-600" : "text-stone-400 hover:text-rose-500",
                        ].join(" ")}
                        aria-label={favById[photo.id] ? "Remove from favourites" : "Add to favourites"}
                      >
                        <Heart
                          className={["h-4 w-4", favById[photo.id] ? "fill-current" : ""].join(" ")}
                          strokeWidth={1.75}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelected(photo.id);
                        }}
                        className={[
                          "absolute right-2 top-2 z-10 inline-flex h-8 items-center rounded-full px-2.5 text-[11px] font-semibold shadow",
                          selectedById[photo.id]
                            ? "bg-white text-stone-900"
                            : "bg-stone-900 text-white",
                        ].join(" ")}
                      >
                        {selectedById[photo.id] ? (
                          <>
                            <Check className="mr-1 h-3.5 w-3.5" strokeWidth={2.5} />
                            Selected
                          </>
                        ) : (
                          "Select"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {lightboxPhoto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close photo"
            className="absolute inset-0 bg-black/85"
            onClick={() => setLightboxPhotoId(null)}
          />
          <div className="relative z-10 w-full max-w-5xl">
            <div className="mb-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  if (lightboxPhoto) toggleFav(lightboxPhoto.id);
                }}
                className={[
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20",
                  lightboxPhoto && favById[lightboxPhoto.id] ? "text-rose-400" : "text-white/90",
                ].join(" ")}
                aria-label={
                  lightboxPhoto && favById[lightboxPhoto.id] ? "Remove from favourites" : "Add to favourites"
                }
              >
                <Heart
                  className={["h-5 w-5", lightboxPhoto && favById[lightboxPhoto.id] ? "fill-current" : ""].join(" ")}
                  strokeWidth={1.75}
                />
              </button>
              <div className="relative">
                <button
                  type="button"
                  disabled={downloadBusy !== null}
                  onClick={() => setDownloadMenuOpen((open) => !open)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 text-sm font-semibold text-white hover:bg-white/20 disabled:opacity-60"
                >
                  <Download className="h-4 w-4" strokeWidth={2} />
                  {downloadBusy ? "Preparing..." : "Download"}
                  <ChevronDown className={["h-4 w-4 transition", downloadMenuOpen ? "rotate-180" : ""].join(" ")} strokeWidth={2} />
                </button>
                {downloadMenuOpen ? (
                  <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-white/20 bg-black/90 p-1.5 shadow-xl backdrop-blur">
                    <button
                      type="button"
                      onClick={() => void downloadPhoto("original")}
                      className="flex w-full flex-col rounded-lg px-3 py-2 text-left text-white hover:bg-white/10"
                    >
                      <span className="text-sm font-semibold">Original</span>
                      <span className="text-xs text-white/65">Best quality, larger size</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void downloadPhoto("optimized")}
                      className="mt-1 flex w-full flex-col rounded-lg px-3 py-2 text-left text-white hover:bg-white/10"
                    >
                      <span className="text-sm font-semibold">Optimized</span>
                      <span className="text-xs text-white/65">Smaller web-friendly file</span>
                    </button>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setLightboxPhotoId(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-white/20">
              <div className="relative h-[70vh] w-full">
                <Image src={lightboxPhoto.url} alt={lightboxPhoto.label} fill sizes="100vw" className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="mt-auto border-t border-stone-200/70 bg-[#efece4] px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs text-stone-500 sm:text-sm">
            Powered by{" "}
            <Link
              href="https://invyto.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-stone-700 underline-offset-2 hover:underline"
            >
              invyto.in
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
