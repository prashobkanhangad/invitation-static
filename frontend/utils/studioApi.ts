import { apiFetch } from "@/utils/api";

export function getStudioToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem("studio_token") ||
    window.localStorage.getItem("auth_token") ||
    window.sessionStorage.getItem("studio_token") ||
    null
  );
}

export async function studioApiFetch<T = unknown>(
  path: string,
  opts: Parameters<typeof apiFetch>[1] = {}
): Promise<T> {
  const token = opts?.token ?? getStudioToken();
  if (!token) {
    throw new Error("Missing studio token. Save JWT to localStorage as `studio_token`.");
  }
  return apiFetch<T>(path, { ...opts, token });
}
