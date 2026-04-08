export type GuestPhoto = {
  id: string;
  dataUrl: string;
  createdAt: number;
};

const STORAGE_PREFIX = "invito_guest_photos:";

function storageKey(inviteId: string) {
  return `${STORAGE_PREFIX}${inviteId}`;
}

export function getGuestPhotos(inviteId: string): GuestPhoto[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(storageKey(inviteId));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as GuestPhoto[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function setGuestPhotos(inviteId: string, photos: GuestPhoto[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(inviteId), JSON.stringify(photos));
}

export function clearGuestPhotos(inviteId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(inviteId));
}

// Utility for the admin page: returns invite IDs that currently have uploads in localStorage.
export function getInviteIdsWithGuestPhotos(): string[] {
  if (typeof window === "undefined") return [];
  const ids: string[] = [];

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key) continue;
    if (!key.startsWith(STORAGE_PREFIX)) continue;
    ids.push(key.slice(STORAGE_PREFIX.length));
  }

  return Array.from(new Set(ids));
}

