"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  FolderOpen,
  Heart,
  ImagePlus,
  Layers,
  Link2,
  Lock,
  Maximize2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { ClientPreviewTab } from "@/components/studio-dashboard/clientPreviewTypes";
import { GhostButton, PageHeader, PrimaryButton, StatusBadge } from "@/components/studio-dashboard/blocks";
import { studioApiFetch } from "@/utils/studioApi";
import { uploadPhotoSelectionDirect } from "@/utils/studioDirectUpload";

const STUDIO_TABLE_SHIMMER =
  "bg-gradient-to-r from-zinc-200 via-zinc-50 to-zinc-200 bg-[length:200%_100%] animate-shimmer";

type SelectionRoundBadge = { label: string; tone: "good" | "warn" | "neutral" };

type SelectionPhoto = {
  id: string;
  picked: boolean;
  fav: boolean;
  /** When client tabs exist, groups the photo in that section (`null` = only under “All” in client preview). */
  tabId: string | null;
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
  shareToken: string | null;
  /** Public client URL uses `/photos/{slug}`. */
  slug: string | null;
  /** When true, clients must enter PIN to open the public gallery. */
  pinEnabled: boolean;
  stats: {
    uploadedLabel: string;
    visibleToClient: number;
    hidden: number;
  };
  ogImage: {
    url: string;
    originalUrl: string;
    label: string;
  } | null;
  photos: SelectionPhoto[];
};

function toneForRound(tone: SelectionRoundBadge["tone"]) {
  if (tone === "good") return "good" as const;
  if (tone === "warn") return "warn" as const;
  return "neutral" as const;
}

export default function StudioPhotoSelectionSection() {
  const [projects, setProjects] = useState<SelectionProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDetails, setNewProjectDetails] = useState("");
  const [newProjectPinEnabled, setNewProjectPinEnabled] = useState(false);
  const [newProjectPin, setNewProjectPin] = useState("");
  const [newTabLabelDraft, setNewTabLabelDraft] = useState("");
  const [pinDraftEnabled, setPinDraftEnabled] = useState(false);
  const [pinDraftInput, setPinDraftInput] = useState("");
  const [workspacePinVisible, setWorkspacePinVisible] = useState(false);
  const [pinSettingsSaving, setPinSettingsSaving] = useState(false);
  const [pinSettingsMessage, setPinSettingsMessage] = useState<string | null>(null);
  const [newProjectPinVisible, setNewProjectPinVisible] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadModalFiles, setUploadModalFiles] = useState<File[]>([]);
  const [uploadModalTabChoice, setUploadModalTabChoice] = useState("");
  const [uploadModalSubmitting, setUploadModalSubmitting] = useState(false);
  const [uploadModalProgress, setUploadModalProgress] = useState(0);
  const [uploadModalError, setUploadModalError] = useState<string | null>(null);
  const [studioFilterSelectedOnly, setStudioFilterSelectedOnly] = useState(false);
  const [studioFilterFavouriteOnly, setStudioFilterFavouriteOnly] = useState(false);
  const [studioFilterTabId, setStudioFilterTabId] = useState<string>("__all__");
  const [studioImagePreviewId, setStudioImagePreviewId] = useState<string | null>(null);
  const [copiedProjectId, setCopiedProjectId] = useState<string | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [deletingTabId, setDeletingTabId] = useState<string | null>(null);
  const [ogImageUploading, setOgImageUploading] = useState(false);
  const [ogImageUploadError, setOgImageUploadError] = useState<string | null>(null);

  const uploadModalInputId = useId();
  const ogImageInputId = useId();

  const mapApiProjectToUi = (p: any): SelectionProject => {
    const photos = Array.isArray(p?.photoSelection?.photos)
      ? p.photoSelection.photos.map((ph: any, idx: number) => ({
          id: String(ph.id ?? `ph-${idx}`),
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
    const ogRaw = p?.photoSelection?.ogImage;
    const ogImage =
      ogRaw && typeof ogRaw === "object" && typeof ogRaw.url === "string" && ogRaw.url.trim()
        ? {
            url: String(ogRaw.url),
            originalUrl: String(ogRaw.originalUrl || ""),
            label: String(ogRaw.originalName || "OG image"),
          }
        : null;
    return {
      id: String(p?._id ?? p?.id ?? ""),
      name: String(p?.name ?? "Untitled project"),
      subtitle: "",
      round: { label: p?.photoSelection?.published ? "Published" : "Draft", tone: p?.photoSelection?.published ? "good" : "neutral" },
      clientPreviewTabs: tabs,
      published: Boolean(p?.photoSelection?.published),
      shareToken: typeof p?.shareToken === "string" ? p.shareToken : null,
      slug: typeof p?.slug === "string" && p.slug ? p.slug : null,
      pinEnabled: Boolean(p?.photoSelection?.pinEnabled),
      stats: {
        uploadedLabel: String(photos.length),
        visibleToClient: photos.length,
        hidden: 0,
      },
      ogImage,
      photos,
    };
  };

  useEffect(() => {
    let cancelled = false;
    async function loadProjects() {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const data = await studioApiFetch<{ projects: any[] }>("/api/studio/photo-selection/projects");
        if (cancelled) return;
        setProjects(data.projects.map(mapApiProjectToUi));
      } catch (e) {
        if (cancelled) return;
        setProjectsError(e instanceof Error ? e.message : "Failed to load projects");
        setProjects([]);
      } finally {
        if (!cancelled) setProjectsLoading(false);
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

  const pinSettingsDirty = useMemo(() => {
    if (!activeProject) return false;
    if (pinDraftEnabled !== activeProject.pinEnabled) return true;
    if (pinDraftEnabled && activeProject.pinEnabled && pinDraftInput.trim().length > 0) return true;
    return false;
  }, [activeProject, pinDraftEnabled, pinDraftInput]);

  const canSavePinSettings = useMemo(() => {
    if (!pinSettingsDirty || !activeProject) return false;
    if (!pinDraftEnabled && activeProject.pinEnabled) return true;
    if (pinDraftEnabled && !activeProject.pinEnabled) {
      return /^\d{4,8}$/.test(pinDraftInput.trim());
    }
    if (pinDraftEnabled && activeProject.pinEnabled && pinDraftInput.trim()) {
      return /^\d{4,8}$/.test(pinDraftInput.trim());
    }
    return false;
  }, [pinSettingsDirty, activeProject, pinDraftEnabled, pinDraftInput]);

  const pickedCount = activeProject ? activeProject.photos.filter((p) => p.picked).length : 0;

  const filteredWorkspacePhotos = useMemo(() => {
    if (!activeProject) return [];
    return activeProject.photos.filter((ph) => {
      if (studioFilterSelectedOnly && !ph.picked) return false;
      if (studioFilterFavouriteOnly && !ph.fav) return false;
      if (studioFilterTabId === "__unassigned__" && ph.tabId !== null) return false;
      if (studioFilterTabId !== "__all__" && studioFilterTabId !== "__unassigned__" && ph.tabId !== studioFilterTabId) {
        return false;
      }
      return true;
    });
  }, [activeProject, studioFilterSelectedOnly, studioFilterFavouriteOnly, studioFilterTabId]);

  useEffect(() => {
    setStudioImagePreviewId(null);
    setStudioFilterSelectedOnly(false);
    setStudioFilterFavouriteOnly(false);
    setStudioFilterTabId("__all__");
    setPinDraftInput("");
    setPinSettingsMessage(null);
    setOgImageUploadError(null);
    setWorkspacePinVisible(false);
    if (!activeProjectId) {
      setUploadModalOpen(false);
      setUploadModalFiles([]);
      setUploadModalTabChoice("");
    }
  }, [activeProjectId]);

  useEffect(() => {
    if (!activeProject) return;
    setPinDraftEnabled(activeProject.pinEnabled);
  }, [activeProjectId, activeProject?.pinEnabled]);

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

  const deletePhotoById = async (photoId: string, label: string) => {
    if (!activeProjectId) return;
    if (!window.confirm(`Delete photo "${label}" from this project? This cannot be undone.`)) return;

    setDeletingPhotoId(photoId);
    try {
      await studioApiFetch(`/api/studio/photo-selection/projects/${activeProjectId}/photos/${photoId}`, {
        method: "DELETE",
      });
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== activeProjectId) return p;
          const nextPhotos = p.photos.filter((ph) => ph.id !== photoId);
          return {
            ...p,
            photos: nextPhotos,
            stats: {
              ...p.stats,
              uploadedLabel: String(nextPhotos.length),
              visibleToClient: nextPhotos.length,
            },
          };
        })
      );
      setStudioImagePreviewId((prev) => (prev === photoId ? null : prev));
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to delete photo");
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const uploadSelectionOgImage = async (file: File) => {
    if (!activeProjectId) return;
    setOgImageUploadError(null);
    setOgImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const resp = await studioApiFetch<{ ogImage?: any; project?: any }>(
        `/api/studio/photo-selection/projects/${encodeURIComponent(activeProjectId)}/og-image`,
        {
          method: "POST",
          formData,
        }
      );
      const mapped = resp?.project ? mapApiProjectToUi(resp.project) : null;
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== activeProjectId) return p;
          if (mapped) return { ...p, ...mapped };
          const og = resp?.ogImage;
          if (og && typeof og === "object" && typeof og.url === "string" && og.url.trim()) {
            return {
              ...p,
              ogImage: {
                url: String(og.url),
                originalUrl: String(og.originalUrl || ""),
                label: String(og.originalName || "OG image"),
              },
            };
          }
          return p;
        })
      );
    } catch (e) {
      setOgImageUploadError(e instanceof Error ? e.message : "Failed to upload OG image");
    } finally {
      setOgImageUploading(false);
    }
  };

  const publishSelection = async () => {
    if (!activeProjectId) return;
    try {
      const resp = await studioApiFetch<{ project: any }>(`/api/studio/photo-selection/projects/${activeProjectId}/publish`, {
        method: "POST",
      });
      const mapped = resp?.project ? mapApiProjectToUi(resp.project) : null;
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? mapped
              ? { ...p, ...mapped, photos: p.photos }
              : {
                  ...p,
                  published: true,
                  shareToken:
                    typeof resp?.project?.shareToken === "string" && resp.project.shareToken
                      ? resp.project.shareToken
                      : p.shareToken,
                  slug:
                    typeof resp?.project?.slug === "string" && resp.project.slug.trim()
                      ? resp.project.slug.trim()
                      : p.slug,
                  round: { label: "Published", tone: "good" },
                }
            : p
        )
      );
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to publish");
    }
  };

  const deletePhotoSelectionById = async (projectId: string, displayName: string) => {
    if (
      !window.confirm(
        `Delete project "${displayName}"? All photos, tabs, and settings will be removed. This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      await studioApiFetch(`/api/studio/photo-selection/projects/${encodeURIComponent(projectId)}`, {
        method: "DELETE",
      });
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      }
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to delete project");
    }
  };

  const addClientPreviewTab = async () => {
    const label = newTabLabelDraft.trim();
    if (!label || !activeProjectId) return;
    const tabId = `tab_${Date.now()}`;
    const existingTabs = projects.find((p) => p.id === activeProjectId)?.clientPreviewTabs ?? [];
    const updatedTabs = [...existingTabs, { id: tabId, label }];
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== activeProjectId
          ? p
          : { ...p, clientPreviewTabs: updatedTabs }
      )
    );
    setNewTabLabelDraft("");
    try {
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
    const project = projects.find((p) => p.id === activeProjectId);
    const tab = project?.clientPreviewTabs.find((t) => t.id === tabId);
    if (!project || !tab) return;
    const tabPhotos = project.photos.filter((ph) => ph.tabId === tabId);
    if (
      !window.confirm(
        `Delete tab "${tab.label}"?\n\nThis will permanently delete ${tabPhotos.length} photo${
          tabPhotos.length === 1 ? "" : "s"
        } in this tab and remove the tab. This cannot be undone.`
      )
    ) {
      return;
    }
    setDeletingTabId(tabId);
    try {
      if (tabPhotos.length > 0) {
        await Promise.all(
          tabPhotos.map((ph) =>
            studioApiFetch(
              `/api/studio/photo-selection/projects/${encodeURIComponent(activeProjectId)}/photos/${encodeURIComponent(ph.id)}`,
              { method: "DELETE" }
            )
          )
        );
      }
      const updatedTabs = project.clientPreviewTabs.filter((t) => t.id !== tabId);
      await studioApiFetch(`/api/studio/photo-selection/projects/${activeProjectId}`, {
        method: "PATCH",
        body: { clientTabs: updatedTabs },
      });
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== activeProjectId) return p;
          const remainingPhotos = p.photos.filter((ph) => ph.tabId !== tabId);
          return {
            ...p,
            clientPreviewTabs: updatedTabs,
            photos: remainingPhotos,
            stats: {
              ...p.stats,
              uploadedLabel: String(remainingPhotos.length),
              visibleToClient: remainingPhotos.length,
            },
          };
        })
      );
      setStudioFilterTabId((prev) => (prev === tabId ? "__all__" : prev));
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to delete tab");
    } finally {
      setDeletingTabId(null);
    }
  };

  const savePinSettings = async () => {
    if (!activeProjectId || !activeProject || !canSavePinSettings) return;
    setPinSettingsSaving(true);
    setPinSettingsMessage(null);
    try {
      let body: Record<string, unknown>;
      if (!pinDraftEnabled && activeProject.pinEnabled) {
        body = { pinEnabled: false };
      } else if (pinDraftEnabled && !activeProject.pinEnabled) {
        body = { pinEnabled: true, pin: pinDraftInput.trim() };
      } else {
        body = { pin: pinDraftInput.trim() };
      }

      const resp = await studioApiFetch<{ project: any }>(`/api/studio/photo-selection/projects/${activeProjectId}`, {
        method: "PATCH",
        body,
      });
      const mapped = mapApiProjectToUi(resp.project);
      setProjects((prev) =>
        prev.map((proj) => (proj.id === activeProjectId ? { ...proj, ...mapped, photos: proj.photos } : proj))
      );
      setPinDraftInput("");
      setPinDraftEnabled(mapped.pinEnabled);
      setPinSettingsMessage("PIN settings saved.");
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Could not update PIN settings");
    } finally {
      setPinSettingsSaving(false);
    }
  };

  const commitPhotoUpload = async (files: File[], tabId: string | null) => {
    if (!activeProjectId || !files.length) return;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        const nextPhotos = files.map((file, idx) => ({
          id: `up-${Date.now()}-${idx}-${Math.random().toString(16).slice(2)}`,
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
    const photos = await uploadPhotoSelectionDirect({
      projectId: activeProjectId,
      files,
      tabId,
      api: studioApiFetch,
      onProgress: (progress) => setUploadModalProgress(progress),
    });
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        const persisted = photos.map((ph, idx) => ({
          id: String(ph.id ?? `up-${Date.now()}-${idx}`),
          picked: Boolean(ph.picked),
          fav: Boolean(ph.fav),
          tabId: (typeof ph.tabId === "string" ? ph.tabId : null) as string | null,
          blobUrl: String(ph.url || ""),
          label: String(ph.originalName || ph.id || `IMG #${idx + 1}`),
          fileName: String(ph.originalName || ""),
          mimeType: String(ph.mimeType || ""),
        }));
        const merged = [...p.photos.filter((ph) => !ph.id.startsWith("up-")), ...persisted];
        return {
          ...p,
          photos: merged,
          stats: {
            ...p.stats,
            uploadedLabel: String(merged.length),
            visibleToClient: merged.length,
          },
        };
      })
    );
  };

  const openUploadModal = () => {
    setUploadModalFiles([]);
    setUploadModalTabChoice("");
    setUploadModalError(null);
    setUploadModalSubmitting(false);
    setUploadModalProgress(0);
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    if (uploadModalSubmitting) return;
    setUploadModalOpen(false);
    setUploadModalFiles([]);
    setUploadModalTabChoice("");
    setUploadModalError(null);
    setUploadModalSubmitting(false);
    setUploadModalProgress(0);
  };

  const onModalFilesPicked = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const next = Array.from(fileList);
    setUploadModalFiles((prev) => [...prev, ...next]);
  };

  const removeModalFileAt = (index: number) => {
    setUploadModalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmUploadModal = async () => {
    if (uploadModalFiles.length === 0) return;
    if (uploadModalSubmitting) return;
    setUploadModalError(null);
    setUploadModalSubmitting(true);
    setUploadModalProgress(0);
    const tabId = uploadModalTabChoice === "" ? null : uploadModalTabChoice;
    try {
      await commitPhotoUpload(uploadModalFiles, tabId);
      closeUploadModal();
    } catch (e) {
      setUploadModalError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploadModalSubmitting(false);
      setUploadModalProgress(0);
    }
  };

  const resetNewProjectForm = () => {
    setNewProjectName("");
    setNewProjectDetails("");
    setNewProjectPinEnabled(false);
    setNewProjectPin("");
    setNewProjectPinVisible(false);
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
    if (newProjectPinEnabled && !/^\d{4,8}$/.test(newProjectPin.trim())) {
      window.alert("PIN must be 4–8 digits when PIN protection is enabled.");
      return;
    }
    const details = newProjectDetails.trim();
    const id = `sel_${Date.now()}`;
    const next: SelectionProject = {
      id,
      name,
      subtitle: details || "No additional details",
      round: { label: "Draft", tone: "neutral" },
      clientPreviewTabs: [],
      published: false,
      shareToken: null,
      slug: null,
      pinEnabled: newProjectPinEnabled,
      stats: {
        uploadedLabel: "0",
        visibleToClient: 0,
        hidden: 0,
      },
      ogImage: null,
      photos: [],
    };
    try {
      const created = await studioApiFetch<{ project: any }>("/api/studio/photo-selection/projects", {
        method: "POST",
        body: {
          name,
          pinEnabled: newProjectPinEnabled,
          ...(newProjectPinEnabled ? { pin: newProjectPin.trim() } : {}),
        },
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

  const copyClientLink = async (project: SelectionProject) => {
    if (!project.published) return;
    const origin = window.location.origin;
    let slug = typeof project.slug === "string" ? project.slug.trim() : "";

    if (!slug && project.id) {
      try {
        const data = await studioApiFetch<{ project: { slug?: string } }>(
          `/api/studio/photo-selection/projects/${project.id}`
        );
        const fromApi = typeof data.project?.slug === "string" ? data.project.slug.trim() : "";
        if (fromApi) {
          slug = fromApi;
          setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, slug: fromApi } : p)));
        }
      } catch {
        /* ignore */
      }
    }

    if (!slug) {
      window.alert(
        "No /photos/… slug yet. Publish the selection (or refresh the page), then copy again."
      );
      return;
    }

    const link = new URL(`/photos/${encodeURIComponent(slug)}`, origin).href;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedProjectId(project.id);
      window.setTimeout(() => {
        setCopiedProjectId((prev) => (prev === project.id ? null : prev));
      }, 1800);
    } catch {
      window.alert("Unable to copy link. Please allow clipboard access.");
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

            <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={newProjectPinEnabled}
                  onChange={(e) => {
                    setNewProjectPinEnabled(e.target.checked);
                    if (!e.target.checked) setNewProjectPin("");
                  }}
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900"
                />
                <span>
                  <span className="text-sm font-semibold text-zinc-900">Require PIN for client link</span>
                  <span className="mt-1 block text-xs text-zinc-600">
                    Clients must enter a numeric PIN before they can view or download photos (4–8 digits).
                  </span>
                </span>
              </label>
              {newProjectPinEnabled ? (
                <div className="mt-4">
                  <label htmlFor="new-selection-project-pin" className="text-sm font-semibold text-zinc-900">
                    PIN <span className="font-normal text-red-600">*</span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="new-selection-project-pin"
                      type={newProjectPinVisible ? "text" : "password"}
                      inputMode="numeric"
                      autoComplete="new-password"
                      maxLength={8}
                      value={newProjectPin}
                      onChange={(e) => setNewProjectPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      placeholder="e.g. 4829"
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-11 text-sm tracking-widest text-zinc-900 outline-none ring-zinc-900/10 placeholder:text-zinc-400 focus:ring-4"
                    />
                    <button
                      type="button"
                      aria-label={newProjectPinVisible ? "Hide PIN while typing" : "Show PIN while typing"}
                      onClick={() => setNewProjectPinVisible((v) => !v)}
                      className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                    >
                      {newProjectPinVisible ? (
                        <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3">
            <GhostButton type="button" onClick={closeNewProjectModal}>
              Cancel
            </GhostButton>
            <PrimaryButton
              type="button"
              onClick={submitNewProject}
              disabled={
                !newProjectName.trim() || (newProjectPinEnabled && !/^\d{4,8}$/.test(newProjectPin.trim()))
              }
            >
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
    const hasWorkspaceFilter = studioFilterSelectedOnly || studioFilterFavouriteOnly || studioFilterTabId !== "__all__";

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
                  <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-2">
                    {uploadModalFiles.map((file, idx) => (
                      <li
                        key={`${file.name}-${idx}`}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-zinc-200/80"
                      >
                        <span className="min-w-0 truncate text-sm text-zinc-800" title={file.name}>
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeModalFileAt(idx)}
                          disabled={uploadModalSubmitting}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
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
                <div className="mr-auto min-w-[220px] self-center">
                  <p className="text-sm font-medium text-zinc-700">
                    Uploading {uploadModalFiles.length} file{uploadModalFiles.length === 1 ? "" : "s"}...{" "}
                    {uploadModalProgress}%
                  </p>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full bg-zinc-900 transition-[width] duration-200"
                      style={{ width: `${uploadModalProgress}%` }}
                    />
                  </div>
                </div>
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
                Published
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
            <GhostButton
              type="button"
              onClick={() => void deletePhotoSelectionById(p.id, p.name)}
              className="border-rose-200 text-rose-800 hover:bg-rose-50"
            >
              <span className="inline-flex items-center gap-2">
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                Delete project
              </span>
            </GhostButton>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <aside className="space-y-4 xl:order-2">
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
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-white hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Remove tab ${tab.label}`}
                        disabled={deletingTabId === tab.id}
                      >
                        {deletingTabId === tab.id ? (
                          <span className="text-[10px] font-semibold">...</span>
                        ) : (
                          <X className="h-4 w-4" strokeWidth={2} />
                        )}
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

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-2">
                <ImagePlus className="mt-0.5 h-5 w-5 shrink-0 text-zinc-700" strokeWidth={1.75} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">OG image for public link</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                    Upload a custom social preview image for `/photos/...` shares. If not uploaded, no OG image is sent.
                  </p>
                </div>
              </div>
              {p.ogImage?.url ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                  <img src={p.ogImage.url} alt={p.ogImage.label || "OG image"} className="h-36 w-full object-cover" />
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-4 text-xs text-zinc-500">
                  No OG image uploaded yet.
                </p>
              )}
              <div className="mt-4">
                <label
                  htmlFor={ogImageInputId}
                  className={[
                    "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white",
                    ogImageUploading ? "cursor-not-allowed bg-zinc-500" : "cursor-pointer bg-zinc-900 hover:bg-zinc-800",
                  ].join(" ")}
                >
                  {ogImageUploading ? "Uploading..." : p.ogImage ? "Replace OG image" : "Upload OG image"}
                </label>
                <input
                  id={ogImageInputId}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={ogImageUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadSelectionOgImage(file);
                    e.target.value = "";
                  }}
                />
              </div>
              {ogImageUploadError ? (
                <p className="mt-2 text-xs font-medium text-red-600">{ogImageUploadError}</p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-2">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-zinc-700" strokeWidth={1.75} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">Client link PIN</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                    When enabled, anyone opening the public gallery must enter this PIN.
                  </p>
                </div>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-3">
                <input
                  type="checkbox"
                  checked={pinDraftEnabled}
                  onChange={(e) => {
                    setPinDraftEnabled(e.target.checked);
                    if (!e.target.checked) setPinDraftInput("");
                    setPinSettingsMessage(null);
                  }}
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900"
                />
                <span className="text-sm text-zinc-800">
                  <span className="font-semibold text-zinc-900">Require PIN</span>
                  <span className="mt-0.5 block text-xs font-normal text-zinc-600">
                    {p.pinEnabled ? "Currently on for this project." : "Currently off."}
                  </span>
                </span>
              </label>

              {pinDraftEnabled ? (
                <div className="mt-3">
                  <label htmlFor="workspace-pin-input" className="text-xs font-semibold text-zinc-700">
                    {p.pinEnabled ? "New PIN (to change)" : "PIN"}
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="workspace-pin-input"
                      type={workspacePinVisible ? "text" : "password"}
                      inputMode="numeric"
                      autoComplete="new-password"
                      maxLength={8}
                      value={pinDraftInput}
                      onChange={(e) => setPinDraftInput(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      placeholder={p.pinEnabled ? "Enter new PIN to change" : "4–8 digits"}
                      className="h-10 w-full rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-11 text-sm tracking-widest text-zinc-900 outline-none ring-zinc-900/10 placeholder:text-zinc-400 focus:ring-4"
                    />
                    <button
                      type="button"
                      aria-label={workspacePinVisible ? "Hide PIN while typing" : "Show PIN while typing"}
                      onClick={() => setWorkspacePinVisible((v) => !v)}
                      className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                    >
                      {workspacePinVisible ? (
                        <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                </div>
              ) : null}

              {pinSettingsMessage ? (
                <p className="mt-3 text-xs font-medium text-emerald-800">{pinSettingsMessage}</p>
              ) : null}

              <div className="mt-4">
                <PrimaryButton
                  type="button"
                  onClick={() => void savePinSettings()}
                  disabled={!canSavePinSettings || pinSettingsSaving}
                >
                  {pinSettingsSaving ? "Saving…" : "Save PIN settings"}
                </PrimaryButton>
              </div>
            </div>
          </aside>

          <section className="min-w-0 space-y-4 xl:order-1">
            <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700">
                  <span>Tab</span>
                  <select
                    value={studioFilterTabId}
                    onChange={(e) => setStudioFilterTabId(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-zinc-900 outline-none"
                  >
                    <option value="__all__">All tabs</option>
                    <option value="__unassigned__">Unassigned</option>
                    {p.clientPreviewTabs.map((tab) => (
                      <option key={tab.id} value={tab.id}>
                        {tab.label}
                      </option>
                    ))}
                  </select>
                </label>
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
                {hasWorkspaceFilter ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStudioFilterSelectedOnly(false);
                      setStudioFilterFavouriteOnly(false);
                      setStudioFilterTabId("__all__");
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
                <button
                  type="button"
                  onClick={() => void copyClientLink(p)}
                  disabled={!p.published}
                  title={
                    p.published
                      ? "Copy public gallery URL"
                      : "Publish the selection to copy a link"
                  }
                  className={[
                    "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold shadow-sm transition",
                    p.published
                      ? "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
                      : "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-400",
                  ].join(" ")}
                >
                  <Link2 className="h-4 w-4" strokeWidth={1.75} />
                  {copiedProjectId === p.id ? "Copied" : "Copy URL"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
              {p.photos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
                  <ImagePlus className="mx-auto h-10 w-10 text-zinc-400" strokeWidth={1.5} />
                  <p className="mt-4 text-sm font-semibold text-zinc-900">No photos yet</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Upload images to build the selection grid.
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
                    Try changing Tab / Selected / Favourite filters, or add more images.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStudioFilterSelectedOnly(false);
                      setStudioFilterFavouriteOnly(false);
                      setStudioFilterTabId("__all__");
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
                          "group absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 ring-1 ring-black/5 transition",
                          t.picked ? "ring-2 ring-emerald-500/80" : "hover:ring-2 hover:ring-zinc-400/60",
                        ].join(" ")}
                      >
                        {t.blobUrl ? (
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
                        disabled={deletingPhotoId === t.id}
                      >
                        <Maximize2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          void deletePhotoById(t.id, t.label);
                        }}
                        className="absolute bottom-2 right-12 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-white/95 text-rose-700 shadow-md hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Delete ${t.label}`}
                        disabled={deletingPhotoId === t.id}
                        title="Delete photo"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
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
                {studioPreviewPhoto.blobUrl ? (
                  <img
                    src={studioPreviewPhoto.blobUrl}
                    alt=""
                    className="mx-auto max-h-[85vh] w-auto max-w-full object-contain"
                  />
                ) : (
                  <div className="mx-auto flex min-h-[min(50vh,360px)] w-full max-w-full items-center justify-center bg-zinc-800 sm:min-h-[min(65vh,520px)]" />
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
                  disabled={deletingPhotoId === studioPreviewPhoto.id}
                >
                  <Heart
                    className={["h-4 w-4", studioPreviewPhoto.fav ? "fill-current text-rose-300" : ""].join(" ")}
                    strokeWidth={1.75}
                  />
                  {studioPreviewPhoto.fav ? "Remove favourite" : "Mark favourite"}
                </button>
                <button
                  type="button"
                  onClick={() => void deletePhotoById(studioPreviewPhoto.id, studioPreviewPhoto.label)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-300/70 bg-rose-500/20 px-4 text-sm font-semibold text-white hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={deletingPhotoId === studioPreviewPhoto.id}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  {deletingPhotoId === studioPreviewPhoto.id ? "Deleting..." : "Delete photo"}
                </button>
              </div>
              <p className="text-center text-xs text-white/60">Escape or backdrop to close</p>
            </div>
          </div>
        ) : null}
        {uploadPhotoModal}
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
              <p className="text-sm text-zinc-600">
                {projectsLoading
                  ? "Loading…"
                  : `${projects.length} projects · open one to upload and cull`}
              </p>
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
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Copy link</th>
                <th className="px-5 py-3 text-right">Open</th>
                <th className="px-5 py-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {projectsLoading ? (
                Array.from({ length: 5 }, (_, i) => (
                  <tr key={`shimmer-${i}`} className="bg-white">
                    <td className="px-5 py-3">
                      <div className={`h-4 max-w-[180px] rounded-md ${STUDIO_TABLE_SHIMMER}`} />
                      <div className={`mt-2 h-3 max-w-[120px] rounded-md ${STUDIO_TABLE_SHIMMER}`} />
                    </td>
                    <td className="px-5 py-3">
                      <div className={`h-4 w-10 rounded-md ${STUDIO_TABLE_SHIMMER}`} />
                    </td>
                    <td className="px-5 py-3">
                      <div className={`h-6 w-20 rounded-full ${STUDIO_TABLE_SHIMMER}`} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className={`ml-auto h-8 w-20 rounded-lg ${STUDIO_TABLE_SHIMMER}`} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className={`ml-auto h-8 w-16 rounded-lg ${STUDIO_TABLE_SHIMMER}`} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className={`ml-auto h-8 w-10 rounded-lg ${STUDIO_TABLE_SHIMMER}`} />
                    </td>
                  </tr>
                ))
              ) : projects.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-zinc-600">
                    No selection projects yet. Create one to get started.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => {
                  const canCopy = Boolean(proj.published);
                  return (
                    <tr key={proj.id} className="bg-white">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-zinc-900">{proj.name}</p>
                        {proj.subtitle.trim() ? (
                          <p className="mt-0.5 text-xs text-zinc-600">{proj.subtitle}</p>
                        ) : null}
                      </td>
                      <td className="px-5 py-3 text-zinc-700">{proj.photos.length.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <StatusBadge tone={proj.published ? "good" : toneForRound(proj.round.tone)}>
                          {proj.published ? "Published" : proj.round.label}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            void copyClientLink(proj);
                          }}
                          disabled={!canCopy}
                          title={
                            canCopy
                              ? "Copy client link"
                              : "Publish the selection to generate a shareable link"
                          }
                          className={[
                            "inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold",
                            canCopy
                              ? "text-zinc-900 hover:bg-zinc-100"
                              : "cursor-not-allowed text-zinc-400",
                          ].join(" ")}
                        >
                          {copiedProjectId === proj.id ? "Copied" : "Copy link"}
                        </button>
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
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => void deletePhotoSelectionById(proj.id, proj.name)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-rose-700 hover:bg-rose-50"
                          title="Delete project"
                          aria-label={`Delete project ${proj.name}`}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {newProjectModal}
    </>
  );
}
