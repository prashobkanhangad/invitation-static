import { studioApiFetch } from "@/utils/studioApi";

export type StudioFetch = typeof studioApiFetch;

export type DirectUploadSlot = {
  key: string;
  originalName: string;
  mimeType: string;
  byteSize: number;
  uploadUrl: string;
  method: string;
  headers: Record<string, string>;
};

const CHUNK_SIZE = 100;
const UPLOAD_CONCURRENCY = 4;
const JOB_POLL_MS = 1500;
const JOB_TIMEOUT_MS = 20 * 60 * 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForUploadJob<T = any>(
  api: StudioFetch,
  jobId: string,
  onProgress?: (progress: { total: number; done: number; message: string }) => void
): Promise<T> {
  const started = Date.now();
  while (Date.now() - started < JOB_TIMEOUT_MS) {
    const status = await api<{
      job?: {
        status?: "queued" | "processing" | "completed" | "failed";
        progress?: { total?: number; done?: number; message?: string };
        result?: T;
        errorMessage?: string;
      };
    }>(`/api/studio/upload-jobs/${encodeURIComponent(jobId)}`);
    const job = status.job;
    if (onProgress && job?.progress) {
      onProgress({
        total: Number(job.progress.total ?? 0),
        done: Number(job.progress.done ?? 0),
        message: String(job.progress.message ?? ""),
      });
    }
    if (job?.status === "completed") return (job.result ?? ({} as T)) as T;
    if (job?.status === "failed") throw new Error(job.errorMessage || "Upload processing failed");
    await sleep(JOB_POLL_MS);
  }
  throw new Error("Upload processing timed out. Please try again.");
}

function putFileToSignedUrl(
  file: File,
  uploadUrl: string,
  headers: Record<string, string>,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    Object.entries(headers).forEach(([k, v]) => {
      xhr.setRequestHeader(k, v);
    });
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && e.total > 0) {
        onProgress(Math.min(100, Math.round((100 * e.loaded) / e.total)));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      if (xhr.status === 0) {
        reject(
          new Error(
            "Upload was blocked (status 0). For direct uploads to Google Cloud Storage or S3, configure CORS on the bucket to allow PUT from your app origin (e.g. http://localhost:3000)."
          )
        );
        return;
      }
      reject(new Error(`Upload failed (${xhr.status})`));
    };
    xhr.onerror = () =>
      reject(
        new Error(
          "Network error during upload (often a CORS issue). Configure the storage bucket CORS to allow PUT and OPTIONS from your frontend origin. See backend/config-examples/gcs-bucket-cors.json"
        )
      );
    xhr.send(file);
  });
}

async function poolMap<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function runWorker() {
    while (true) {
      const i = next;
      next += 1;
      if (i >= items.length) break;
      results[i] = await worker(items[i], i);
    }
  }
  const n = Math.min(concurrency, Math.max(1, items.length));
  await Promise.all(Array.from({ length: n }, () => runWorker()));
  return results;
}

/**
 * Browser → cloud storage (signed PUT), then server commits processing.
 * Scales to large batches: chunks prepare/commit, limited parallel PUTs.
 */
export async function uploadPhotoSelectionDirect(params: {
  projectId: string;
  files: File[];
  tabId: string | null;
  api: StudioFetch;
  onProgress: (overallPercent: number) => void;
}): Promise<any[]> {
  const { projectId, files, tabId, api, onProgress } = params;
  const totalBytes = files.reduce((s, f) => s + f.size, 0) || 1;
  let committedBytes = 0;
  const allPhotos: any[] = [];
  onProgress(0);

  for (let offset = 0; offset < files.length; offset += CHUNK_SIZE) {
    const chunk = files.slice(offset, offset + CHUNK_SIZE);
    const beforeChunkBytes = committedBytes;
    const prep = await api<{
      uploads: DirectUploadSlot[];
    }>(`/api/studio/photo-selection/projects/${encodeURIComponent(projectId)}/photos/direct-upload/prepare`, {
      method: "POST",
      body: {
        files: chunk.map((f) => ({
          originalName: f.name,
          mimeType: f.type || "application/octet-stream",
          byteSize: f.size,
        })),
      },
    });

    const uploads = prep.uploads;
    if (uploads.length !== chunk.length) {
      throw new Error("Upload prepare mismatch");
    }

    const chunkBytes = chunk.reduce((s, f) => s + f.size, 0);

    await poolMap(chunk, UPLOAD_CONCURRENCY, async (file, i) => {
      const spec = uploads[i];
      await putFileToSignedUrl(file, spec.uploadUrl, spec.headers, () => {});
    });

    committedBytes += chunkBytes;

    const commit = await api<{ photos: any[]; jobId?: string }>(
      `/api/studio/photo-selection/projects/${encodeURIComponent(projectId)}/photos/direct-upload/commit`,
      {
        method: "POST",
        body: {
          tabId,
          items: chunk.map((file, i) => ({
            key: uploads[i].key,
            originalName: file.name,
            mimeType: file.type || "application/octet-stream",
            tabId,
          })),
        },
      }
    );
    const final =
      typeof commit.jobId === "string" && commit.jobId
        ? await waitForUploadJob<{ photos: any[] }>(api, commit.jobId, (p) => {
            const frac = p.total > 0 ? Math.min(1, p.done / p.total) : 0;
            const current = beforeChunkBytes + chunkBytes * frac;
            onProgress(Math.min(99, Math.round((100 * current) / totalBytes)));
          })
        : commit;
    allPhotos.push(...(final.photos || []));
    onProgress(Math.min(99, Math.round((100 * committedBytes) / totalBytes)));
  }

  onProgress(100);
  return allPhotos;
}

export async function uploadAlbumBannerDirect(params: {
  albumId: string;
  file: File;
  api: StudioFetch;
  onProgress: (p: number) => void;
}): Promise<void> {
  const { albumId, file, api, onProgress } = params;
  onProgress(0);
  const prep = await api<{ upload: DirectUploadSlot }>(
    `/api/studio/albums/${encodeURIComponent(albumId)}/banner/direct-upload/prepare`,
    {
      method: "POST",
      body: {
        file: {
          originalName: file.name,
          mimeType: file.type || "application/octet-stream",
          byteSize: file.size,
        },
      },
    }
  );
  const spec = prep.upload;
  await putFileToSignedUrl(file, spec.uploadUrl, spec.headers, () => {});
  const commit = await api<{ bannerImage?: any; jobId?: string }>(
    `/api/studio/albums/${encodeURIComponent(albumId)}/banner/direct-upload/commit`,
    {
      method: "POST",
      body: {
        key: spec.key,
        originalName: file.name,
        mimeType: file.type || "application/octet-stream",
      },
    }
  );
  if (typeof commit.jobId === "string" && commit.jobId) {
    await waitForUploadJob(api, commit.jobId, (p) => {
      const frac = p.total > 0 ? Math.min(1, p.done / p.total) : 0;
      onProgress(Math.min(100, Math.round(100 * frac)));
    });
  }
  onProgress(100);
}

export async function uploadAlbumHighlightsDirect(params: {
  albumId: string;
  files: File[];
  api: StudioFetch;
  onProgress: (p: number) => void;
}): Promise<any[]> {
  const { albumId, files, api, onProgress } = params;
  const totalBytes = files.reduce((s, f) => s + f.size, 0) || 1;
  let committedBytes = 0;
  const all: any[] = [];
  onProgress(0);

  for (let offset = 0; offset < files.length; offset += CHUNK_SIZE) {
    const chunk = files.slice(offset, offset + CHUNK_SIZE);
    const beforeChunkBytes = committedBytes;
    const prep = await api<{ uploads: DirectUploadSlot[] }>(
      `/api/studio/albums/${encodeURIComponent(albumId)}/highlights/direct-upload/prepare`,
      {
        method: "POST",
        body: {
          files: chunk.map((f) => ({
            originalName: f.name,
            mimeType: f.type || "application/octet-stream",
            byteSize: f.size,
          })),
        },
      }
    );
    const uploads = prep.uploads;
    await poolMap(chunk, UPLOAD_CONCURRENCY, async (file, i) => {
      const spec = uploads[i];
      await putFileToSignedUrl(file, spec.uploadUrl, spec.headers, () => {});
    });
    committedBytes += chunk.reduce((s, f) => s + f.size, 0);
    const commit = await api<{ highlights: any[]; jobId?: string }>(
      `/api/studio/albums/${encodeURIComponent(albumId)}/highlights/direct-upload/commit`,
      {
        method: "POST",
        body: {
          items: chunk.map((file, i) => ({
            key: uploads[i].key,
            originalName: file.name,
            mimeType: file.type || "application/octet-stream",
          })),
        },
      }
    );
    const final =
      typeof commit.jobId === "string" && commit.jobId
        ? await waitForUploadJob<{ highlights: any[] }>(api, commit.jobId, (p) => {
            const frac = p.total > 0 ? Math.min(1, p.done / p.total) : 0;
            const current = beforeChunkBytes + chunk.reduce((s, f) => s + f.size, 0) * frac;
            onProgress(Math.min(99, Math.round((100 * current) / totalBytes)));
          })
        : commit;
    all.push(...(final.highlights || []));
  }
  onProgress(100);
  return all;
}

export async function uploadAlbumGalleryTabDirect(params: {
  albumId: string;
  tabId: string;
  files: File[];
  api: StudioFetch;
  onProgress: (p: number) => void;
}): Promise<any[]> {
  const { albumId, tabId, files, api, onProgress } = params;
  const totalBytes = files.reduce((s, f) => s + f.size, 0) || 1;
  let committedBytes = 0;
  const all: any[] = [];
  onProgress(0);

  for (let offset = 0; offset < files.length; offset += CHUNK_SIZE) {
    const chunk = files.slice(offset, offset + CHUNK_SIZE);
    const beforeChunkBytes = committedBytes;
    const prep = await api<{ uploads: DirectUploadSlot[] }>(
      `/api/studio/albums/${encodeURIComponent(albumId)}/gallery-tabs/${encodeURIComponent(tabId)}/images/direct-upload/prepare`,
      {
        method: "POST",
        body: {
          files: chunk.map((f) => ({
            originalName: f.name,
            mimeType: f.type || "application/octet-stream",
            byteSize: f.size,
          })),
        },
      }
    );
    const uploads = prep.uploads;
    await poolMap(chunk, UPLOAD_CONCURRENCY, async (file, i) => {
      const spec = uploads[i];
      await putFileToSignedUrl(file, spec.uploadUrl, spec.headers, () => {});
    });
    committedBytes += chunk.reduce((s, f) => s + f.size, 0);
    const commit = await api<{ images: any[]; jobId?: string }>(
      `/api/studio/albums/${encodeURIComponent(albumId)}/gallery-tabs/${encodeURIComponent(tabId)}/images/direct-upload/commit`,
      {
        method: "POST",
        body: {
          items: chunk.map((file, i) => ({
            key: uploads[i].key,
            originalName: file.name,
            mimeType: file.type || "application/octet-stream",
          })),
        },
      }
    );
    const final =
      typeof commit.jobId === "string" && commit.jobId
        ? await waitForUploadJob<{ images: any[] }>(api, commit.jobId, (p) => {
            const frac = p.total > 0 ? Math.min(1, p.done / p.total) : 0;
            const current = beforeChunkBytes + chunk.reduce((s, f) => s + f.size, 0) * frac;
            onProgress(Math.min(99, Math.round((100 * current) / totalBytes)));
          })
        : commit;
    all.push(...(final.images || []));
  }
  onProgress(100);
  return all;
}
