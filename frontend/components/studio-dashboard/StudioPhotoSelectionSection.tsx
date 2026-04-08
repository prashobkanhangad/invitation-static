"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  FolderOpen,
  Heart,
  ImagePlus,
  Layers,
  Maximize2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import ClientSelectionPreview from "@/components/studio-dashboard/ClientSelectionPreview";
import type { ClientPreviewTab } from "@/components/studio-dashboard/clientPreviewTypes";
import { GhostButton, PageHeader, PrimaryButton, StatusBadge } from "@/components/studio-dashboard/blocks";
import { studioApiFetch } from "@/utils/studioApi";

const STUDIO_DISPLAY_NAME = "Lumière Studios";

const palette = [
  "from-amber-200 to-orange-300",
  "from-rose-200 to-fuchsia-300",
  "from-sky-200 to-indigo-300",
  "from-emerald-200 to-teal-300",
  "from-zinc-200 to-zinc-400",
  "from-violet-200 to-purple-300",
];

type SelectionRoundBadge = { label: string; tone: "good" | "warn" | "neutral" };

type SelectionPhoto = {
  id: string;
  kind: "sample" | "upload";
  picked: boolean;
  fav: boolean;
  /** When client tabs exist, groups the photo in that section (`null` = only under “All” in client preview). */
  tabId: string | null;
  gradient?: string;
  blobUrl?: string;
  /** Full original filename for client downloads (uploads only). */
  fileName?: string;
  mimeType?: string;
  label: string;
};

type SelectionProject = {
  id: string;
  name: string;
  subtitle: string;
  round: SelectionRoundBadge;
  /** Optional sections shown as tabs in the client preview (managed here in the dashboard). */
  clientPreviewTabs: ClientPreviewTab[];
  /** Client gallery / link treated as live (UI only). */
  published: boolean;
  goal: number;
  stats: {
    uploadedLabel: string;
    visibleToClient: number;
    hidden: number;
  };
  photos: SelectionPhoto[];
};

function makeSampleTiles(count: number, offset = 0): SelectionPhoto[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1 + offset;
    const id = String(n);
    const picked = [2, 5, 7, 9, 12, 15, 18].includes(n);
    const fav = [5, 12].includes(n);
    return {
      id: `sample-${n}`,
      kind: "sample" as const,
      picked,
      fav,
      tabId: null as string | null,
      gradient: palette[i % palette.length]!,
      label: `IMG #${String(n).padStart(4, "0")}`,
    };
  });
}

const initialProjects: SelectionProject[] = [
  {
    id: "sel_ritu_omar",
    name: "Ritu & Omar",
    subtitle: "",
    round: { label: "Round 2", tone: "warn" },
    clientPreviewTabs: [
      { id: "tab_ceremony", label: "Ceremony" },
      { id: "tab_reception", label: "Reception" },
    ],
    published: false,
    goal: 120,
    stats: {
      uploadedLabel: "6,430",
      visibleToClient: 4820,
      hidden: 1610,
    },
    photos: makeSampleTiles(24, 0).map((photo, i) => ({
      ...photo,
      tabId: i < 12 ? "tab_ceremony" : "tab_reception",
    })),
  },
  {
    id: "sel_meera_vik",
    name: "Meera & Vikram",
    subtitle: "",
    round: { label: "Round 1", tone: "neutral" },
    clientPreviewTabs: [],
    published: false,
    goal: 80,
    stats: {
      uploadedLabel: "3,200",
      visibleToClient: 2900,
      hidden: 300,
    },
    photos: makeSampleTiles(18, 100),
  },
  {
    id: "sel_aina",
    name: "Aina — Portraits",
    subtitle: "",
    round: { label: "Final review", tone: "good" },
    clientPreviewTabs: [],
    published: false,
    goal: 40,
    stats: {
      uploadedLabel: "640",
      visibleToClient: 640,
      hidden: 0,
    },
    photos: makeSampleTiles(12, 220),
  },
];

function toneForRound(tone: SelectionRoundBadge["tone"]) {
  if (tone === "good") return "good" as const;
  if (tone === "warn") return "warn" as const;
  return "neutral" as const;
}

export default function StudioPhotoSelectionSection() {
  const [projects, setProjects] = useState<SelectionProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDetails, setNewProjectDetails] = useState("");
  const [clientPreviewOpen, setClientPreviewOpen] = useState(false);
  const [newTabLabelDraft, setNewTabLabelDraft] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadModalFiles, setUploadModalFiles] = useState<File[]>([]);
  const [uploadModalPreviewUrls, setUploadModalPreviewUrls] = useState<string[]>([]);
  const [uploadModalTabChoice, setUploadModalTabChoice] = useState("");
  const [uploadModalSubmitting, setUploadModalSubmitting] = useState(false);
  const [uploadModalError, setUploadModalError] = useState<string | null>(null);
  const [studioFilterSelectedOnly, setStudioFilterSelectedOnly] = useState(false);
  const [studioFilterFavouriteOnly, setStudioFilterFavouriteOnly] = useState(false);
  const [studioImagePreviewId, setStudioImagePreviewId] = useState<string | null>(null);

  const uploadModalInputId = useId();

  const mapApiProjectToUi = (p: any): SelectionProject => {
    const photos = Array.isArray(p?.photoSelection?.photos)
      ? p.photoSelection.photos.map((ph: any, idx: number) => ({
          id: String(ph.id ?? `ph-${idx}`),
          kind: "upload" as const,
          picked: Boolean(ph.picked),
          fav: Boolean(ph.fav),
          tabId: (typeof ph.tabId === "string" ? ph.tabId : null) as string | null,
          blobUrl: String(ph.url || ""),
          label: String(ph.originalName || ph.id || `IMG #${idx + 1}`),
          fileName: String(ph.originalName || ""),
          mimeType: String(ph.mimeType || ""),
        }))
      : [];
    const tabs = Array.isArray(p?.photoSelection?.clientTabs)
      ? p.photoSelection.clientTabs.map((t: any) => ({
          id: String(t.id),
          label: String(t.label || "Tab"),
        }))
      : [];
    const goal = Number(p?.photoSelection?.goal || 120);
    return {
      id: String(p?._id ?? p?.id ?? ""),
      name: String(p?.name ?? "Untitled project"),
      subtitle: "",
      round: { label: p?.photoSelection?.published ? "Published" : "Draft", tone: p?.photoSelection?.published ? "good" : "neutral" },
      clientPreviewTabs: tabs,
      published: Boolean(p?.photoSelection?.published),
      goal,
      stats: {
        uploadedLabel: String(photos.length),
        visibleToClient: photos.length,
        hidden: 0,
      },
      photos,
    };
  };

  useEffect(() => {
    let cancelled = false;
    async function loadProjects() {
      setProjectsError(null);
      try {
        const data = await studioApiFetch<{ projects: any[] }>("/api/studio/photo-selection/projects");
        if (cancelled) return;
        setProjects(data.projects.map(mapApiProjectToUi));
      } catch (e) {
        if (cancelled) return;
        setProjectsError(e instanceof Error ? e.message : "Failed to load projects");
        setProjects(initialProjects);
      }
    }
    void loadProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? null,
    [projects, activeProjectId]
  );

  const pickedCount = activeProject ? activeProject.photos.filter((p) => p.picked).length : 0;

  const filteredWorkspacePhotos = useMemo(() => {
    if (!activeProject) return [];
    return activeProject.photos.filter((ph) => {
      if (studioFilterSelectedOnly && !ph.picked) return false;
      if (studioFilterFavouriteOnly && !ph.fav) return false;
      return true;
    });
  }, [activeProject, studioFilterSelectedOnly, studioFilterFavouriteOnly]);

  useEffect(() => {
    setStudioImagePreviewId(null);
    setStudioFilterSelectedOnly(false);
    setStudioFilterFavouriteOnly(false);
    if (!activeProjectId) {
      setUploadModalOpen(false);
      setUploadModalPreviewUrls((prev) => {
        prev.forEach((u) => URL.revokeObjectURL(u));
        return [];
      });
      setUploadModalFiles([]);
      setUploadModalTabChoice("");
    }
  }, [activeProjectId]);

  useEffect(() => {
    if (!studioImagePreviewId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStudioImagePreviewId(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [studioImagePreviewId]);

  const togglePick = (photoId: string) => {
    if (!activeProjectId) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== activeProjectId
          ? p
          : {
              ...p,
              photos: p.photos.map((ph) => (ph.id === photoId ? { ...ph, picked: !ph.picked } : ph)),
            }
      )
    );
    void studioApiFetch(`/api/studio/photo-selection/projects/${activeProjectId}/photos/${photoId}`, {
      method: "PATCH",
      body: {
        picked: !(activeProject?.photos.find((ph) => ph.id === photoId)?.picked ?? false),
      },
    }).catch(() => {});
  };

  const toggleFav = (photoId: string) => {
    if (!activeProjectId) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== activeProjectId
          ? p
          : {
              ...p,
              photos: p.photos.map((ph) => (ph.id === photoId ? { ...ph, fav: !ph.fav } : ph)),
            }
      )
    );
    void studioApiFetch(`/api/studio/photo-selection/projects/${activeProjectId}/photos/${photoId}`, {
      method: "PATCH",
      body: {
        fav: !(activeProject?.photos.find((ph) => ph.id === photoId)?.fav ?? false),
      },
    }).catch(() => {});
  };

  const publishSelection = async () => {
    if (!activeProjectId) return;
    try {
      await studioApiFetch(`/api/studio/photo-selection/projects/${activeProjectId}/publish`, { method: "POST" });
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProjectId ? { ...p, published: true, round: { label: "Published", tone: "good" } } : p))
      );
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to publish");
    }
  };

  const addClientPreviewTab = async () => {
    const label = newTabLabelDraft.trim();
    if (!label || !activeProjectId) return;
    const tabId = `tab_${Date.now()}`;
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== activeProjectId
          ? p
          : { ...p, clientPreviewTabs: [...p.clientPreviewTabs, { id: tabId, label }] }
      )
    );
    setNewTabLabelDraft("");
    try {
      const updatedTabs =
        projects.find((p) => p.id === activeProjectId)?.clientPreviewTabs.map((t) =>
          t.id === tabId ? { ...t, label } : t
        ) ?? [];
      await studioApiFetch(`/api/studio/photo-selection/projects/${activeProjectId}`, {
        method: "PATCH",
        body: {
          clientTabs: updatedTabs,
        },
      });
    } catch {}
  };

  const removeClientPreviewTab = async (tabId: string) => {
    if (!activeProjectId) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== activeProjectId
          ? p
          : {
              ...p,
              clientPreviewTabs: p.clientPreviewTabs.filter((t) => t.id !== tabId),
              photos: p.photos.map((ph) => (ph.tabId === tabId ? { ...ph, tabId: null } : ph)),
            }
      )
    );
    try {
      const updatedTabs = (projects.find((p) => p.id === activeProjectId)?.clientPreviewTabs ?? []).filter((t) => t.id !== tabId);
      await studioApiFetch(`/api/studio/photo-selection/projects/${activeProjectId}`, {
        method: "PATCH",
        body: { clientTabs: updatedTabs },
      });
    } catch {}
  };

  const commitPhotoUpload = async (files: File[], tabId: string | null) => {
    if (!activeProjectId || !files.length) return;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        const nextPhotos = files.map((file, idx) => ({
          id: `up-${Date.now()}-${idx}-${Math.random().toString(16).slice(2)}`,
          kind: "upload" as const,
          picked: false,
          fav: false,
          tabId,
          blobUrl: URL.createObjectURL(file),
          label: file.name.length > 22 ? `${file.name.slice(0, 20)}…` : file.name,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
        }));
        const total = p.photos.length + nextPhotos.length;
        return {
          ...p,
          photos: [...p.photos, ...nextPhotos],
          stats: {
            ...p.stats,
            uploadedLabel: total.toLocaleString(),
            visibleToClient: p.stats.visibleToClient + nextPhotos.length,
          },
        };
      })
    );
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));
    if (tabId) fd.append("tabId", tabId);
    const resp = await studioApiFetch<{ photos: any[] }>(`/api/studio/photo-selection/projects/${activeProjectId}/photos`, {
      method: "POST",
      formData: fd,
    });
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        const persisted = resp.photos.map((ph, idx) => ({
          id: String(ph.id ?? `up-${Date.now()}-${idx}`),
          kind: "upload" as const,
          picked: Boolean(ph.picked),
          fav: Boolean(ph.fav),
          tabId: (typeof ph.tabId === "string" ? ph.tabId : null) as string | null,
          blobUrl: String(ph.url || ""),
          label: String(ph.originalName || ph.id || `IMG #${idx + 1}`),
          fileName: String(ph.originalName || ""),
          mimeType: String(ph.mimeType || ""),
        }));
        return {
          ...p,
          photos: [...p.photos.filter((ph) => !ph.id.startsWith("up-")), ...persisted],
          stats: {
            ...p.stats,
            uploadedLabel: String(persisted.length),
            visibleToClient: persisted.length,
          },
        };
      })
    );
  };

  const openUploadModal = () => {
    setUploadModalFiles([]);
    setUploadModalPreviewUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return [];
    });
    setUploadModalTabChoice("");
    setUploadModalError(null);
    setUploadModalSubmitting(false);
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    if (uploadModalSubmitting) return;
    setUploadModalOpen(false);
    setUploadModalPreviewUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return [];
    });
    setUploadModalFiles([]);
    setUploadModalTabChoice("");
    setUploadModalError(null);
    setUploadModalSubmitting(false);
  };

  const onModalFilesPicked = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const next = Array.from(fileList);
    setUploadModalFiles((prev) => [...prev, ...next]);
    const urls = next.map((f) => URL.createObjectURL(f));
    setUploadModalPreviewUrls((prev) => [...prev, ...urls]);
  };

  const removeModalFileAt = (index: number) => {
    setUploadModalPreviewUrls((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
    setUploadModalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmUploadModal = async () => {
    if (uploadModalFiles.length === 0) return;
    if (uploadModalSubmitting) return;
    setUploadModalError(null);
    setUploadModalSubmitting(true);
    const tabId = uploadModalTabChoice === "" ? null : uploadModalTabChoice;
    try {
      await commitPhotoUpload(uploadModalFiles, tabId);
      closeUploadModal();
    } catch (e) {
      setUploadModalError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploadModalSubmitting(false);
    }
  };

  const resetNewProjectForm = () => {
    setNewProjectName("");
    setNewProjectDetails("");
  };

  const openNewProjectModal = () => {
    resetNewProjectForm();
    setNewProjectOpen(true);
  };

  const closeNewProjectModal = () => {
    setNewProjectOpen(false);
    resetNewProjectForm();
  };

  const submitNewProject = async () => {
    const name = newProjectName.trim();
    if (!name) return;
    const details = newProjectDetails.trim();
    const id = `sel_${Date.now()}`;
    const next: SelectionProject = {
      id,
      name,
      subtitle: details || "No additional details",
      round: { label: "Draft", tone: "neutral" },
      clientPreviewTabs: [],
      published: false,
      goal: 120,
      stats: {
        uploadedLabel: "0",
        visibleToClient: 0,
        hidden: 0,
      },
      photos: [],
    };
    try {
      const created = await studioApiFetch<{ project: any }>("/api/studio/photo-selection/projects", {
        method: "POST",
        body: { name, goal: 120 },
      });
      const mapped = mapApiProjectToUi(created.project);
      setProjects((prev) => [mapped, ...prev]);
      setActiveProjectId(mapped.id);
      closeNewProjectModal();
    } catch (e) {
      setProjects((prev) => [next, ...prev]);
      setActiveProjectId(id);
      closeNewProjectModal();
    }
  };

  const newProjectModal =
    newProjectOpen ? (
      <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
        <button
          type="button"
          aria-label="Close"
          className="absolute inset-0 bg-black/45"
          onClick={closeNewProjectModal}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-selection-project-title"
          className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:rounded-3xl"
        >
          <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
            <div>
              <p id="new-selection-project-title" className="text-base font-semibold text-zinc-900">
                New selection project
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                Name the job and add context your team will see in the list and workspace header.
              </p>
            </div>
            <button
              type="button"
              className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-800 hover:bg-zinc-50"
              onClick={closeNewProjectModal}
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 space-y-5">
            <div>
              <label htmlFor="new-selection-project-name" className="text-sm font-semibold text-zinc-900">
                Project name <span className="font-normal text-red-600">*</span>
              </label>
              <input
                id="new-selection-project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g. Anika & Dev — Mumbai wedding"
                autoFocus
                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 placeholder:text-zinc-400 focus:ring-4"
              />
            </div>
            <div>
              <label htmlFor="new-selection-project-details" className="text-sm font-semibold text-zinc-900">
                Details
              </label>
              <textarea
                id="new-selection-project-details"
                value={newProjectDetails}
                onChange={(e) => setNewProjectDetails(e.target.value)}
                placeholder="Event dates, venue, package tier, deliverable count, notes for assistants…"
                rows={5}
                className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none ring-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 min-h-[120px]"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Shown as the subtitle under the project name. Optional—leave blank to use “No additional details”.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3">
            <GhostButton type="button" onClick={closeNewProjectModal}>
              Cancel
            </GhostButton>
            <PrimaryButton type="button" onClick={submitNewProject} disabled={!newProjectName.trim()}>
              Create & open project
            </PrimaryButton>
          </div>
        </div>
      </div>
    ) : null;

  if (activeProject) {
    const p = activeProject;
    const studioPreviewPhoto =
      studioImagePreviewId !== null
        ? (p.photos.find((ph) => ph.id === studioImagePreviewId) ?? null)
        : null;

    const uploadPhotoModal =
      uploadModalOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/45"
            onClick={closeUploadModal}
            disabled={uploadModalSubmitting}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-photos-title"
            className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
              <div>
                <p id="upload-photos-title" className="text-base font-semibold text-zinc-900">
                  Upload photos
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Choose files, pick a client preview section if you use tabs, then add them to this project.
                </p>
              </div>
              <button
                type="button"
                className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-800 hover:bg-zinc-50"
                onClick={closeUploadModal}
                disabled={uploadModalSubmitting}
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 space-y-5">
              <div>
                <label htmlFor={uploadModalInputId} className="text-sm font-semibold text-zinc-900">
                  Files
                </label>
                <div className="mt-2 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-zinc-400" strokeWidth={1.5} />
                  <p className="mt-3 text-sm font-semibold text-zinc-900">Drop images here or browse</p>
                  <p className="mt-1 text-xs text-zinc-600">JPEG, PNG, WebP · multi-select</p>
                  <label
                    htmlFor={uploadModalInputId}
                    className={[
                      "mt-4 inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white",
                      uploadModalSubmitting ? "cursor-not-allowed bg-zinc-500" : "cursor-pointer bg-zinc-900 hover:bg-zinc-800",
                    ].join(" ")}
                  >
                    Choose files
                  </label>
                  <input
                    id={uploadModalInputId}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    disabled={uploadModalSubmitting}
                    onChange={(e) => {
                      onModalFilesPicked(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="upload-modal-client-tab" className="text-sm font-semibold text-zinc-900">
                  Client preview section
                </label>
                <select
                  id="upload-modal-client-tab"
                  value={uploadModalTabChoice}
                  onChange={(e) => setUploadModalTabChoice(e.target.value)}
                  disabled={p.clientPreviewTabs.length === 0}
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500"
                >
                  <option value="">All gallery only (unassigned)</option>
                  {p.clientPreviewTabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
                </select>
                {p.clientPreviewTabs.length === 0 ? (
                  <p className="mt-2 text-xs text-zinc-500">
                    No tabs yet—photos stay unassigned until you add sections under Client preview tabs in the sidebar.
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-zinc-500">
                    {uploadModalTabChoice
                      ? `This batch goes to the client tab: ${p.clientPreviewTabs.find((t) => t.id === uploadModalTabChoice)?.label ?? "section"}.`
                      : "Unassigned batches appear only under All photos in the client preview."}
                  </p>
                )}
              </div>

              {uploadModalFiles.length > 0 ? (
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {uploadModalFiles.length} file{uploadModalFiles.length === 1 ? "" : "s"} selected
                  </p>
                  <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {uploadModalFiles.map((file, idx) => (
                      <li key={`${file.name}-${idx}`} className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200/80">
                        <img alt="" src={uploadModalPreviewUrls[idx]} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeModalFileAt(idx)}
                          disabled={uploadModalSubmitting}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {uploadModalError ? <p className="text-sm font-medium text-red-600">{uploadModalError}</p> : null}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3">
              {uploadModalSubmitting ? (
                <p className="mr-auto self-center text-sm font-medium text-zinc-700">
                  Uploading {uploadModalFiles.length} file{uploadModalFiles.length === 1 ? "" : "s"}...
                </p>
              ) : null}
              <GhostButton type="button" onClick={closeUploadModal} disabled={uploadModalSubmitting}>
                Cancel
              </GhostButton>
              <PrimaryButton
                type="button"
                onClick={() => void confirmUploadModal()}
                disabled={uploadModalFiles.length === 0 || uploadModalSubmitting}
              >
                {uploadModalSubmitting ? "Uploading..." : "Add to project"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null;

    return (
      <>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setActiveProjectId(null)}
              className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
              aria-label="Back to projects"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Photo selection</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{p.name}</h1>
              {p.subtitle.trim() ? (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">{p.subtitle}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {p.published ? (
              <span className="inline-flex h-10 items-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-900">
                Published · client link live (UI)
              </span>
            ) : (
              <PrimaryButton
                type="button"
                onClick={publishSelection}
                disabled={p.photos.length === 0}
                title={p.photos.length === 0 ? "Add at least one photo before publishing" : undefined}
              >
                Publish
              </PrimaryButton>
            )}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-2">
                <Layers className="mt-0.5 h-5 w-5 shrink-0 text-zinc-700" strokeWidth={1.75} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">Client preview tabs</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                    Optional sections for the client gallery. Add tabs here, pick a section when you upload photos, then
                    open Client preview to verify.
                  </p>
                </div>
              </div>

              {p.clientPreviewTabs.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {p.clientPreviewTabs.map((tab) => (
                    <li
                      key={tab.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2"
                    >
                      <span className="text-sm font-medium text-zinc-900">{tab.label}</span>
                      <button
                        type="button"
                        onClick={() => removeClientPreviewTab(tab.id)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-white hover:text-zinc-900"
                        aria-label={`Remove tab ${tab.label}`}
                      >
                        <X className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-zinc-500">No tabs yet—clients see one continuous gallery.</p>
              )}

              <div className="mt-4 flex gap-2">
                <input
                  value={newTabLabelDraft}
                  onChange={(e) => setNewTabLabelDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addClientPreviewTab();
                    }
                  }}
                  placeholder="e.g. Sangeet, Ceremony, Portraits"
                  className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 placeholder:text-zinc-400 focus:ring-4"
                />
                <PrimaryButton type="button" onClick={addClientPreviewTab} disabled={!newTabLabelDraft.trim()}>
                  Add
                </PrimaryButton>
              </div>
            </div>
          </aside>

          <section className="min-w-0 space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStudioFilterSelectedOnly((v) => !v)}
                  className={[
                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
                    studioFilterSelectedOnly
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                  ].join(" ")}
                >
                  <Check className="h-4 w-4" strokeWidth={2} />
                  Selected
                </button>
                <button
                  type="button"
                  onClick={() => setStudioFilterFavouriteOnly((v) => !v)}
                  className={[
                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
                    studioFilterFavouriteOnly
                      ? "border-rose-600 bg-rose-600 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                  ].join(" ")}
                >
                  <Heart
                    className={["h-4 w-4", studioFilterFavouriteOnly ? "fill-current" : "text-rose-600"].join(" ")}
                    strokeWidth={1.75}
                  />
                  Favourite
                </button>
                {studioFilterSelectedOnly || studioFilterFavouriteOnly ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStudioFilterSelectedOnly(false);
                      setStudioFilterFavouriteOnly(false);
                    }}
                    className="text-xs font-semibold text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={openUploadModal}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
                >
                  <ImagePlus className="h-4 w-4" strokeWidth={1.75} />
                  Add photos
                </button>
                <GhostButton
                  type="button"
                  onClick={() => {
                    setStudioImagePreviewId(null);
                    setClientPreviewOpen(true);
                  }}
                >
                  Client preview
                </GhostButton>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
              {p.photos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
                  <ImagePlus className="mx-auto h-10 w-10 text-zinc-400" strokeWidth={1.5} />
                  <p className="mt-4 text-sm font-semibold text-zinc-900">No photos yet</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Upload images to build the selection grid. Everything stays in-browser for this UI preview.
                  </p>
                  <button
                    type="button"
                    onClick={openUploadModal}
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
                  >
                    Upload photos
                  </button>
                </div>
              ) : filteredWorkspacePhotos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-12 text-center">
                  <p className="text-sm font-semibold text-zinc-900">No photos match these filters</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Try turning off Selected or Favourite, or pick more images in the grid.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStudioFilterSelectedOnly(false);
                      setStudioFilterFavouriteOnly(false);
                    }}
                    className="mt-4 text-sm font-semibold text-zinc-900 underline underline-offset-2"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {filteredWorkspacePhotos.map((t) => (
                    <div key={t.id} className="relative aspect-square w-full">
                      <button
                        type="button"
                        onClick={() => togglePick(t.id)}
                        className={[
                          "group absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br ring-1 ring-black/5 transition",
                          t.kind === "sample" ? t.gradient : "from-zinc-100 to-zinc-200",
                          t.picked ? "ring-2 ring-emerald-500/80" : "hover:ring-2 hover:ring-zinc-400/60",
                        ].join(" ")}
                      >
                        {t.kind === "upload" && t.blobUrl ? (
                          <img alt="" src={t.blobUrl} className="absolute inset-0 h-full w-full object-cover" />
                        ) : null}
                        <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/10 opacity-80" />
                        <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-zinc-900 ring-1 ring-black/10">
                          {t.label}
                        </span>
                        {t.fav ? (
                          <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-600 ring-1 ring-black/10">
                            <Heart className="h-4 w-4 fill-current" strokeWidth={1.75} />
                          </span>
                        ) : null}
                        {t.picked ? (
                          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            <Check className="h-3 w-3" strokeWidth={2.5} />
                            Picked
                          </span>
                        ) : (
                          <span className="absolute bottom-2 left-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                            Tap to pick
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setStudioImagePreviewId(t.id);
                        }}
                        className="absolute bottom-2 right-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200/90 bg-white/95 text-zinc-800 shadow-md hover:bg-white"
                        aria-label={`Preview ${t.label} larger`}
                      >
                        <Maximize2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-4 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  <span className="font-semibold text-zinc-900">Tip:</span> expand icon opens a large preview; tap the
                  tile to toggle picked.
                </p>
                <p className="font-mono text-[11px] text-zinc-500">UI mock</p>
              </div>
            </div>
          </section>
        </div>

        {studioPreviewPhoto ? (
          <div className="fixed inset-0 z-[75] flex flex-col items-center justify-center p-4 sm:p-8">
            <button
              type="button"
              aria-label="Close preview"
              className="absolute inset-0 bg-black/85"
              onClick={() => setStudioImagePreviewId(null)}
            />
            <div className="relative z-10 flex w-full max-w-5xl flex-col gap-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStudioImagePreviewId(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
              <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-white/15">
                {studioPreviewPhoto.kind === "upload" && studioPreviewPhoto.blobUrl ? (
                  <img
                    src={studioPreviewPhoto.blobUrl}
                    alt=""
                    className="mx-auto max-h-[85vh] w-auto max-w-full object-contain"
                  />
                ) : (
                  <div
                    className={[
                      "mx-auto flex min-h-[min(50vh,360px)] w-full max-w-full items-center justify-center bg-gradient-to-br sm:min-h-[min(65vh,520px)]",
                      studioPreviewPhoto.gradient ?? "",
                    ].join(" ")}
                  />
                )}
              </div>
              <p className="text-center text-sm font-medium text-white">{studioPreviewPhoto.label}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePick(studioPreviewPhoto.id)}
                  className="inline-flex h-10 items-center rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20"
                >
                  {studioPreviewPhoto.picked ? "Remove from selection" : "Mark selected"}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFav(studioPreviewPhoto.id)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20"
                >
                  <Heart
                    className={["h-4 w-4", studioPreviewPhoto.fav ? "fill-current text-rose-300" : ""].join(" ")}
                    strokeWidth={1.75}
                  />
                  {studioPreviewPhoto.fav ? "Remove favourite" : "Mark favourite"}
                </button>
              </div>
              <p className="text-center text-xs text-white/60">Escape or backdrop to close</p>
            </div>
          </div>
        ) : null}
        {uploadPhotoModal}
        {clientPreviewOpen ? (
          <ClientSelectionPreview
            key={p.id}
            studioName={STUDIO_DISPLAY_NAME}
            projectName={p.name}
            subtitle={p.subtitle}
            pickedCount={pickedCount}
            photoCount={p.photos.length}
            published={p.published}
            clientTabs={p.clientPreviewTabs}
            photos={p.photos}
            onClose={() => setClientPreviewOpen(false)}
            onTogglePick={togglePick}
            onToggleFav={toggleFav}
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Module 4"
        title="Photo selection for clients"
        description="Choose a project to open the culling workspace, then upload additional photos anytime. State is local to this browser session."
        actions={
          <PrimaryButton type="button" onClick={openNewProjectModal}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" strokeWidth={2} />
              New project
            </span>
          </PrimaryButton>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
              <FolderOpen className="h-5 w-5 text-zinc-900" strokeWidth={1.75} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Selection projects</h2>
              <p className="text-sm text-zinc-600">{projects.length} projects · open one to upload and cull</p>
            </div>
          </div>
        </div>
        {projectsError ? <div className="px-5 py-2 text-sm text-red-700">{projectsError}</div> : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-3">Project</th>
                <th className="px-5 py-3">Photos</th>
                <th className="px-5 py-3">Goal</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {projects.map((proj) => {
                const picks = proj.photos.filter((ph) => ph.picked).length;
                return (
                  <tr key={proj.id} className="bg-white">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-zinc-900">{proj.name}</p>
                      {proj.subtitle.trim() ? (
                        <p className="mt-0.5 text-xs text-zinc-600">{proj.subtitle}</p>
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-zinc-700">{proj.photos.length.toLocaleString()}</td>
                    <td className="px-5 py-3 text-zinc-700">
                      {picks} / {proj.goal} picks
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={proj.published ? "good" : toneForRound(proj.round.tone)}>
                        {proj.published ? "Published" : proj.round.label}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveProjectId(proj.id)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Open
                        <ChevronRight className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {newProjectModal}
    </>
  );
}
