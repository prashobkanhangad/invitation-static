"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Camera, Image as ImageIcon, Trash2, Upload, X } from "lucide-react";
import {
  clearGuestPhotos,
  getGuestPhotos,
  setGuestPhotos,
  type GuestPhoto,
} from "@/utils/guestPhotos";

type LocalPreview = {
  file: File;
  objectUrl: string;
};

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as any).randomUUID() as string;
  }
  return `p_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function GuestPage() {
  const params = useParams<{ inviteId: string }>();

  const inviteId = useMemo(() => {
    const v = params?.inviteId;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [previews, setPreviews] = useState<LocalPreview[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inviteId) return;
    setError(null);
    setDone(false);
    setPhotos(getGuestPhotos(inviteId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteId]);

  useEffect(() => {
    return () => {
      // Revoke any object URLs we created.
      previews.forEach((p) => URL.revokeObjectURL(p.objectUrl));
    };
  }, [previews]);

  function removePreview(index: number) {
    setPreviews((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.objectUrl);
      return copy;
    });
  }

  async function onSubmit() {
    if (!inviteId) return;
    setError(null);
    setBusy(true);
    setDone(false);

    try {
      if (previews.length === 0) {
        setError("Please select one or more photos first.");
        return;
      }

      // localStorage storage is limited; keep the UI demo safe-ish.
      const maxFiles = 12;
      const maxPerFileBytes = 3 * 1024 * 1024; // ~3MB

      if (previews.length > maxFiles) {
        setError(`Please upload up to ${maxFiles} photos at a time.`);
        return;
      }

      for (const p of previews) {
        if (p.file.size > maxPerFileBytes) {
          setError(
            `One or more photos are too large. Please keep each photo under ~${Math.round(
              maxPerFileBytes / (1024 * 1024)
            )}MB.`
          );
          return;
        }
      }

      const uploadedAt = Date.now();

      const newPhotos: GuestPhoto[] = [];
      for (const p of previews) {
        const dataUrl = await readFileAsDataUrl(p.file);
        newPhotos.push({
          id: uid(),
          dataUrl,
          createdAt: uploadedAt,
        });
      }

      const next = [...getGuestPhotos(inviteId), ...newPhotos];
      setGuestPhotos(inviteId, next);
      setPhotos(next);
      setPreviews([]);
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  function onPickFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    setDone(false);

    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const next: LocalPreview[] = arr.map((file) => ({
      file,
      objectUrl: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...next]);
  }

  function onClearAll() {
    if (!inviteId) return;
    clearGuestPhotos(inviteId);
    setPhotos([]);
    setDone(false);
    setError(null);
  }

  return (
    <div className="relative z-[2] min-h-screen px-4 sm:px-6">
      <div className="max-w-5xl mx-auto pt-10 sm:pt-16 pb-12">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display text-[#9e1c12]">
              Upload Photos
            </h1>
            <p className="text-sm sm:text-base text-[#654321] mt-1">
              Invite code: <span className="font-mono">{inviteId ?? "-"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/scan"
              className="rounded-xl border border-[#DAA520]/40 bg-white/70 px-4 py-2 text-sm font-semibold text-[#654321] hover:bg-white"
            >
              Back to Scan
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#DAA520]/30 bg-white/80 backdrop-blur p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] flex items-center justify-center text-white">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-display text-[#9e1c12]">
                  Add Photos
                </h2>
                <p className="text-sm text-[#654321] mt-1">
                  Choose multiple photos from your phone.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              className="hidden"
              onChange={(e) => onPickFiles(e.target.files)}
            />

            <div className="rounded-xl border border-black/5 bg-white/60 p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#9e1c12]">
                    Select photos
                  </p>
                  <p className="text-sm text-[#654321] mt-1">
                    Demo upload uses your browser storage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] text-white px-5 py-3 text-sm font-semibold shadow-lg hover:scale-[1.01] transition"
                >
                  <span className="inline-flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Choose photos
                  </span>
                </button>
              </div>

              {previews.length > 0 ? (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-[#654321]">
                      Selected ({previews.length})
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        previews.forEach((p) =>
                          URL.revokeObjectURL(p.objectUrl)
                        );
                        setPreviews([]);
                        setError(null);
                      }}
                      className="text-sm text-[#654321] underline underline-offset-4 hover:text-[#9e1c12]"
                    >
                      Clear selection
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {previews.map((p, idx) => (
                      <div
                        key={`${p.objectUrl}_${idx}`}
                        className="relative rounded-xl overflow-hidden border border-black/5 bg-black/5"
                      >
                        <img
                          src={p.objectUrl}
                          alt={`Selected ${idx + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePreview(idx)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/70"
                          aria-label="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {error ? (
                <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              ) : null}

              {done ? (
                <p className="mt-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  Photos saved in your browser for this invite (demo).
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onSubmit}
                disabled={busy || previews.length === 0}
                className="rounded-xl bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] text-white px-5 py-3 text-sm font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {busy ? "Saving..." : "Submit photos"}
                </span>
              </button>
              <button
                type="button"
                onClick={onClearAll}
                disabled={busy || photos.length === 0}
                className="rounded-xl border border-[#DAA520]/40 bg-white/70 px-5 py-3 text-sm font-semibold text-[#654321] hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear saved photos
                </span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DAA520]/30 bg-white/80 backdrop-blur p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-display text-[#9e1c12]">
                  Saved Photos
                </h2>
                <p className="text-sm text-[#654321] mt-1">
                  {photos.length === 0
                    ? "No photos saved yet for this invite."
                    : "These are stored in your browser (demo)."}
                </p>
              </div>
              <p className="text-sm font-semibold text-[#654321]">
                {photos.length} photo{photos.length === 1 ? "" : "s"}
              </p>
            </div>

            {photos.length === 0 ? (
              <div className="rounded-xl border border-black/5 bg-black/5 p-4 text-sm text-[#654321]">
                Upload photos on the left — they appear here after you submit.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl overflow-hidden border border-black/5 bg-black/5"
                  >
                    <img
                      src={p.dataUrl}
                      alt="Guest upload"
                      className="w-full h-28 sm:h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

