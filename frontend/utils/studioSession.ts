export const STUDIO_USER_UPDATED_EVENT = "studio-user-updated";

export function mergeStudioUserIntoStorage(partial: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem("studio_user");
    const prev = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    window.localStorage.setItem("studio_user", JSON.stringify({ ...prev, ...partial }));
  } catch {
    window.localStorage.setItem("studio_user", JSON.stringify(partial));
  }
  window.dispatchEvent(new Event(STUDIO_USER_UPDATED_EVENT));
}
