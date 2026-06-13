"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import PublicAlbumScreen from "@/components/client/PublicAlbumScreen";
import PublicPhotoSelectionScreen, {
  ALL_TAB_ID,
  SELECTED_TAB_ID,
} from "@/components/client/PublicPhotoSelectionScreen";
import { apiFetch } from "@/utils/api";
import type { DigitalAlbumTemplatePreviewConfig } from "@/utils/digitalAlbumTemplates";
import { DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID } from "@/utils/digitalAlbumTemplates";
import { galleryTabsFromAlbumContent } from "@/utils/publicAlbumGalleryTabs";
import { highlightsFromAlbumContent } from "@/utils/publicAlbumHighlights";
import type {
  PublicAlbumGalleryTab,
  PublicAlbumHighlightItem,
} from "@/components/client/PublicAlbumScreen";

const PUBLIC_PHOTO_SELECTION_PAGE_LIMIT = 30;

type SelectionPhoto = {
  id: string;
  thumbUrl: string | null;
  url: string;
  originalUrl: string | null;
  tabId: string | null;
  picked: boolean;
  fav: boolean;
  label: string;
  fileName: string;
  mimeType: string;
};

type SharePayload = {
  project?: { name?: string; studioName?: string };
  template: any;
  images: Array<{ id: string; url: string; originalUrl?: string }>;
  bannerHero?: { desktopPosition?: string; mobilePosition?: string };
  albumContent?: {
    galleryTabs?: Array<{
      id?: string;
      label?: string;
      images?: Array<{ url?: string }>;
    }>;
    highlights?: Array<{ id?: string; url?: string }>;
  };
  photoSelection?: {
    published?: boolean;
    clientTabs?: Array<{ id?: string; label?: string }>;
    photos?: Array<{
      id?: string;
      thumbUrl?: string;
      url?: string;
      originalUrl?: string;
      tabId?: string | null;
      picked?: boolean;
      fav?: boolean;
      originalName?: string;
      mimeType?: string;
    }>;
  };
  photoSelectionPage?: {
    cursor?: string;
    nextCursor?: string | null;
    hasMore?: boolean;
    limit?: number;
    total?: number;
  };
};

type PublicPhotoSelectionStatsPayload = {
  photoSelectionStats?: {
    totalPhotos?: number;
    selectedPhotos?: number;
  };
};

function storageKeyForShareToken(token: string) {
  return `invyto-photo-sel-access:share:${encodeURIComponent(token)}`;
}

export default function ShareAlbumPage() {
  const params = useParams<{ shareToken: string }>();

  const shareToken = useMemo(() => {
    const v = params?.shareToken;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [template, setTemplate] =
    useState<DigitalAlbumTemplatePreviewConfig | null>(null);
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
  const [albumGalleryTabs, setAlbumGalleryTabs] = useState<
    PublicAlbumGalleryTab[] | null
  >(null);
  const [albumHighlights, setAlbumHighlights] = useState<
    PublicAlbumHighlightItem[]
  >([]);
  const [selectionProjectName, setSelectionProjectName] = useState("");
  const [selectionStudioName, setSelectionStudioName] = useState("");
  const [selectionTabs, setSelectionTabs] = useState<
    Array<{ id: string; label: string }>
  >([]);
  const [isPhotoSelectionShare, setIsPhotoSelectionShare] = useState(false);
  const [selectionPhotos, setSelectionPhotos] = useState<SelectionPhoto[]>([]);
  const [selectionActiveTabId, setSelectionActiveTabId] =
    useState<string>(ALL_TAB_ID);
  const [selectionNextCursor, setSelectionNextCursor] = useState<string | null>(
    null,
  );
  const [selectionHasMore, setSelectionHasMore] = useState(false);
  const [selectionLoadingMore, setSelectionLoadingMore] = useState(false);
  const [selectionTotalPhotos, setSelectionTotalPhotos] = useState<
    number | null
  >(null);
  const [selectionSelectedPhotos, setSelectionSelectedPhotos] = useState<
    number | null
  >(null);

  const [selectionAccessToken, setSelectionAccessToken] = useState("");
  const [selectionPinGate, setSelectionPinGate] = useState(false);
  const [selectionPinInput, setSelectionPinInput] = useState("");
  const [selectionPinBusy, setSelectionPinBusy] = useState(false);
  const [selectionPinError, setSelectionPinError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!shareToken) return;
    const stored =
      typeof window !== "undefined"
        ? sessionStorage.getItem(storageKeyForShareToken(shareToken))
        : "";
    setSelectionAccessToken(stored || "");
    setSelectionPinGate(false);
    setSelectionPinInput("");
    setSelectionPinError(null);
    setSelectionActiveTabId(ALL_TAB_ID);
  }, [shareToken]);

  const selectionRequestPath = useCallback(
    (cursor?: string | null) => {
      const qs = new URLSearchParams();
      qs.set("limit", String(PUBLIC_PHOTO_SELECTION_PAGE_LIMIT));
      if (cursor) qs.set("cursor", cursor);
      if (selectionActiveTabId === SELECTED_TAB_ID) {
        qs.set("tabId", SELECTED_TAB_ID);
      } else if (selectionActiveTabId !== ALL_TAB_ID) {
        qs.set("tabId", selectionActiveTabId);
      }
      return `/api/public/projects/${encodeURIComponent(shareToken || "")}?${qs.toString()}`;
    },
    [shareToken, selectionActiveTabId],
  );

  const selectionStatsPath = useCallback(
    () =>
      `/api/public/projects/${encodeURIComponent(shareToken || "")}/photo-selection/stats`,
    [shareToken],
  );

  const mapSelectionPhotos = useCallback(
    (
      rows: NonNullable<SharePayload["photoSelection"]>["photos"] | undefined,
    ): SelectionPhoto[] =>
      (rows ?? [])
        .map((img, idx) => ({
          id: String(img?.id ?? `ps-${idx}`),
          thumbUrl:
            typeof img?.thumbUrl === "string" && img.thumbUrl
              ? img.thumbUrl
              : null,
          url: String(img?.url ?? ""),
          originalUrl:
            typeof img?.originalUrl === "string" && img.originalUrl
              ? img.originalUrl
              : null,
          tabId: typeof img?.tabId === "string" ? img.tabId : null,
          picked: Boolean(img?.picked),
          fav: Boolean(img?.fav),
          label: String(img?.originalName ?? img?.id ?? `Photo ${idx + 1}`),
          fileName: String(img?.originalName ?? ""),
          mimeType: String(img?.mimeType ?? ""),
        }))
        .filter((img) => img.url),
    [],
  );

  const applySelectionPayload = useCallback(
    (data: SharePayload, mode: "replace" | "append" = "replace") => {
      const incomingPhotos = mapSelectionPhotos(data.photoSelection?.photos);

      setSelectionProjectName(String(data.project?.name ?? "Photo selection"));
      setSelectionStudioName(String(data.project?.studioName ?? "").trim());
      const declaredTabs = (data.photoSelection?.clientTabs ?? [])
        .filter((tab) => typeof tab?.id === "string")
        .map((tab, idx) => ({
          id: String(tab?.id),
          label: String(tab?.label ?? `Tab ${idx + 1}`),
        }));
      if (declaredTabs.length > 0) {
        setSelectionTabs(declaredTabs);
        if (mode === "replace") {
          setSelectionActiveTabId((prev) => {
            if (prev === ALL_TAB_ID) return ALL_TAB_ID;
            if (prev === SELECTED_TAB_ID) return SELECTED_TAB_ID;
            if (declaredTabs.some((tab) => tab.id === prev)) return prev;
            return declaredTabs[0]!.id;
          });
        }
      } else {
        const inferredIncomingTabIds = Array.from(
          new Set(
            incomingPhotos
              .map((photo) => photo.tabId)
              .filter(
                (tabId): tabId is string =>
                  typeof tabId === "string" && tabId.length > 0,
              ),
          ),
        );
        setSelectionTabs((prev) => {
          const ids = Array.from(
            new Set([...prev.map((tab) => tab.id), ...inferredIncomingTabIds]),
          );
          return ids.map((id, idx) => {
            const existing = prev.find((tab) => tab.id === id);
            return existing ?? { id, label: `Tab ${idx + 1}` };
          });
        });
        if (mode === "replace") {
          const firstInferredTabId =
            inferredIncomingTabIds.length > 0 ? inferredIncomingTabIds[0] : "";
          setSelectionActiveTabId((prev) => {
            if (prev === ALL_TAB_ID) return ALL_TAB_ID;
            if (prev === SELECTED_TAB_ID) return SELECTED_TAB_ID;
            if (inferredIncomingTabIds.includes(String(prev))) return prev;
            return firstInferredTabId || ALL_TAB_ID;
          });
        }
      }

      setSelectionPhotos((prev) => {
        if (mode === "replace") return incomingPhotos;
        const indexById = new Map(prev.map((photo, idx) => [photo.id, idx]));
        const next = [...prev];
        incomingPhotos.forEach((photo) => {
          const existingIdx = indexById.get(photo.id);
          if (typeof existingIdx === "number") {
            next[existingIdx] = { ...next[existingIdx], ...photo };
          } else {
            indexById.set(photo.id, next.length);
            next.push(photo);
          }
        });
        return next;
      });

      setSelectionNextCursor(
        typeof data.photoSelectionPage?.nextCursor === "string"
          ? data.photoSelectionPage.nextCursor
          : null,
      );
      setSelectionHasMore(Boolean(data.photoSelectionPage?.hasMore));
    },
    [mapSelectionPhotos],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!shareToken) return;
      setLoading(true);
      setError(null);
      setAlbumTitle("Digital Album");
      setAlbumStudioName("");
      setAlbumImageAssets([]);
      setAlbumBannerHero(null);
      setAlbumGalleryTabs(null);
      setAlbumHighlights([]);
      setSelectionStudioName("");
      setSelectionTabs([]);
      setSelectionPhotos([]);
      setSelectionNextCursor(null);
      setSelectionHasMore(false);
      setSelectionLoadingMore(false);
      setSelectionTotalPhotos(null);
      setSelectionSelectedPhotos(null);

      try {
        const data = await apiFetch<SharePayload>(selectionRequestPath(), {
          token: selectionAccessToken || null,
        });

        if (cancelled) return;
        const tpl = data.template;
        const imageAssets = (data.images ?? [])
          .map((img) => ({
            id: String(img?.id ?? ""),
            src: String(img?.url ?? ""),
            originalSrc:
              typeof img?.originalUrl === "string" &&
              img.originalUrl.trim().length > 0
                ? img.originalUrl
                : null,
          }))
          .filter((img) => img.id.length > 0 && img.src.length > 0);
        const imageUrls = imageAssets.map((img) => img.src);
        const firstSelectionRows = mapSelectionPhotos(
          data.photoSelection?.photos,
        );
        const photoSelectionUrls = firstSelectionRows.map((img) => img.url);
        const mergedImages =
          imageUrls.length > 0 ? imageUrls : photoSelectionUrls;

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
        setIsPhotoSelectionShare(Boolean(data.photoSelection));
        if (data.photoSelection) {
          applySelectionPayload(data, "replace");
          try {
            const stats = await apiFetch<PublicPhotoSelectionStatsPayload>(
              selectionStatsPath(),
              { token: selectionAccessToken || null },
            );
            if (!cancelled) {
              setSelectionTotalPhotos(
                typeof stats.photoSelectionStats?.totalPhotos === "number"
                  ? stats.photoSelectionStats.totalPhotos
                  : null,
              );
              setSelectionSelectedPhotos(
                typeof stats.photoSelectionStats?.selectedPhotos === "number"
                  ? stats.photoSelectionStats.selectedPhotos
                  : null,
              );
            }
          } catch {
            if (!cancelled) {
              setSelectionTotalPhotos(null);
              setSelectionSelectedPhotos(null);
            }
          }
        } else {
          setSelectionTabs([]);
          setSelectionPhotos([]);
          setSelectionNextCursor(null);
          setSelectionHasMore(false);
          setSelectionTotalPhotos(null);
          setSelectionSelectedPhotos(null);
        }
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
                previewVariant: Number(
                  tpl.previewVariant ?? 1,
                ) as DigitalAlbumTemplatePreviewConfig["previewVariant"],
              }
            : mergedImages.length > 0
              ? {
                  id: DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID,
                  title: String(data.project?.name ?? "Shared Gallery"),
                  subtitle: "A cherished collection",
                  category: "wedding",
                  gradient: "from-[#1c1410] to-[#f7f2e9]",
                  coverSrc: mergedImages[0]!,
                  coverAlt: String(
                    data.project?.name ?? "Shared gallery cover",
                  ),
                  thumbs: mergedImages.slice(0, 4),
                  footerText: "Crafted on Invyto",
                  previewVariant: 1,
                }
              : null,
        );
        setImages(mergedImages);
        setAlbumImageAssets(imageAssets);
        setSelectionPinGate(false);
        setSelectionPinError(null);
      } catch (err) {
        if (cancelled) return;
        const e = err as Error & { pinRequired?: boolean };
        if (e.pinRequired) {
          setIsPhotoSelectionShare(true);
          setSelectionPinGate(true);
          setSelectionPinError(null);
          if (typeof window !== "undefined")
            sessionStorage.removeItem(storageKeyForShareToken(shareToken));
          setSelectionAccessToken("");
          setSelectionTotalPhotos(null);
          setSelectionSelectedPhotos(null);
        } else {
          setError(e instanceof Error ? e.message : "Failed to load share");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [
    shareToken,
    selectionAccessToken,
    selectionRequestPath,
    selectionStatsPath,
    mapSelectionPhotos,
    applySelectionPayload,
    selectionActiveTabId,
  ]);

  const submitSelectionPin = useCallback(async () => {
    if (!shareToken) return;
    const pin = selectionPinInput.trim();
    if (!/^\d{4,8}$/.test(pin)) {
      setSelectionPinError("Enter a 4–8 digit PIN.");
      return;
    }
    setSelectionPinBusy(true);
    setSelectionPinError(null);
    try {
      const res = await apiFetch<{ accessToken?: string }>(
        `/api/public/projects/${encodeURIComponent(shareToken)}/verify-pin`,
        { method: "POST", body: { pin } },
      );
      const tok = typeof res?.accessToken === "string" ? res.accessToken : "";
      if (!tok) {
        setSelectionPinError("Unexpected response. Try again.");
        return;
      }
      sessionStorage.setItem(storageKeyForShareToken(shareToken), tok);
      setSelectionAccessToken(tok);
      setSelectionPinGate(false);
      setSelectionPinInput("");
    } catch (e) {
      setSelectionPinError(
        e instanceof Error ? e.message : "Could not verify PIN",
      );
    } finally {
      setSelectionPinBusy(false);
    }
  }, [shareToken, selectionPinInput]);

  const loadMoreSelectionPhotos = useCallback(async () => {
    if (
      !isPhotoSelectionShare ||
      !selectionHasMore ||
      !selectionNextCursor ||
      selectionLoadingMore
    )
      return;
    setSelectionLoadingMore(true);
    try {
      const data = await apiFetch<SharePayload>(
        selectionRequestPath(selectionNextCursor),
        {
          token: selectionAccessToken || null,
        },
      );
      applySelectionPayload(data, "append");
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "Failed to load more photos",
      );
    } finally {
      setSelectionLoadingMore(false);
    }
  }, [
    isPhotoSelectionShare,
    selectionHasMore,
    selectionNextCursor,
    selectionLoadingMore,
    selectionRequestPath,
    selectionAccessToken,
    applySelectionPayload,
  ]);

  const onSelectedCountDelta = useCallback((delta: number) => {
    setSelectionSelectedPhotos((prev) => {
      if (typeof prev !== "number") return prev;
      return Math.max(0, prev + delta);
    });
  }, []);

  if (isPhotoSelectionShare && selectionPinGate && shareToken) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] antialiased text-stone-900">
        <section className="mx-auto flex max-w-md flex-col gap-4 px-4 py-16 sm:px-6">
          <h1 className="font-display text-2xl text-stone-900">PIN required</h1>
          <p className="text-sm text-stone-600">
            This gallery is protected. Enter the PIN your photographer shared
            with you.
          </p>
          <div>
            <label
              htmlFor="share-sel-pin"
              className="text-sm font-semibold text-stone-800"
            >
              PIN
            </label>
            <input
              id="share-sel-pin"
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              value={selectionPinInput}
              onChange={(e) =>
                setSelectionPinInput(
                  e.target.value.replace(/\D/g, "").slice(0, 8),
                )
              }
              className="mt-2 h-12 w-full rounded-xl border border-stone-200 bg-white px-3 text-lg tracking-widest text-stone-900 outline-none ring-stone-900/10 focus:ring-4"
              placeholder="••••"
            />
          </div>
          {selectionPinError ? (
            <p className="text-sm text-red-700">{selectionPinError}</p>
          ) : null}
          <button
            type="button"
            disabled={selectionPinBusy}
            onClick={() => void submitSelectionPin()}
            className="h-12 rounded-xl bg-stone-900 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
          >
            {selectionPinBusy ? "Checking…" : "Continue"}
          </button>
        </section>
      </main>
    );
  }

  return isPhotoSelectionShare ? (
    <PublicPhotoSelectionScreen
      subheading=""
      loading={loading}
      error={error}
      publicLookup={{ kind: "shareToken", shareToken: shareToken || "" }}
      accessToken={selectionAccessToken || null}
      studioName={selectionStudioName}
      projectName={selectionProjectName}
      tabs={selectionTabs}
      photos={selectionPhotos}
      activeTabId={selectionActiveTabId}
      onTabChange={setSelectionActiveTabId}
      hasMorePhotos={selectionHasMore}
      loadingMorePhotos={selectionLoadingMore}
      onLoadMorePhotos={loadMoreSelectionPhotos}
      totalPhotoCount={selectionTotalPhotos}
      selectedPhotoCount={selectionSelectedPhotos}
      onSelectedCountDelta={onSelectedCountDelta}
    />
  ) : (
    <PublicAlbumScreen
      title={albumTitle}
      studioName={albumStudioName}
      subtitle=""
      loading={loading}
      error={error}
      template={template}
      images={images}
      imageAssets={albumImageAssets}
      albumDownloadLookup={{ kind: "shareToken", value: shareToken || "" }}
      bannerHero={albumBannerHero}
      galleryTabs={albumGalleryTabs}
      highlights={albumHighlights}
    />
  );
}
