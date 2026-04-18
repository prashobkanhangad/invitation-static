const DEFAULT_API_BASE_URL = "http://localhost:5000";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string | null;
  body?: unknown;
  formData?: FormData;
  signal?: AbortSignal;
  onUploadProgress?: (progress: number) => void;
};

export async function apiFetch<T = unknown>(
  path: string,
  { method = "GET", token = null, body, formData, signal, onUploadProgress }: ApiFetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let requestBody: BodyInit | undefined;
  if (formData) {
    requestBody = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  if (formData && onUploadProgress) {
    return xhrUpload<T>(url, { method, headers, formData, signal, onUploadProgress });
  }

  const res = await fetch(url, {
    method,
    headers,
    body: requestBody,
    signal,
  });

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? (data as any).message
        : null) || res.statusText || "Request failed";
    const err = new Error(String(message)) as Error & { pinRequired?: boolean };
    if (data && typeof data === "object" && (data as { pinRequired?: boolean }).pinRequired) {
      err.pinRequired = true;
    }
    throw err;
  }

  return data as T;
}

function xhrUpload<T>(
  url: string,
  {
    method,
    headers,
    formData,
    signal,
    onUploadProgress,
  }: {
    method: NonNullable<ApiFetchOptions["method"]>;
    headers: Record<string, string>;
    formData: FormData;
    signal?: AbortSignal;
    onUploadProgress: (progress: number) => void;
  }
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
    xhr.responseType = "text";

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || event.total <= 0) return;
      const progress = Math.min(100, Math.max(0, Math.round((event.loaded / event.total) * 100)));
      onUploadProgress(progress);
    };

    xhr.onload = () => {
      const text = xhr.responseText || "";
      const data = text ? safeJsonParse(text) : null;
      if (xhr.status >= 200 && xhr.status < 300) {
        onUploadProgress(100);
        resolve(data as T);
        return;
      }
      const message =
        (data && typeof data === "object" && "message" in data
          ? (data as any).message
          : null) || xhr.statusText || "Request failed";
      reject(new Error(message));
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.onabort = () => reject(new Error("Request was aborted"));

    if (signal) {
      if (signal.aborted) {
        xhr.abort();
        return;
      }
      signal.addEventListener("abort", () => xhr.abort(), { once: true });
    }

    xhr.send(formData);
  });
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

