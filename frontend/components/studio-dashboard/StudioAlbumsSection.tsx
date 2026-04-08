"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import { BookOpen, ChevronRight, Eye, Pencil, Plus, Upload, X } from "lucide-react";
import {
  type DigitalAlbumTemplateId,
  DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID,
  digitalAlbumTemplatePreviews,
} from "@/utils/digitalAlbumTemplates";
import { GhostButton, PageHeader, PrimaryButton, StatusBadge } from "@/components/studio-dashboard/blocks";
import DigitalAlbumTemplatePreview from "@/components/client/DigitalAlbumTemplatePreview";
import { studioApiFetch } from "@/utils/studioApi";

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

const initialAlbums: StudioAlbumRecord[] = [
  {
    id: "alb_1",
    title: "Meera & Vikram — Wedding weekend",
    templateId: DIGITAL_ALBUM_TEMPLATE.id,
    templateTitle: DIGITAL_ALBUM_TEMPLATE.title,
    photoCount: 312,
    views: "1.8k",
    status: "Proofing",
    lastTouchLabel: "Apr 5",
  },
  {
    id: "alb_2",
    title: "Aina — Chennai portraits",
    templateId: DIGITAL_ALBUM_TEMPLATE.id,
    templateTitle: DIGITAL_ALBUM_TEMPLATE.title,
    photoCount: 84,
    views: "406",
    status: "Delivered",
    lastTouchLabel: "Mar 21",
  },
  {
    id: "alb_3",
    title: "Neel & Dia — Haldi + reception",
    templateId: DIGITAL_ALBUM_TEMPLATE.id,
    templateTitle: DIGITAL_ALBUM_TEMPLATE.title,
    photoCount: 196,
    views: "—",
    status: "Draft",
    lastTouchLabel: "Apr 1",
  },
];

type WizardStep = "template" | "upload" | "publish";

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
  const [albums, setAlbums] = useState<StudioAlbumRecord[]>(initialAlbums);

  const [createOpen, setCreateOpen] = useState(false);
  const [createStep, setCreateStep] = useState<WizardStep>("template");
  const [createTitle, setCreateTitle] = useState("");
  const [createBannerFile, setCreateBannerFile] = useState<File | null>(null);
  const [createBannerPreviewUrl, setCreateBannerPreviewUrl] = useState<string | null>(null);
  const [createHighlightsFiles, setCreateHighlightsFiles] = useState<File[]>([]);
  const [createHighlightsPreviewUrls, setCreateHighlightsPreviewUrls] = useState<string[]>([]);
  const [createGalleryTabs, setCreateGalleryTabs] = useState<CreateGalleryTab[]>([
    { id: `tab-${Date.now()}`, label: "Main", files: [], previewUrls: [] },
  ]);

  const [editOpen, setEditOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<StudioAlbumRecord | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editExtraFiles, setEditExtraFiles] = useState<File[]>([]);
  const [editExtraPreviewUrls, setEditExtraPreviewUrls] = useState<string[]>([]);
  const [previewAlbum, setPreviewAlbum] = useState<StudioAlbumRecord | null>(null);
  const [copiedAlbumId, setCopiedAlbumId] = useState<string | null>(null);
  const [albumsLoading, setAlbumsLoading] = useState(false);
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
    setCreateBannerFile(null);
    setCreateBannerPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
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
  const totalCreatePhotos =
    (createBannerFile ? 1 : 0) +
    createHighlightsFiles.length +
    createGalleryTabs.reduce((sum, tab) => sum + tab.files.length, 0);
  const canPublish = Boolean(
    selectedCreateTemplate &&
      createTitle.trim() &&
      createBannerFile &&
      createHighlightsFiles.length > 0 &&
      createGalleryTabs.some((tab) => tab.files.length > 0)
  );
  const previewGalleryTabs = createGalleryTabs
    .map((tab) => ({
      id: tab.id,
      label: tab.label.trim() || "Gallery",
      images: tab.previewUrls,
    }))
    .filter((tab) => tab.images.length > 0);

  const onCreateBannerFile = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    setCreateBannerFile(file);
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
    if (!canPublish || !createBannerFile) return;
    try {
      const created = await studioApiFetch<{ album: any }>("/api/studio/albums", {
        method: "POST",
        body: {
          title: createTitle.trim(),
          templateId: DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID,
        },
      });
      const albumId = String(created.album?._id ?? created.album?.id ?? "");
      if (!albumId) throw new Error("Failed to create album");

      const bannerFd = new FormData();
      bannerFd.append("image", createBannerFile);
      await studioApiFetch(`/api/studio/albums/${albumId}/banner`, {
        method: "POST",
        formData: bannerFd,
      });

      if (createHighlightsFiles.length > 0) {
        const highlightsFd = new FormData();
        createHighlightsFiles.forEach((f) => highlightsFd.append("images", f));
        await studioApiFetch(`/api/studio/albums/${albumId}/highlights`, {
          method: "POST",
          formData: highlightsFd,
        });
      }

      for (const tab of createGalleryTabs) {
        if (tab.files.length === 0) continue;
        const createdTab = await studioApiFetch<{ tab: { id: string } }>(`/api/studio/albums/${albumId}/gallery-tabs`, {
          method: "POST",
          body: { label: tab.label.trim() || "Gallery" },
        });
        const tabId = createdTab.tab.id;
        const fd = new FormData();
        tab.files.forEach((f) => fd.append("images", f));
        await studioApiFetch(`/api/studio/albums/${albumId}/gallery-tabs/${tabId}/images`, {
          method: "POST",
          formData: fd,
        });
      }

      const published = await studioApiFetch<{ album: any }>(`/api/studio/albums/${albumId}/publish`, {
        method: "POST",
      });

      setAlbums((prev) => [mapApiAlbumToRow(published.album), ...prev]);
      closeCreate();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to publish album");
    }
  };

  const openEdit = (album: StudioAlbumRecord) => {
    setEditingAlbum(album);
    setEditTitle(album.title);
    setEditExtraFiles([]);
    setEditExtraPreviewUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return [];
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditingAlbum(null);
    setEditExtraPreviewUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return [];
    });
    setEditExtraFiles([]);
  };

  const onEditFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const next = Array.from(fileList);
    setEditExtraFiles((prev) => [...prev, ...next]);
    const urls = next.map((f) => URL.createObjectURL(f));
    setEditExtraPreviewUrls((prev) => [...prev, ...urls]);
  };

  const saveEdit = async () => {
    if (!editingAlbum) return;
    try {
      await studioApiFetch(`/api/studio/albums/${editingAlbum.id}`, {
        method: "PATCH",
        body: { title: editTitle.trim() || editingAlbum.title },
      });

      if (editExtraFiles.length > 0) {
        const tabResp = await studioApiFetch<{ tab: { id: string } }>(`/api/studio/albums/${editingAlbum.id}/gallery-tabs`, {
          method: "POST",
          body: { label: "Extras" },
        });
        const fd = new FormData();
        editExtraFiles.forEach((f) => fd.append("images", f));
        await studioApiFetch(`/api/studio/albums/${editingAlbum.id}/gallery-tabs/${tabResp.tab.id}/images`, {
          method: "POST",
          formData: fd,
        });
      }

      const refreshed = await studioApiFetch<{ album: any }>(`/api/studio/albums/${editingAlbum.id}`);
      setAlbums((prev) => prev.map((a) => (a.id === editingAlbum.id ? mapApiAlbumToRow(refreshed.album) : a)));
      closeEdit();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to save album");
    }
  };

  const openPreview = (album: StudioAlbumRecord) => {
    setPreviewAlbum(album);
  };

  const closePreview = () => {
    setPreviewAlbum(null);
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

  return (
    <>
      <PageHeader
        eyebrow="Module 3"
        title="Digital albums for clients"
        description="Create albums in three steps—name your album, upload photos, publish. Uses the standard Invyto digital album layout. Edit anytime from your library."
        actions={
          <PrimaryButton type="button" onClick={openCreate}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" strokeWidth={2} />
              New album
            </span>
          </PrimaryButton>
        }
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
                  <p className="text-sm text-zinc-600">{albums.length} created · UI-only local state</p>
                </div>
              </div>
              <PrimaryButton type="button" onClick={openCreate}>
                Create album
              </PrimaryButton>
            </div>

            <div className="overflow-x-auto">
              {albumsLoading ? (
                <div className="px-5 py-4 text-sm text-zinc-600">Loading albums...</div>
              ) : null}
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
                  {albums.map((row) => (
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
                            onClick={() => openPreview(row)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
                          >
                            <Eye className="h-4 w-4" strokeWidth={1.75} />
                            Preview
                          </button>
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/45"
            onClick={closeCreate}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="album-wizard-title"
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
              <div>
                <p id="album-wizard-title" className="text-base font-semibold text-zinc-900">
                  New album
                </p>
                <WizardSteps step={createStep} />
              </div>
              <button
                type="button"
                className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-800 hover:bg-zinc-50"
                onClick={closeCreate}
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
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
                    <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                      <div className="relative aspect-[16/10] bg-zinc-100">
                        <Image
                          src={DIGITAL_ALBUM_TEMPLATE.coverSrc}
                          alt={DIGITAL_ALBUM_TEMPLATE.coverAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 360px"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-zinc-900">{DIGITAL_ALBUM_TEMPLATE.title}</p>
                        <p className="mt-0.5 text-xs text-zinc-600">{DIGITAL_ALBUM_TEMPLATE.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {createStep === "upload" ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm font-semibold text-zinc-900">Section images</p>
                    <p className="mt-1 text-sm text-zinc-600">
                      Upload one banner image, highlights, and gallery images grouped by tabs.
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
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-zinc-900">2) Highlights carousel</p>
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

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm font-semibold text-zinc-900">Client preview</p>
                    <p className="mt-1 text-xs text-zinc-600">
                      Live preview of banner, highlights, and gallery tabs as the client will see it.
                    </p>
                    <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-white">
                      <DigitalAlbumTemplatePreview
                        templateId={DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID}
                        bannerImage={createBannerPreviewUrl}
                        highlightImages={createHighlightsPreviewUrls}
                        galleryTabs={previewGalleryTabs}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {createStep === "publish" ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                    <p className="text-sm font-semibold text-zinc-900">Ready to publish</p>
                    <p className="mt-1 text-sm text-zinc-600">
                      You can still edit the album later—this marks it live for sharing (UI simulation).
                    </p>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div className="rounded-xl border border-zinc-200 bg-white p-3">
                        <dt className="text-xs font-semibold text-zinc-500">Album</dt>
                        <dd className="mt-1 font-semibold text-zinc-900">{createTitle}</dd>
                      </div>
                      <div className="rounded-xl border border-zinc-200 bg-white p-3">
                        <dt className="text-xs font-semibold text-zinc-500">Layout</dt>
                        <dd className="mt-1 font-semibold text-zinc-900">{selectedCreateTemplate.title}</dd>
                      </div>
                      <div className="rounded-xl border border-zinc-200 bg-white p-3">
                        <dt className="text-xs font-semibold text-zinc-500">Photos</dt>
                        <dd className="mt-1 font-semibold text-zinc-900">{totalCreatePhotos}</dd>
                      </div>
                      <div className="rounded-xl border border-zinc-200 bg-white p-3">
                        <dt className="text-xs font-semibold text-zinc-500">Status after publish</dt>
                        <dd className="mt-1 font-semibold text-emerald-800">Published</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                    <DigitalAlbumTemplatePreview
                      templateId={DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID}
                      bannerImage={createBannerPreviewUrl}
                      highlightImages={createHighlightsPreviewUrls}
                      galleryTabs={previewGalleryTabs}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:justify-between">
              <GhostButton
                type="button"
                onClick={() => {
                  if (createStep === "template") closeCreate();
                  else if (createStep === "upload") setCreateStep("template");
                  else setCreateStep("upload");
                }}
              >
                {createStep === "template" ? "Cancel" : "Back"}
              </GhostButton>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                {createStep !== "publish" ? (
                  <PrimaryButton
                    type="button"
                    onClick={() => {
                      if (createStep === "template") {
                        if (!canContinueFromTemplate) return;
                        setCreateStep("upload");
                      } else {
                        if (!canPublish) return;
                        setCreateStep("publish");
                      }
                    }}
                    disabled={
                      createStep === "template" ? !canContinueFromTemplate : !canPublish
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      Continue
                      <ChevronRight className="h-4 w-4" strokeWidth={2} />
                    </span>
                  </PrimaryButton>
                ) : (
                  <PrimaryButton type="button" onClick={publishNewAlbum} disabled={!canPublish}>
                    Publish album
                  </PrimaryButton>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {previewAlbum ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-black/45" onClick={closePreview} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-album-title"
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
              <div>
                <p id="preview-album-title" className="text-base font-semibold text-zinc-900">
                  Album preview
                </p>
                <p className="mt-1 text-sm text-zinc-600">{previewAlbum.title}</p>
              </div>
              <button
                type="button"
                className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-800 hover:bg-zinc-50"
                onClick={closePreview}
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              <DigitalAlbumTemplatePreview templateId={previewAlbum.templateId} />
            </div>
          </div>
        </div>
      ) : null}

      {editOpen && editingAlbum ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-black/45" onClick={closeEdit} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-album-title"
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
              <div>
                <p id="edit-album-title" className="text-base font-semibold text-zinc-900">
                  Edit album
                </p>
                <p className="mt-1 text-sm text-zinc-600">Rename the album or add more photos.</p>
              </div>
              <button
                type="button"
                className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-800 hover:bg-zinc-50"
                onClick={closeEdit}
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 space-y-5">
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

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Add photos</p>
                    <p className="mt-1 text-sm text-zinc-600">
                      Increments photo count on save (local UI only).
                    </p>
                  </div>
                  <label
                    htmlFor={editUploadInputId}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                  >
                    <Upload className="h-4 w-4" strokeWidth={1.75} />
                    Upload
                  </label>
                  <input
                    id={editUploadInputId}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => onEditFiles(e.target.files)}
                  />
                </div>
                {editExtraFiles.length > 0 ? (
                  <p className="mt-3 text-sm text-zinc-700">
                    <span className="font-semibold">{editExtraFiles.length}</span> new file
                    {editExtraFiles.length === 1 ? "" : "s"} staged
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3">
              <GhostButton type="button" onClick={closeEdit}>
                Cancel
              </GhostButton>
              <PrimaryButton
                type="button"
                onClick={saveEdit}
                disabled={!editTitle.trim()}
              >
                Save changes
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function WizardSteps({ step }: { step: WizardStep }) {
  const steps: { key: WizardStep; label: string }[] = [
    { key: "template", label: "Album" },
    { key: "upload", label: "Upload" },
    { key: "publish", label: "Publish" },
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
