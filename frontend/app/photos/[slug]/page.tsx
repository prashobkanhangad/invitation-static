"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import PublicPhotoSelectionScreen, {
  ALL_TAB_ID,
  SELECTED_TAB_ID,
} from "@/components/client/PublicPhotoSelectionScreen";
import { apiFetch } from "@/utils/api";

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

type PublicPhotoSelectionPayload = {
  project?: { name?: string; studioName?: string };
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

function storageKeyForSlug(slug: string) {
  return `invyto-photo-sel-access:slug:${encodeURIComponent(slug)}`;
}

function extractDeclaredTabs(data: PublicPhotoSelectionPayload) {
  return (data.photoSelection?.clientTabs ?? [])
    .filter((tab) => typeof tab?.id === "string")
    .map((tab, idx) => ({
      id: String(tab?.id),
      label: String(tab?.label ?? `Tab ${idx + 1}`),
    }));
}

function resolveFirstTabId(
  data: PublicPhotoSelectionPayload,
  declaredTabs: Array<{ id: string; label: string }>,
) {
  if (declaredTabs.length > 0) return declaredTabs[0]!.id;
  const inferred = Array.from(
    new Set(
      (data.photoSelection?.photos ?? [])
        .map((photo) => photo?.tabId)
        .filter(
          (tabId): tabId is string =>
            typeof tabId === "string" && tabId.length > 0,
        ),
    ),
  );
  return inferred[0] ?? ALL_TAB_ID;
}

function buildSelectionPath(
  slug: string,
  tabId: string,
  cursor?: string | null,
  limit = PUBLIC_PHOTO_SELECTION_PAGE_LIMIT,
) {
  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  if (cursor) qs.set("cursor", cursor);
  if (tabId === SELECTED_TAB_ID) {
    qs.set("tabId", SELECTED_TAB_ID);
  } else if (tabId !== ALL_TAB_ID) {
    qs.set("tabId", tabId);
  }
  return `/api/public/photos/${encodeURIComponent(slug)}?${qs.toString()}`;
}

export default function PublicPhotoSelectionPage() {
  const params = useParams<{ slug: string }>();

  const slug = useMemo(() => {
    const v = params?.slug;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pinGate, setPinGate] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [pinBusy, setPinBusy] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const [selectionProjectName, setSelectionProjectName] = useState("");
  const [selectionStudioName, setSelectionStudioName] = useState("");
  const [selectionTabs, setSelectionTabs] = useState<
    Array<{ id: string; label: string }>
  >([]);
  const [selectionPhotos, setSelectionPhotos] = useState<SelectionPhoto[]>([]);
  const [selectionActiveTabId, setSelectionActiveTabId] = useState<string>(
    ALL_TAB_ID,
  );
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

  useEffect(() => {
    if (!slug || !String(slug).trim()) return;
    const stored =
      typeof window !== "undefined"
        ? sessionStorage.getItem(storageKeyForSlug(slug))
        : "";
    setAccessToken(stored || "");
    setPinGate(false);
    setPinInput("");
    setPinError(null);
  }, [slug]);

  const applyPayload = useCallback(
    (
      data: PublicPhotoSelectionPayload,
      mode: "replace" | "append" = "replace",
    ) => {
      const incomingPhotos: SelectionPhoto[] = (
        data.photoSelection?.photos ?? []
      )
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
        .filter((img) => img.url);

      setSelectionProjectName(String(data.project?.name ?? "Photo selection"));
      setSelectionStudioName(String(data.project?.studioName ?? "").trim());

      const declaredTabs = extractDeclaredTabs(data);
      if (declaredTabs.length > 0) {
        setSelectionTabs(declaredTabs);
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
        if (inferredIncomingTabIds.length > 0) {
          setSelectionTabs((prev) => {
            const ids = Array.from(
              new Set([...prev.map((tab) => tab.id), ...inferredIncomingTabIds]),
            );
            return ids.map((id, idx) => {
              const existing = prev.find((tab) => tab.id === id);
              return existing ?? { id, label: `Tab ${idx + 1}` };
            });
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
    [],
  );

  const selectionStatsPath = useCallback(
    () =>
      `/api/public/photos/${encodeURIComponent(slug || "")}/photo-selection/stats`,
    [slug],
  );

  const loadStats = useCallback(async () => {
    try {
      const stats = await apiFetch<PublicPhotoSelectionStatsPayload>(
        selectionStatsPath(),
        { token: accessToken || null },
      );
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
    } catch {
      setSelectionTotalPhotos(null);
      setSelectionSelectedPhotos(null);
    }
  }, [accessToken, selectionStatsPath]);

  const loadPhotosForTab = useCallback(
    async (tabId: string, mode: "replace" | "append" = "replace") => {
      if (!slug || !String(slug).trim()) return;

      if (mode === "replace") {
        setLoading(true);
        setError(null);
        setSelectionPhotos([]);
        setSelectionHasMore(false);
        setSelectionNextCursor(null);
        setSelectionLoadingMore(false);
      }

      try {
        const data = await apiFetch<PublicPhotoSelectionPayload>(
          buildSelectionPath(slug, tabId),
          { token: accessToken || null },
        );
        applyPayload(data, mode);
        if (mode === "replace") {
          await loadStats();
        }
        setPinGate(false);
        setPinError(null);
      } catch (err) {
        const e = err as Error & { pinRequired?: boolean };
        if (e.pinRequired) {
          setPinGate(true);
          setPinError(null);
          if (typeof window !== "undefined")
            sessionStorage.removeItem(storageKeyForSlug(slug));
          setAccessToken("");
          setSelectionTotalPhotos(null);
          setSelectionSelectedPhotos(null);
        } else {
          setError(
            e instanceof Error ? e.message : "Failed to load photo selection",
          );
          setPinGate(false);
        }
      } finally {
        if (mode === "replace") setLoading(false);
      }
    },
    [slug, accessToken, applyPayload, loadStats],
  );

  useEffect(() => {
    if (!slug || !String(slug).trim()) {
      setError("Invalid link");
      setLoading(false);
      setPinGate(false);
      return;
    }

    let cancelled = false;

    async function initGallery() {
      setLoading(true);
      setError(null);
      setSelectionStudioName("");
      setSelectionProjectName("");
      setSelectionPhotos([]);
      setSelectionTabs([]);
      setSelectionHasMore(false);
      setSelectionNextCursor(null);
      setSelectionLoadingMore(false);
      setSelectionTotalPhotos(null);
      setSelectionSelectedPhotos(null);

      try {
        const peek = await apiFetch<PublicPhotoSelectionPayload>(
          buildSelectionPath(slug!, ALL_TAB_ID, null, 1),
          { token: accessToken || null },
        );
        if (cancelled) return;

        const tabs = extractDeclaredTabs(peek);
        const firstTabId = resolveFirstTabId(peek, tabs);
        setSelectionTabs(tabs);
        setSelectionActiveTabId(firstTabId);

        const data = await apiFetch<PublicPhotoSelectionPayload>(
          buildSelectionPath(slug!, firstTabId),
          { token: accessToken || null },
        );
        if (cancelled) return;

        applyPayload(data, "replace");
        await loadStats();
        setPinGate(false);
        setPinError(null);
      } catch (err) {
        if (cancelled) return;
        const e = err as Error & { pinRequired?: boolean };
        if (e.pinRequired) {
          setPinGate(true);
          setPinError(null);
          if (typeof window !== "undefined")
            sessionStorage.removeItem(storageKeyForSlug(slug!));
          setAccessToken("");
          setSelectionTotalPhotos(null);
          setSelectionSelectedPhotos(null);
        } else {
          setError(
            e instanceof Error ? e.message : "Failed to load photo selection",
          );
          setPinGate(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void initGallery();
    return () => {
      cancelled = true;
    };
  }, [slug, accessToken, applyPayload, loadStats]);

  const handleTabChange = useCallback(
    (tabId: string) => {
      setSelectionActiveTabId(tabId);
      void loadPhotosForTab(tabId, "replace");
    },
    [loadPhotosForTab],
  );

  const submitPin = async () => {
    if (!slug?.trim()) return;
    const pin = pinInput.trim();
    if (!/^\d{4,8}$/.test(pin)) {
      setPinError("Enter a 4–8 digit PIN.");
      return;
    }
    setPinBusy(true);
    setPinError(null);
    try {
      const res = await apiFetch<{ accessToken?: string }>(
        `/api/public/photos/${encodeURIComponent(slug)}/verify-pin`,
        { method: "POST", body: { pin } },
      );
      const tok = typeof res?.accessToken === "string" ? res.accessToken : "";
      if (!tok) {
        setPinError("Unexpected response. Try again.");
        return;
      }
      sessionStorage.setItem(storageKeyForSlug(slug), tok);
      setAccessToken(tok);
      setPinGate(false);
      setPinInput("");
    } catch (e) {
      setPinError(e instanceof Error ? e.message : "Could not verify PIN");
    } finally {
      setPinBusy(false);
    }
  };

  const loadMorePhotos = useCallback(async () => {
    if (
      !slug ||
      !selectionHasMore ||
      !selectionNextCursor ||
      selectionLoadingMore
    )
      return;
    setSelectionLoadingMore(true);
    try {
      const data = await apiFetch<PublicPhotoSelectionPayload>(
        buildSelectionPath(slug, selectionActiveTabId, selectionNextCursor),
        { token: accessToken || null },
      );
      applyPayload(data, "append");
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "Failed to load more photos",
      );
    } finally {
      setSelectionLoadingMore(false);
    }
  }, [
    slug,
    selectionHasMore,
    selectionNextCursor,
    selectionLoadingMore,
    selectionActiveTabId,
    accessToken,
    applyPayload,
  ]);

  const onSelectedCountDelta = useCallback((delta: number) => {
    setSelectionSelectedPhotos((prev) => {
      if (typeof prev !== "number") return prev;
      return Math.max(0, prev + delta);
    });
  }, []);

  if (pinGate && slug) {
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
              htmlFor="photo-sel-pin"
              className="text-sm font-semibold text-stone-800"
            >
              PIN
            </label>
            <input
              id="photo-sel-pin"
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              value={pinInput}
              onChange={(e) =>
                setPinInput(e.target.value.replace(/\D/g, "").slice(0, 8))
              }
              className="mt-2 h-12 w-full rounded-xl border border-stone-200 bg-white px-3 text-lg tracking-widest text-stone-900 outline-none ring-stone-900/10 focus:ring-4"
              placeholder="••••"
            />
          </div>
          {pinError ? <p className="text-sm text-red-700">{pinError}</p> : null}
          <button
            type="button"
            disabled={pinBusy}
            onClick={() => void submitPin()}
            className="h-12 rounded-xl bg-stone-900 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
          >
            {pinBusy ? "Checking…" : "Continue"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <PublicPhotoSelectionScreen
      subheading=""
      loading={loading}
      error={error}
      publicLookup={{ kind: "slug", slug: slug || "" }}
      accessToken={accessToken || null}
      studioName={selectionStudioName}
      projectName={selectionProjectName}
      tabs={selectionTabs}
      photos={selectionPhotos}
      activeTabId={selectionActiveTabId}
      onTabChange={handleTabChange}
      hasMorePhotos={selectionHasMore}
      loadingMorePhotos={selectionLoadingMore}
      onLoadMorePhotos={loadMorePhotos}
      totalPhotoCount={selectionTotalPhotos}
      selectedPhotoCount={selectionSelectedPhotos}
      onSelectedCountDelta={onSelectedCountDelta}
    />
  );
}
