"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { ArrowLeft, BookOpen, ChevronRight, Monitor, Pencil, Plus, Smartphone, Trash2, Upload, X } from "lucide-react";
import {
  type DigitalAlbumTemplateId,
  DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID,
  digitalAlbumTemplatePreviews,
} from "@/utils/digitalAlbumTemplates";
import { GhostButton, PageHeader, PrimaryButton, StatusBadge } from "@/components/studio-dashboard/blocks";
import { studioApiFetch } from "@/utils/studioApi";
import {
  uploadAlbumBannerDirect,
  uploadAlbumGalleryTabDirect,
  uploadAlbumHighlightsDirect,
} from "@/utils/studioDirectUpload";

const STUDIO_TABLE_SHIMMER =
  "bg-gradient-to-r from-zinc-200 via-zinc-50 to-zinc-200 bg-[length:200%_100%] animate-shimmer";

const DIGITAL_ALBUM_TEMPLATE = digitalAlbumTemplatePreviews[0]!;

type AlbumStatus = "Draft" | "Proofing" | "Published" | "Delivered";

type StudioAlbumRecord = {
  id: string;
  title: string;
  templateId: DigitalAlbumTemplateId;
  templateTitle: string;
  photoCount: number;
  views: string;
  status: AlbumStatus;
  lastTouchLabel: string;
  slug?: string | null;
  shareToken?: string | null;
};

type WizardStep = "template" | "upload";

type CreateGalleryTab = {
  id: string;
  label: string;
  files: File[];
  previewUrls: string[];
};

function toneForStatus(status: AlbumStatus): "good" | "warn" | "neutral" | "bad" {
  if (status === "Delivered" || status === "Published") return "good";
  if (status === "Proofing") return "warn";
  return "neutral";
}

function parseBannerPercentPair(s: string | undefined): { x: number; y: number } {
  const m = String(s ?? "")
    .trim()
    .match(/^(\d+)\s*%\s+(\d+)\s*%$/);
  if (!m) return { x: 50, y: 50 };
  return {
    x: Math.min(100, Math.max(0, Number(m[1]))),
    y: Math.min(100, Math.max(0, Number(m[2]))),
  };
}

function mapApiAlbumToRow(album: any): StudioAlbumRecord {
  const updatedAt = album?.updatedAt ? new Date(String(album.updatedAt)) : new Date();
  return {
    id: String(album?._id ?? album?.id ?? ""),
    title: String(album?.title ?? "Untitled album"),
    templateId: DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID,
    templateTitle: DIGITAL_ALBUM_TEMPLATE.title,
    photoCount:
      (album?.bannerImage ? 1 : 0) +
      (Array.isArray(album?.highlights) ? album.highlights.length : 0) +
      (Array.isArray(album?.galleryTabs)
        ? album.galleryTabs.reduce(
            (sum: number, t: any) => sum + (Array.isArray(t?.images) ? t.images.length : 0),
            0
          )
        : 0),
    views: "—",
    status: album?.isPublished ? "Published" : "Draft",
    lastTouchLabel: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(updatedAt),
    slug: album?.slug ?? null,
    shareToken: album?.shareToken ?? null,
  };
}

export default function StudioAlbumsSection() {
  const [albums, setAlbums] = useState<StudioAlbumRecord[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [createStep, setCreateStep] = useState<WizardStep>("template");
  const [createTitle, setCreateTitle] = useState("");
  const [createBannerFile, setCreateBannerFile] = useState<File | null>(null);
  const [createBannerPreviewUrl, setCreateBannerPreviewUrl] = useState<string | null>(null);
  /** 0–100 → CSS % for background-position X/Y (laptop vs mobile hero) */
  const [createBannerDeskX, setCreateBannerDeskX] = useState(50);
  const [createBannerDeskY, setCreateBannerDeskY] = useState(50);
  const [createBannerMobX, setCreateBannerMobX] = useState(50);
  const [createBannerMobY, setCreateBannerMobY] = useState(50);
  const [createIncludeHighlights, setCreateIncludeHighlights] = useState(false);
  const [createHighlightsFiles, setCreateHighlightsFiles] = useState<File[]>([]);
  const [createHighlightsPreviewUrls, setCreateHighlightsPreviewUrls] = useState<string[]>([]);
  const [createGalleryTabs, setCreateGalleryTabs] = useState<CreateGalleryTab[]>([
    { id: `tab-${Date.now()}`, label: "Main", files: [], previewUrls: [] },
  ]);
  const [createPublishSubmitting, setCreatePublishSubmitting] = useState(false);
  const [createPublishProgress, setCreatePublishProgress] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<StudioAlbumRecord | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetailLoading, setEditDetailLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editPublishSubmitting, setEditPublishSubmitting] = useState(false);
  /** Full album from GET /api/studio/albums/:id while editing */
  const [editDetailAlbum, setEditDetailAlbum] = useState<any | null>(null);
  const [editBannerFile, setEditBannerFile] = useState<File | null>(null);
  const [editBannerPreviewUrl, setEditBannerPreviewUrl] = useState<string | null>(null);
  const [editBannerDeskX, setEditBannerDeskX] = useState(50);
  const [editBannerDeskY, setEditBannerDeskY] = useState(50);
  const [editBannerMobX, setEditBannerMobX] = useState(50);
  const [editBannerMobY, setEditBannerMobY] = useState(50);
  const [editNewHighlightFiles, setEditNewHighlightFiles] = useState<File[]>([]);
  const [editNewHighlightPreviews, setEditNewHighlightPreviews] = useState<string[]>([]);
  /** tabId -> files to upload on Save */
  const [editPendingGalleryByTab, setEditPendingGalleryByTab] = useState<Record<string, File[]>>({});
  const [copiedAlbumId, setCopiedAlbumId] = useState<string | null>(null);
  const [albumsLoading, setAlbumsLoading] = useState(true);
  const [albumsError, setAlbumsError] = useState<string | null>(null);

  const uploadInputId = useId();
  const createUploadInputId = `${uploadInputId}-create`;
  const editUploadInputId = `${uploadInputId}-edit`;

  useEffect(() => {
    let cancelled = false;
    async function loadAlbums() {
      setAlbumsLoading(true);
      setAlbumsError(null);
      try {
        const data = await studioApiFetch<{ albums: any[] }>("/api/studio/albums");
        if (cancelled) return;
        setAlbums(data.albums.map(mapApiAlbumToRow));
      } catch (e) {
        if (cancelled) return;
        setAlbumsError(e instanceof Error ? e.message : "Failed to load albums");
      } finally {
        if (!cancelled) setAlbumsLoading(false);
      }
    }
    void loadAlbums();
    return () => {
      cancelled = true;
    };
  }, []);

  const resetCreateWizard = useCallback(() => {
    setCreateStep("template");
    setCreateTitle("");
    setCreatePublishSubmitting(false);
    setCreatePublishProgress(0);
    setCreateBannerFile(null);
    setCreateBannerPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setCreateBannerDeskX(50);
    setCreateBannerDeskY(50);
    setCreateBannerMobX(50);
    setCreateBannerMobY(50);
    setCreateIncludeHighlights(false);
    setCreateHighlightsFiles([]);
    setCreateHighlightsPreviewUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return [];
    });
    setCreateGalleryTabs((prev) => {
      prev.forEach((tab) => tab.previewUrls.forEach((u) => URL.revokeObjectURL(u)));
      return [{ id: `tab-${Date.now()}`, label: "Main", files: [], previewUrls: [] }];
    });
  }, []);

  const openCreate = () => {
    resetCreateWizard();
    setCreateOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    resetCreateWizard();
  };

  const selectedCreateTemplate = DIGITAL_ALBUM_TEMPLATE;

  const canContinueFromTemplate = createTitle.trim().length > 0;
  const highlightsSatisfied = !createIncludeHighlights || createHighlightsFiles.length > 0;
  const canPublish = Boolean(
    selectedCreateTemplate &&
      createTitle.trim() &&
      createBannerFile &&
      highlightsSatisfied &&
      createGalleryTabs.some((tab) => tab.files.length > 0)
  );

  const onCreateBannerFile = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    setCreateBannerFile(file);
    setCreateBannerDeskX(50);
    setCreateBannerDeskY(50);
    setCreateBannerMobX(50);
    setCreateBannerMobY(50);
    setCreateBannerPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const onCreateHighlightsFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const next = Array.from(fileList);
    setCreateHighlightsFiles((prev) => [...prev, ...next]);
    const urls = next.map((f) => URL.createObjectURL(f));
    setCreateHighlightsPreviewUrls((prev) => [...prev, ...urls]);
  };

  const removeCreateHighlightAt = (index: number) => {
    setCreateHighlightsFiles((prev) => prev.filter((_, i) => i !== index));
    setCreateHighlightsPreviewUrls((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const addCreateGalleryTab = () => {
    setCreateGalleryTabs((prev) => {
      const nextNo = prev.length + 1;
      return [...prev, { id: `tab-${Date.now()}-${nextNo}`, label: `Tab ${nextNo}`, files: [], previewUrls: [] }];
    });
  };

  const updateCreateGalleryTabLabel = (tabId: string, label: string) => {
    setCreateGalleryTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, label } : tab)));
  };

  const removeCreateGalleryTab = (tabId: string) => {
    setCreateGalleryTabs((prev) => {
      if (prev.length <= 1) return prev;
      const target = prev.find((tab) => tab.id === tabId);
      if (target) target.previewUrls.forEach((u) => URL.revokeObjectURL(u));
      return prev.filter((tab) => tab.id !== tabId);
    });
  };

  const onCreateGalleryTabFiles = (tabId: string, fileList: FileList | null) => {
    if (!fileList?.length) return;
    const nextFiles = Array.from(fileList);
    const nextUrls = nextFiles.map((f) => URL.createObjectURL(f));
    setCreateGalleryTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? { ...tab, files: [...tab.files, ...nextFiles], previewUrls: [...tab.previewUrls, ...nextUrls] }
          : tab
      )
    );
  };

  const removeCreateGalleryTabFileAt = (tabId: string, index: number) => {
    setCreateGalleryTabs((prev) =>
      prev.map((tab) => {
        if (tab.id !== tabId) return tab;
        const url = tab.previewUrls[index];
        if (url) URL.revokeObjectURL(url);
        return {
          ...tab,
          files: tab.files.filter((_, i) => i !== index),
          previewUrls: tab.previewUrls.filter((_, i) => i !== index),
        };
      })
    );
  };

  const publishNewAlbum = async () => {
    if (!canPublish || !createBannerFile || createPublishSubmitting) return;
    setCreatePublishSubmitting(true);
    setCreatePublishProgress(0);
    try {
      const totalUploadBytes =
        createBannerFile.size +
        (createIncludeHighlights ?
          createHighlightsFiles.reduce((sum, file) => sum + file.size, 0)
        : 0) +
        createGalleryTabs.reduce(
          (sum, tab) => sum + tab.files.reduce((tabSum, file) => tabSum + file.size, 0),
          0
        );
      let uploadedBytes = 0;
      const updateProgressWithCurrentBatch = (batchBytes: number, batchPercent: number) => {
        if (totalUploadBytes <= 0) {
          setCreatePublishProgress(100);
          return;
        }
        const current = uploadedBytes + (batchBytes * batchPercent) / 100;
        const overall = Math.min(100, Math.max(0, Math.round((current / totalUploadBytes) * 100)));
        setCreatePublishProgress(overall);
      };
      const markBatchComplete = (batchBytes: number) => {
        uploadedBytes += batchBytes;
        if (totalUploadBytes <= 0) {
          setCreatePublishProgress(100);
          return;
        }
        const overall = Math.min(100, Math.max(0, Math.round((uploadedBytes / totalUploadBytes) * 100)));
        setCreatePublishProgress(overall);
      };

      const created = await studioApiFetch<{ album: any }>("/api/studio/albums", {
        method: "POST",
        body: {
          title: createTitle.trim(),
          templateId: DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID,
        },
      });
      const albumId = String(created.album?._id ?? created.album?.id ?? "");
      if (!albumId) throw new Error("Failed to create album");

      const bannerBytes = createBannerFile.size;
      await uploadAlbumBannerDirect({
        albumId,
        file: createBannerFile,
        api: studioApiFetch,
        onProgress: (percent) => updateProgressWithCurrentBatch(bannerBytes, percent),
      });
      markBatchComplete(bannerBytes);

      await studioApiFetch(`/api/studio/albums/${albumId}`, {
        method: "PATCH",
        body: {
          bannerHeroDesktopPosition: `${Math.round(createBannerDeskX)}% ${Math.round(createBannerDeskY)}%`,
          bannerHeroMobilePosition: `${Math.round(createBannerMobX)}% ${Math.round(createBannerMobY)}%`,
        },
      });

      if (createIncludeHighlights && createHighlightsFiles.length > 0) {
        const highlightBytes = createHighlightsFiles.reduce((sum, file) => sum + file.size, 0);
        await uploadAlbumHighlightsDirect({
          albumId,
          files: createHighlightsFiles,
          api: studioApiFetch,
          onProgress: (percent) => updateProgressWithCurrentBatch(highlightBytes, percent),
        });
        markBatchComplete(highlightBytes);
      }

      for (const tab of createGalleryTabs) {
        if (tab.files.length === 0) continue;
        const createdTab = await studioApiFetch<{ tab: { id: string } }>(`/api/studio/albums/${albumId}/gallery-tabs`, {
          method: "POST",
          body: { label: tab.label.trim() || "Gallery" },
        });
        const tabId = createdTab.tab.id;
        const tabBytes = tab.files.reduce((sum, file) => sum + file.size, 0);
        await uploadAlbumGalleryTabDirect({
          albumId,
          tabId,
          files: tab.files,
          api: studioApiFetch,
          onProgress: (percent) => updateProgressWithCurrentBatch(tabBytes, percent),
        });
        markBatchComplete(tabBytes);
      }

      const published = await studioApiFetch<{ album: any }>(`/api/studio/albums/${albumId}/publish`, {
        method: "POST",
      });
      setCreatePublishProgress(100);

      setAlbums((prev) => [mapApiAlbumToRow(published.album), ...prev]);
      closeCreate();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to publish album");
    } finally {
      setCreatePublishSubmitting(false);
    }
  };

  const resetEditStaging = useCallback(() => {
    setEditBannerFile(null);
    setEditBannerPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setEditNewHighlightFiles([]);
    setEditNewHighlightPreviews((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return [];
    });
    setEditPendingGalleryByTab({});
  }, []);

  const refreshEditAlbum = useCallback(async (albumId: string) => {
    const refreshed = await studioApiFetch<{ album: any }>(`/api/studio/albums/${albumId}`);
    setEditDetailAlbum(refreshed.album);
    return refreshed.album;
  }, []);

  const openEdit = (album: StudioAlbumRecord) => {
    setEditingAlbum(album);
    setEditOpen(true);
    setEditDetailAlbum(null);
    resetEditStaging();
    setEditDetailLoading(true);
    void (async () => {
      try {
        const res = await studioApiFetch<{ album: any }>(`/api/studio/albums/${album.id}`);
        const a = res.album;
        setEditDetailAlbum(a);
        setEditTitle(String(a?.title ?? album.title));
        const desk = parseBannerPercentPair(a?.bannerHeroDesktopPosition);
        const mob = parseBannerPercentPair(a?.bannerHeroMobilePosition);
        setEditBannerDeskX(desk.x);
        setEditBannerDeskY(desk.y);
        setEditBannerMobX(mob.x);
        setEditBannerMobY(mob.y);
      } catch (e) {
        window.alert(e instanceof Error ? e.message : "Failed to load album");
        setEditOpen(false);
        setEditingAlbum(null);
      } finally {
        setEditDetailLoading(false);
      }
    })();
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditingAlbum(null);
    setEditDetailAlbum(null);
    resetEditStaging();
  };

  const onEditBannerFile = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    setEditBannerFile(file);
    setEditBannerPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const onEditNewHighlights = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const next = Array.from(fileList);
    setEditNewHighlightFiles((prev) => [...prev, ...next]);
    const urls = next.map((f) => URL.createObjectURL(f));
    setEditNewHighlightPreviews((prev) => [...prev, ...urls]);
  };

  const removeEditStagedHighlightAt = (index: number) => {
    setEditNewHighlightFiles((prev) => prev.filter((_, i) => i !== index));
    setEditNewHighlightPreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onEditGalleryFilesForTab = (tabId: string, fileList: FileList | null) => {
    if (!fileList?.length) return;
    const next = Array.from(fileList);
    setEditPendingGalleryByTab((prev) => ({
      ...prev,
      [tabId]: [...(prev[tabId] ?? []), ...next],
    }));
  };

  const removeEditPendingGalleryFile = (tabId: string, index: number) => {
    setEditPendingGalleryByTab((prev) => {
      const list = [...(prev[tabId] ?? [])];
      list.splice(index, 1);
      const next = { ...prev };
      if (list.length === 0) delete next[tabId];
      else next[tabId] = list;
      return next;
    });
  };

  const deleteEditImage = async (imageId: string) => {
    if (!editingAlbum) return;
    try {
      await studioApiFetch(`/api/studio/albums/${editingAlbum.id}/images/${encodeURIComponent(imageId)}`, {
        method: "DELETE",
      });
      const album = await refreshEditAlbum(editingAlbum.id);
      setAlbums((prev) => prev.map((r) => (r.id === editingAlbum.id ? mapApiAlbumToRow(album) : r)));
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to remove image");
    }
  };

  const addEditGalleryTab = async () => {
    if (!editingAlbum) return;
    try {
      await studioApiFetch(`/api/studio/albums/${editingAlbum.id}/gallery-tabs`, {
        method: "POST",
        body: { label: `Tab ${(editDetailAlbum?.galleryTabs?.length ?? 0) + 1}` },
      });
      await refreshEditAlbum(editingAlbum.id);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to add tab");
    }
  };

  const deleteEditGalleryTab = async (tabId: string) => {
    if (!editingAlbum) return;
    if (!window.confirm("Remove this gallery tab and its photos from the album?")) return;
    try {
      await studioApiFetch(`/api/studio/albums/${editingAlbum.id}/gallery-tabs/${encodeURIComponent(tabId)}`, {
        method: "DELETE",
      });
      setEditPendingGalleryByTab((prev) => {
        const next = { ...prev };
        delete next[tabId];
        return next;
      });
      const album = await refreshEditAlbum(editingAlbum.id);
      setAlbums((prev) => prev.map((r) => (r.id === editingAlbum.id ? mapApiAlbumToRow(album) : r)));
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to remove tab");
    }
  };

  const updateEditTabLabel = async (tabId: string, label: string) => {
    if (!editingAlbum) return;
    try {
      await studioApiFetch(`/api/studio/albums/${editingAlbum.id}/gallery-tabs/${encodeURIComponent(tabId)}`, {
        method: "PATCH",
        body: { label: label.trim() || "Gallery" },
      });
      await refreshEditAlbum(editingAlbum.id);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to update tab");
    }
  };

  const editModalBusy = editSaving || editPublishSubmitting;

  /** PATCH title/banner position, then upload any staged banner, highlights, and gallery files. Returns latest album from GET. */
  const flushEditChangesToServer = async (): Promise<any> => {
    if (!editingAlbum || !editTitle.trim()) {
      throw new Error("Album name is required");
    }
    await studioApiFetch(`/api/studio/albums/${editingAlbum.id}`, {
      method: "PATCH",
      body: {
        title: editTitle.trim(),
        bannerHeroDesktopPosition: `${Math.round(editBannerDeskX)}% ${Math.round(editBannerDeskY)}%`,
        bannerHeroMobilePosition: `${Math.round(editBannerMobX)}% ${Math.round(editBannerMobY)}%`,
      },
    });

    if (editBannerFile) {
      await uploadAlbumBannerDirect({
        albumId: editingAlbum.id,
        file: editBannerFile,
        api: studioApiFetch,
        onProgress: () => {},
      });
    }

    if (editNewHighlightFiles.length > 0) {
      await uploadAlbumHighlightsDirect({
        albumId: editingAlbum.id,
        files: editNewHighlightFiles,
        api: studioApiFetch,
        onProgress: () => {},
      });
    }

    const pendingTabs = Object.entries(editPendingGalleryByTab).filter(([, files]) => files.length > 0);
    for (const [tabId, files] of pendingTabs) {
      await uploadAlbumGalleryTabDirect({
        albumId: editingAlbum.id,
        tabId,
        files,
        api: studioApiFetch,
        onProgress: () => {},
      });
    }

    const refreshed = await studioApiFetch<{ album: any }>(`/api/studio/albums/${editingAlbum.id}`);
    return refreshed.album;
  };

  const saveEdit = async () => {
    if (!editingAlbum || !editTitle.trim()) return;
    setEditSaving(true);
    try {
      const album = await flushEditChangesToServer();
      setAlbums((prev) => prev.map((a) => (a.id === editingAlbum.id ? mapApiAlbumToRow(album) : a)));
      resetEditStaging();
      closeEdit();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to save album");
    } finally {
      setEditSaving(false);
    }
  };

  const publishEditAlbum = async () => {
    if (!editingAlbum || !editTitle.trim() || editDetailAlbum?.isPublished) return;
    setEditPublishSubmitting(true);
    try {
      const albumAfterFlush = await flushEditChangesToServer();
      setEditDetailAlbum(albumAfterFlush);
      const published = await studioApiFetch<{ album: any; shareUrl?: string }>(
        `/api/studio/albums/${editingAlbum.id}/publish`,
        { method: "POST", body: {} }
      );
      const row = mapApiAlbumToRow(published.album);
      setAlbums((prev) => prev.map((a) => (a.id === editingAlbum.id ? row : a)));
      setEditingAlbum(row);
      setEditDetailAlbum(published.album);
      resetEditStaging();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to publish album");
    } finally {
      setEditPublishSubmitting(false);
    }
  };

  const deleteAlbumRow = async (album: StudioAlbumRecord) => {
    if (!window.confirm(`Delete album "${album.title}"? This cannot be undone.`)) return;
    try {
      await studioApiFetch(`/api/studio/albums/${encodeURIComponent(album.id)}`, { method: "DELETE" });
      setAlbums((prev) => prev.filter((a) => a.id !== album.id));
      if (editingAlbum?.id === album.id) closeEdit();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to delete album");
    }
  };

  const copyAlbumUrl = async (album: StudioAlbumRecord) => {
    const path = album.slug ? `/${album.slug}` : album.shareToken ? `/share/${album.shareToken}` : `/share/${album.id}`;
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedAlbumId(album.id);
      window.setTimeout(() => setCopiedAlbumId((prev) => (prev === album.id ? null : prev)), 1400);
    } catch {
      window.prompt("Copy this URL", url);
    }
  };

  const albumListView = (
    <>
      <PageHeader
        eyebrow="Module 3"
        title="Digital albums for clients"
        description="Create albums in two steps—name your album, then upload and publish. Uses the standard Invyto digital album layout. Edit anytime from your library."
      />

      <div className="grid gap-4">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
                  <BookOpen className="h-5 w-5 text-zinc-900" strokeWidth={1.75} />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">Your albums</h2>
                  <p className="text-sm text-zinc-600">
                    {albumsLoading ? "Loading…" : `${albums.length} created`}
                  </p>
                </div>
              </div>
              <PrimaryButton type="button" onClick={openCreate}>
                Create album
              </PrimaryButton>
            </div>

            <div className="overflow-x-auto">
              {albumsError ? (
                <div className="px-5 pb-2 text-sm text-red-700">{albumsError}</div>
              ) : null}
              <table className="min-w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-5 py-3">Album</th>
                    <th className="px-5 py-3">Layout</th>
                    <th className="px-5 py-3">Photos</th>
                    <th className="px-5 py-3">Views</th>
                    <th className="px-5 py-3">Updated</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {albumsLoading ? (
                    Array.from({ length: 6 }, (_, i) => (
                      <tr key={`shimmer-${i}`} className="bg-white">
                        <td className="px-5 py-3">
                          <div className={`h-4 max-w-[200px] rounded-md ${STUDIO_TABLE_SHIMMER}`} />
                        </td>
                        <td className="px-5 py-3">
                          <div className={`h-4 max-w-[120px] rounded-md ${STUDIO_TABLE_SHIMMER}`} />
                        </td>
                        <td className="px-5 py-3">
                          <div className={`h-4 w-10 rounded-md ${STUDIO_TABLE_SHIMMER}`} />
                        </td>
                        <td className="px-5 py-3">
                          <div className={`h-4 w-12 rounded-md ${STUDIO_TABLE_SHIMMER}`} />
                        </td>
                        <td className="px-5 py-3">
                          <div className={`h-4 w-14 rounded-md ${STUDIO_TABLE_SHIMMER}`} />
                        </td>
                        <td className="px-5 py-3">
                          <div className={`h-6 w-20 rounded-full ${STUDIO_TABLE_SHIMMER}`} />
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className={`ml-auto h-8 w-28 rounded-lg ${STUDIO_TABLE_SHIMMER}`} />
                        </td>
                      </tr>
                    ))
                  ) : albums.length === 0 ? (
                    <tr className="bg-white">
                      <td colSpan={7} className="px-5 py-10 text-center text-sm text-zinc-600">
                        No albums yet. Create one to get started.
                      </td>
                    </tr>
                  ) : (
                    albums.map((row) => (
                      <tr key={row.id} className="bg-white">
                        <td className="px-5 py-3 font-semibold text-zinc-900">{row.title}</td>
                        <td className="px-5 py-3 text-zinc-700">{row.templateTitle}</td>
                        <td className="px-5 py-3 text-zinc-700">{row.photoCount}</td>
                        <td className="px-5 py-3 text-zinc-700">{row.views}</td>
                        <td className="px-5 py-3 text-zinc-600">{row.lastTouchLabel}</td>
                        <td className="px-5 py-3">
                          <StatusBadge tone={toneForStatus(row.status)}>{row.status}</StatusBadge>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => void copyAlbumUrl(row)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
                            >
                              {copiedAlbumId === row.id ? "Copied" : "Copy URL"}
                            </button>
                            <button
                              type="button"
                              onClick={() => openEdit(row)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
                            >
                              <Pencil className="h-4 w-4" strokeWidth={1.75} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteAlbumRow(row)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                              title="Delete album"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </>
  );

  return (
    <>
      {!createOpen && !(editOpen && editingAlbum) ? albumListView : null}

      {createOpen ? (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-zinc-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="album-wizard-title"
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => {
                if (createPublishSubmitting) return;
                if (createStep === "upload") setCreateStep("template");
                else closeCreate();
              }}
              disabled={createPublishSubmitting}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
              {createStep === "upload" ? "Back" : "Albums"}
            </button>
            <div className="min-w-0 flex-1">
              <p id="album-wizard-title" className="truncate text-base font-semibold text-zinc-900">
                New album
              </p>
              <WizardSteps step={createStep} />
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
              {createStep === "template" ? (
                <div className="space-y-5">
                  <div>
                    <label htmlFor="new-album-title" className="text-sm font-semibold text-zinc-900">
                      Album name
                    </label>
                    <input
                      id="new-album-title"
                      value={createTitle}
                      onChange={(e) => setCreateTitle(e.target.value)}
                      placeholder="e.g. Priya & Leo — Hyderabad"
                      className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Album layout</p>
                    <p className="mt-1 text-sm text-zinc-600">
                      All albums use this presentation. Your uploads replace the sample art in the client view.
                    </p>
                    <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                      <p className="text-sm font-semibold text-zinc-900">{DIGITAL_ALBUM_TEMPLATE.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-600">{DIGITAL_ALBUM_TEMPLATE.subtitle}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {createStep === "upload" ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm font-semibold text-zinc-900">Section images</p>
                    <p className="mt-1 text-sm text-zinc-600">
                      Upload a banner image, optional highlights, and gallery images grouped by tabs.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-zinc-900">1) Banner image (full screen)</p>
                      <label
                        htmlFor={`${createUploadInputId}-banner`}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                      >
                        <Upload className="h-4 w-4" strokeWidth={1.75} />
                        Upload banner
                      </label>
                      <input
                        id={`${createUploadInputId}-banner`}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => onCreateBannerFile(e.target.files)}
                      />
                    </div>
                    {createBannerPreviewUrl ? (
                      <div className="group relative mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                        <img alt="" src={createBannerPreviewUrl} className="h-44 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setCreateBannerFile(null);
                            setCreateBannerDeskX(50);
                            setCreateBannerDeskY(50);
                            setCreateBannerMobX(50);
                            setCreateBannerMobY(50);
                            setCreateBannerPreviewUrl((prev) => {
                              if (prev) URL.revokeObjectURL(prev);
                              return null;
                            });
                          }}
                          className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                          aria-label="Remove banner image"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-amber-800">Banner image required.</p>
                    )}
                    {createBannerPreviewUrl ? (
                      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                        <p className="text-xs font-semibold text-zinc-900">Banner framing</p>
                        <p className="mt-1 text-xs text-zinc-600">
                          Tune how the full-screen hero is cropped on wide vs narrow screens (matches the public album).
                        </p>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-800">
                              <Monitor className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                              Laptop
                            </p>
                            <div
                              className="h-32 w-full overflow-hidden rounded-lg border border-zinc-300 bg-zinc-900 shadow-inner"
                              style={{
                                backgroundImage: `url("${createBannerPreviewUrl}")`,
                                backgroundSize: "cover",
                                backgroundPosition: `${createBannerDeskX}% ${createBannerDeskY}%`,
                                backgroundRepeat: "no-repeat",
                              }}
                              role="img"
                              aria-label="Laptop banner crop preview"
                            />
                            <div className="mt-3 space-y-2">
                              <div>
                                <label className="flex justify-between text-[11px] text-zinc-600" htmlFor={`${createUploadInputId}-bdx`}>
                                  <span>Horizontal</span>
                                  <span>{createBannerDeskX}%</span>
                                </label>
                                <input
                                  id={`${createUploadInputId}-bdx`}
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={createBannerDeskX}
                                  onChange={(e) => setCreateBannerDeskX(Number(e.target.value))}
                                  className="mt-1 h-2 w-full cursor-pointer accent-zinc-900"
                                />
                              </div>
                              <div>
                                <label className="flex justify-between text-[11px] text-zinc-600" htmlFor={`${createUploadInputId}-bdy`}>
                                  <span>Vertical</span>
                                  <span>{createBannerDeskY}%</span>
                                </label>
                                <input
                                  id={`${createUploadInputId}-bdy`}
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={createBannerDeskY}
                                  onChange={(e) => setCreateBannerDeskY(Number(e.target.value))}
                                  className="mt-1 h-2 w-full cursor-pointer accent-zinc-900"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-800">
                              <Smartphone className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                              Mobile
                            </p>
                            <div className="mx-auto max-w-[9rem]">
                              <div
                                className="aspect-[9/16] w-full overflow-hidden rounded-lg border border-zinc-300 bg-zinc-900 shadow-inner"
                                style={{
                                  backgroundImage: `url("${createBannerPreviewUrl}")`,
                                  backgroundSize: "cover",
                                  backgroundPosition: `${createBannerMobX}% ${createBannerMobY}%`,
                                  backgroundRepeat: "no-repeat",
                                }}
                                role="img"
                                aria-label="Mobile banner crop preview"
                              />
                            </div>
                            <div className="mt-3 space-y-2">
                              <div>
                                <label className="flex justify-between text-[11px] text-zinc-600" htmlFor={`${createUploadInputId}-bmx`}>
                                  <span>Horizontal</span>
                                  <span>{createBannerMobX}%</span>
                                </label>
                                <input
                                  id={`${createUploadInputId}-bmx`}
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={createBannerMobX}
                                  onChange={(e) => setCreateBannerMobX(Number(e.target.value))}
                                  className="mt-1 h-2 w-full cursor-pointer accent-zinc-900"
                                />
                              </div>
                              <div>
                                <label className="flex justify-between text-[11px] text-zinc-600" htmlFor={`${createUploadInputId}-bmy`}>
                                  <span>Vertical</span>
                                  <span>{createBannerMobY}%</span>
                                </label>
                                <input
                                  id={`${createUploadInputId}-bmy`}
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={createBannerMobY}
                                  onChange={(e) => setCreateBannerMobY(Number(e.target.value))}
                                  className="mt-1 h-2 w-full cursor-pointer accent-zinc-900"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-zinc-900">2) Highlights carousel</p>
                      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-800">
                        <input
                          type="checkbox"
                          checked={createIncludeHighlights}
                          onChange={(e) => {
                            const on = e.target.checked;
                            setCreateIncludeHighlights(on);
                            if (!on) {
                              setCreateHighlightsFiles([]);
                              setCreateHighlightsPreviewUrls((prev) => {
                                prev.forEach((u) => URL.revokeObjectURL(u));
                                return [];
                              });
                            }
                          }}
                          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                        />
                        Include highlights carousel
                      </label>
                    </div>
                    {createIncludeHighlights ? (
                      <>
                        <div className="mt-3 flex justify-end">
                          <label
                            htmlFor={`${createUploadInputId}-highlights`}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                          >
                            <Upload className="h-4 w-4" strokeWidth={1.75} />
                            Add highlights
                          </label>
                          <input
                            id={`${createUploadInputId}-highlights`}
                            type="file"
                            accept="image/*"
                            multiple
                            className="sr-only"
                            onChange={(e) => onCreateHighlightsFiles(e.target.files)}
                          />
                        </div>
                        {createHighlightsFiles.length > 0 ? (
                          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                            {createHighlightsFiles.map((file, idx) => (
                              <li key={`${file.name}-${idx}`} className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
                                <img alt="" src={createHighlightsPreviewUrls[idx]} className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeCreateHighlightAt(idx)}
                                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                                  aria-label={`Remove ${file.name}`}
                                >
                                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-3 text-xs text-amber-800">Add at least one highlight image.</p>
                        )}
                      </>
                    ) : (
                      <p className="mt-2 text-xs text-zinc-600">
                        Not included — the client view will show the banner and gallery only (no highlights row).
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-zinc-900">3) Gallery tabs</p>
                      <GhostButton type="button" onClick={addCreateGalleryTab}>
                        Add tab
                      </GhostButton>
                    </div>
                    <div className="mt-3 space-y-3">
                      {createGalleryTabs.map((tab, tabIndex) => (
                        <div key={tab.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              value={tab.label}
                              onChange={(e) => updateCreateGalleryTabLabel(tab.id, e.target.value)}
                              placeholder={`Tab ${tabIndex + 1}`}
                              className="h-9 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-2"
                            />
                            <label
                              htmlFor={`${createUploadInputId}-gallery-${tab.id}`}
                              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                            >
                              <Upload className="h-4 w-4" strokeWidth={1.75} />
                              Add photos
                            </label>
                            <input
                              id={`${createUploadInputId}-gallery-${tab.id}`}
                              type="file"
                              accept="image/*"
                              multiple
                              className="sr-only"
                              onChange={(e) => onCreateGalleryTabFiles(tab.id, e.target.files)}
                            />
                            <button
                              type="button"
                              onClick={() => removeCreateGalleryTab(tab.id)}
                              disabled={createGalleryTabs.length <= 1}
                              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Remove
                            </button>
                          </div>
                          {tab.files.length > 0 ? (
                            <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                              {tab.files.map((file, idx) => (
                                <li key={`${tab.id}-${file.name}-${idx}`} className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
                                  <img alt="" src={tab.previewUrls[idx]} className="h-full w-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removeCreateGalleryTabFileAt(tab.id, idx)}
                                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                                    aria-label={`Remove ${file.name}`}
                                  >
                                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-xs text-zinc-600">No photos in this tab yet.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {createPublishSubmitting ? (
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-sm font-semibold text-zinc-900">
                        Publishing album... {createPublishProgress}%
                      </p>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                        <div
                          className="h-full rounded-full bg-zinc-900 transition-[width] duration-200"
                          style={{ width: `${createPublishProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <footer className="shrink-0 border-t border-zinc-200 bg-white px-4 py-4 sm:px-6">
            <div className="mx-auto flex max-w-3xl flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <GhostButton
                type="button"
                onClick={() => {
                  if (createStep === "template") closeCreate();
                  else setCreateStep("template");
                }}
                disabled={createPublishSubmitting}
              >
                {createStep === "template" ? "Cancel" : "Back"}
              </GhostButton>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                {createStep === "template" ? (
                  <PrimaryButton
                    type="button"
                    onClick={() => {
                      if (!canContinueFromTemplate) return;
                      setCreateStep("upload");
                    }}
                    disabled={!canContinueFromTemplate}
                  >
                    <span className="inline-flex items-center gap-2">
                      Continue
                      <ChevronRight className="h-4 w-4" strokeWidth={2} />
                    </span>
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    type="button"
                    onClick={() => void publishNewAlbum()}
                    disabled={!canPublish || createPublishSubmitting}
                  >
                    {createPublishSubmitting ? `Publishing... ${createPublishProgress}%` : "Publish album"}
                  </PrimaryButton>
                )}
              </div>
            </div>
          </footer>
        </div>
      ) : null}

      {editOpen && editingAlbum ? (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-zinc-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-album-title"
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={closeEdit}
              disabled={editModalBusy}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
              Albums
            </button>
            <div className="min-w-0 flex-1">
              <p id="edit-album-title" className="truncate text-base font-semibold text-zinc-900">
                Edit album
              </p>
              <p className="mt-0.5 text-sm text-zinc-600">
                Update title, banner framing, and staged uploads on Save. Removing a photo or tab applies immediately.
              </p>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6">
              {editDetailLoading ? (
                <p className="py-10 text-center text-sm text-zinc-600">Loading album…</p>
              ) : !editDetailAlbum ? (
                <p className="py-10 text-center text-sm text-red-700">Album could not be loaded.</p>
              ) : (
                <>
                  {editDetailAlbum.isPublished ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone="good">Published</StatusBadge>
                      <span className="text-xs text-zinc-600">Edits stay private until you save.</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2">
                      <StatusBadge tone="neutral">Draft</StatusBadge>
                      <span className="text-xs text-amber-950/90">
                        Use <span className="font-semibold">Publish album</span> in the footer to save staged uploads and go live.
                      </span>
                    </div>
                  )}
                  <div>
                    <label htmlFor="edit-album-name" className="text-sm font-semibold text-zinc-900">
                      Album name
                    </label>
                    <input
                      id="edit-album-name"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                    />
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-zinc-900">Banner (full screen)</p>
                      <div className="flex flex-wrap gap-2">
                        <label
                          htmlFor={`${editUploadInputId}-banner`}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                        >
                          <Upload className="h-4 w-4" strokeWidth={1.75} />
                          {editDetailAlbum.bannerImage || editBannerFile ? "Replace banner" : "Upload banner"}
                        </label>
                        <input
                          id={`${editUploadInputId}-banner`}
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => onEditBannerFile(e.target.files)}
                        />
                        {editDetailAlbum.bannerImage?.id ? (
                          <GhostButton
                            type="button"
                            onClick={() => void deleteEditImage(String(editDetailAlbum.bannerImage.id))}
                          >
                            Remove banner
                          </GhostButton>
                        ) : null}
                      </div>
                    </div>
                    {editBannerPreviewUrl || editDetailAlbum.bannerImage?.url ? (
                      <div className="group relative mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                        <img
                          alt=""
                          src={editBannerPreviewUrl || String(editDetailAlbum.bannerImage?.url ?? "")}
                          className="h-40 w-full object-cover"
                        />
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-amber-800">No banner yet — upload one before publishing.</p>
                    )}
                    {editBannerPreviewUrl || editDetailAlbum.bannerImage?.url ? (
                    <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                      <p className="text-xs font-semibold text-zinc-900">Banner framing</p>
                      <div className="mt-3 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-800">
                            <Monitor className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                            Laptop
                          </p>
                          <div
                            className="h-24 w-full overflow-hidden rounded-lg border border-zinc-300 bg-zinc-900"
                            style={{
                              backgroundImage: `url("${editBannerPreviewUrl || editDetailAlbum.bannerImage?.url || ""}")`,
                              backgroundSize: "cover",
                              backgroundPosition: `${editBannerDeskX}% ${editBannerDeskY}%`,
                              backgroundRepeat: "no-repeat",
                            }}
                          />
                          <div className="mt-2 space-y-1">
                            <label className="flex justify-between text-[11px] text-zinc-600" htmlFor={`${editUploadInputId}-bdx`}>
                              <span>H</span>
                              <span>{editBannerDeskX}%</span>
                            </label>
                            <input
                              id={`${editUploadInputId}-bdx`}
                              type="range"
                              min={0}
                              max={100}
                              value={editBannerDeskX}
                              onChange={(e) => setEditBannerDeskX(Number(e.target.value))}
                              className="h-2 w-full cursor-pointer accent-zinc-900"
                            />
                            <label className="flex justify-between text-[11px] text-zinc-600" htmlFor={`${editUploadInputId}-bdy`}>
                              <span>V</span>
                              <span>{editBannerDeskY}%</span>
                            </label>
                            <input
                              id={`${editUploadInputId}-bdy`}
                              type="range"
                              min={0}
                              max={100}
                              value={editBannerDeskY}
                              onChange={(e) => setEditBannerDeskY(Number(e.target.value))}
                              className="h-2 w-full cursor-pointer accent-zinc-900"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-800">
                            <Smartphone className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                            Mobile
                          </p>
                          <div className="mx-auto max-w-[7rem]">
                            <div
                              className="aspect-[9/16] w-full overflow-hidden rounded-lg border border-zinc-300 bg-zinc-900"
                              style={{
                                backgroundImage: `url("${editBannerPreviewUrl || editDetailAlbum.bannerImage?.url || ""}")`,
                                backgroundSize: "cover",
                                backgroundPosition: `${editBannerMobX}% ${editBannerMobY}%`,
                                backgroundRepeat: "no-repeat",
                              }}
                            />
                          </div>
                          <div className="mt-2 space-y-1">
                            <label className="flex justify-between text-[11px] text-zinc-600" htmlFor={`${editUploadInputId}-bmx`}>
                              <span>H</span>
                              <span>{editBannerMobX}%</span>
                            </label>
                            <input
                              id={`${editUploadInputId}-bmx`}
                              type="range"
                              min={0}
                              max={100}
                              value={editBannerMobX}
                              onChange={(e) => setEditBannerMobX(Number(e.target.value))}
                              className="h-2 w-full cursor-pointer accent-zinc-900"
                            />
                            <label className="flex justify-between text-[11px] text-zinc-600" htmlFor={`${editUploadInputId}-bmy`}>
                              <span>V</span>
                              <span>{editBannerMobY}%</span>
                            </label>
                            <input
                              id={`${editUploadInputId}-bmy`}
                              type="range"
                              min={0}
                              max={100}
                              value={editBannerMobY}
                              onChange={(e) => setEditBannerMobY(Number(e.target.value))}
                              className="h-2 w-full cursor-pointer accent-zinc-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-zinc-900">Highlights</p>
                      <label
                        htmlFor={`${editUploadInputId}-highlights`}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                      >
                        <Upload className="h-4 w-4" strokeWidth={1.75} />
                        Add highlights
                      </label>
                      <input
                        id={`${editUploadInputId}-highlights`}
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={(e) => onEditNewHighlights(e.target.files)}
                      />
                    </div>
                    <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                      {(editDetailAlbum.highlights ?? []).map((img: { id: string; url: string }) => (
                        <li key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
                          <img alt="" src={img.url} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => void deleteEditImage(img.id)}
                            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                            aria-label="Remove highlight"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>
                        </li>
                      ))}
                      {editNewHighlightFiles.map((file, idx) => (
                        <li key={`new-hl-${file.name}-${idx}`} className="group relative aspect-square overflow-hidden rounded-xl bg-amber-50 ring-2 ring-amber-200/80">
                          <img alt="" src={editNewHighlightPreviews[idx]} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeEditStagedHighlightAt(idx)}
                            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                            aria-label="Remove staged file"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    {(editDetailAlbum.highlights ?? []).length === 0 && editNewHighlightFiles.length === 0 ? (
                      <p className="mt-2 text-xs text-zinc-600">No highlights — optional.</p>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-zinc-900">Gallery tabs</p>
                      <GhostButton type="button" onClick={() => void addEditGalleryTab()}>
                        <span className="inline-flex items-center gap-1.5">
                          <Plus className="h-4 w-4" strokeWidth={2} />
                          Add tab
                        </span>
                      </GhostButton>
                    </div>
                    <div className="mt-3 space-y-4">
                      {(editDetailAlbum.galleryTabs ?? []).map((tab: { id: string; label: string; images: Array<{ id: string; url: string }> }) => (
                        <div key={tab.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              key={`${tab.id}-${tab.label}`}
                              defaultValue={tab.label}
                              onBlur={(e) => {
                                const v = e.target.value.trim() || "Gallery";
                                if (v !== tab.label) void updateEditTabLabel(tab.id, v);
                              }}
                              className="h-9 min-w-[8rem] flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-2"
                            />
                            <label
                              htmlFor={`${editUploadInputId}-g-${tab.id}`}
                              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                            >
                              <Upload className="h-4 w-4" strokeWidth={1.75} />
                              Add photos
                            </label>
                            <input
                              id={`${editUploadInputId}-g-${tab.id}`}
                              type="file"
                              accept="image/*"
                              multiple
                              className="sr-only"
                              onChange={(e) => onEditGalleryFilesForTab(tab.id, e.target.files)}
                            />
                            {(editDetailAlbum.galleryTabs ?? []).length > 1 ? (
                              <button
                                type="button"
                                onClick={() => void deleteEditGalleryTab(tab.id)}
                                className="rounded-lg border border-red-200 bg-white px-2.5 py-2 text-xs font-semibold text-red-800 hover:bg-red-50"
                              >
                                Remove tab
                              </button>
                            ) : null}
                          </div>
                          {(editPendingGalleryByTab[tab.id]?.length ?? 0) > 0 ? (
                            <p className="mt-2 text-xs font-medium text-amber-900">
                              {editPendingGalleryByTab[tab.id]!.length} file
                              {editPendingGalleryByTab[tab.id]!.length === 1 ? "" : "s"} staged for upload
                            </p>
                          ) : null}
                          {(editPendingGalleryByTab[tab.id] ?? []).map((file, pidx) => (
                            <div
                              key={`${tab.id}-pending-${file.name}-${pidx}`}
                              className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-950"
                            >
                              <span className="truncate font-medium">{file.name}</span>
                              <button
                                type="button"
                                className="shrink-0 font-semibold text-red-800 hover:underline"
                                onClick={() => removeEditPendingGalleryFile(tab.id, pidx)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                            {(tab.images ?? []).map((img: { id: string; url: string }) => (
                              <li key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
                                <img alt="" src={img.url} className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => void deleteEditImage(img.id)}
                                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                                  aria-label="Remove photo"
                                >
                                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <footer className="shrink-0 border-t border-zinc-200 bg-white px-4 py-4 sm:px-6">
            <div className="mx-auto flex max-w-3xl flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <GhostButton type="button" onClick={closeEdit} disabled={editModalBusy}>
                Cancel
              </GhostButton>
              <PrimaryButton
                type="button"
                onClick={() => void saveEdit()}
                disabled={!editTitle.trim() || editModalBusy || editDetailLoading || !editDetailAlbum}
              >
                {editSaving ? "Saving…" : "Save changes"}
              </PrimaryButton>
              {editDetailAlbum && !editDetailAlbum.isPublished ? (
                <PrimaryButton
                  type="button"
                  onClick={() => void publishEditAlbum()}
                  disabled={!editTitle.trim() || editModalBusy || editDetailLoading || !editDetailAlbum}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editPublishSubmitting ? "Publishing…" : "Publish album"}
                </PrimaryButton>
              ) : null}
            </div>
          </footer>
        </div>
      ) : null}
    </>
  );
}

function WizardSteps({ step }: { step: WizardStep }) {
  const steps: { key: WizardStep; label: string }[] = [
    { key: "template", label: "Album" },
    { key: "upload", label: "Upload & publish" },
  ];
  const idx = steps.findIndex((s) => s.key === step);

  return (
    <ol className="mt-3 flex flex-wrap gap-2">
      {steps.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={s.key}>
            <span
              className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                active
                  ? "bg-zinc-900 text-white ring-zinc-900"
                  : done
                    ? "bg-emerald-50 text-emerald-900 ring-emerald-200/70"
                    : "bg-zinc-100 text-zinc-600 ring-zinc-200/70",
              ].join(" ")}
            >
              <span className="tabular-nums">{i + 1}</span>
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
