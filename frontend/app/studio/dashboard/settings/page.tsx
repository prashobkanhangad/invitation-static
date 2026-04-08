"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/studio-dashboard/blocks";
import { studioApiFetch } from "@/utils/studioApi";

type StorageProvider = "aws_s3" | "gcp_storage";

export default function StudioSettingsPage() {
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [provider, setProvider] = useState<StorageProvider>("aws_s3");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rawUser = window.localStorage.getItem("studio_user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    setIsMasterAdmin(user?.role === "master_admin");

    if (user?.role === "master_admin") {
      void (async () => {
        try {
          const data = await studioApiFetch<{ settings?: { storageProvider?: StorageProvider } }>(
            "/api/admin/settings"
          );
          const next = data?.settings?.storageProvider;
          if (next === "aws_s3" || next === "gcp_storage") setProvider(next);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load settings");
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, []);

  const onSave = async () => {
    setError(null);
    try {
      await studioApiFetch("/api/admin/settings", {
        method: "PATCH",
        body: { storageProvider: provider },
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
      setSaved(false);
    }
  };

  const onProviderChange = (next: StorageProvider) => {
    if (next === provider) return;
    const nextLabel = next === "aws_s3" ? "AWS S3" : "GCP Storage";
    const confirmed = window.confirm(`Switch storage provider to ${nextLabel}?`);
    if (!confirmed) return;
    setProvider(next);
    setSaved(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Settings"
        description="Frontend-only admin preferences. This does not update backend infrastructure."
      />

      {!isMasterAdmin ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Only master admin can edit settings.
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">Loading settings…</div>
      ) : (
        <div className="max-w-2xl rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Storage location</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Choose which storage provider should be treated as active in the admin UI.
          </p>

          <div className="mt-4 space-y-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <input
                type="radio"
                name="storage-provider"
                value="aws_s3"
                checked={provider === "aws_s3"}
                onChange={() => onProviderChange("aws_s3")}
                className="mt-0.5"
              />
              <span>
                <span className="block text-sm font-semibold text-zinc-900">AWS S3</span>
                <span className="block text-xs text-zinc-600">Amazon Simple Storage Service</span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <input
                type="radio"
                name="storage-provider"
                value="gcp_storage"
                checked={provider === "gcp_storage"}
                onChange={() => onProviderChange("gcp_storage")}
                className="mt-0.5"
              />
              <span>
                <span className="block text-sm font-semibold text-zinc-900">GCP Storage</span>
                <span className="block text-xs text-zinc-600">Google Cloud Storage</span>
              </span>
            </label>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => void onSave()}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Save
            </button>
            <p className="text-xs text-zinc-500">
              Current: <span className="font-semibold text-zinc-800">{provider === "aws_s3" ? "AWS S3" : "GCP Storage"}</span>
            </p>
            {saved ? <span className="text-xs font-semibold text-emerald-700">Saved</span> : null}
          </div>
          {error ? <p className="mt-3 text-xs font-semibold text-rose-700">{error}</p> : null}
        </div>
      )}
    </>
  );
}
