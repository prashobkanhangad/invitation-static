"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/studio-dashboard/blocks";
import { studioApiFetch } from "@/utils/studioApi";
import { mergeStudioUserIntoStorage } from "@/utils/studioSession";

type AccountUser = {
  id: string;
  email: string;
  name: string;
  studioName: string;
};

export default function StudioAccountPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [email, setEmail] = useState("");
  const [studioName, setStudioName] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studioApiFetch<{ user: AccountUser }>("/api/studio/account");
      const u = data.user;
      setEmail(u.email);
      setStudioName(u.studioName ?? "");
      setDisplayName(u.name ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load account");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const data = await studioApiFetch<{ user: AccountUser }>("/api/studio/account", {
        method: "PATCH",
        body: { name: displayName, studioName },
      });
      mergeStudioUserIntoStorage(data.user as Record<string, unknown>);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1600);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async () => {
    if (!newPassword || !currentPassword) {
      setError("Enter your current password and a new password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const data = await studioApiFetch<{ user: AccountUser }>("/api/studio/account", {
        method: "PATCH",
        body: { currentPassword, newPassword },
      });
      mergeStudioUserIntoStorage(data.user as Record<string, unknown>);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1600);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Account"
        description="Update how your studio appears on client links, your display name, and your sign-in password."
      />

      {loading ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">Loading account…</div>
      ) : (
        <div className="space-y-6 max-w-2xl">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-zinc-900">Studio & profile</h2>
            <p className="mt-1 text-sm text-zinc-600">
              The studio name is shown on public photo selection pages when you publish a gallery.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-900" htmlFor="acct-studio-name">
                  Studio name
                </label>
                <input
                  id="acct-studio-name"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none ring-zinc-900/10 focus:ring-4"
                  placeholder="e.g. Lumière Weddings"
                  maxLength={120}
                  autoComplete="organization"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-900" htmlFor="acct-display-name">
                  Your name
                </label>
                <input
                  id="acct-display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none ring-zinc-900/10 focus:ring-4"
                  placeholder="Used in the dashboard and as a fallback label"
                  maxLength={120}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-900" htmlFor="acct-email">
                  Sign-in email
                </label>
                <input
                  id="acct-email"
                  value={email}
                  readOnly
                  className="mt-2 h-11 w-full cursor-not-allowed rounded-xl border border-zinc-100 bg-zinc-50 px-3 text-sm text-zinc-600"
                />
                <p className="mt-1 text-xs text-zinc-500">Email cannot be changed here. Ask a master admin if you need a different address.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void onSaveProfile()}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save profile"}
                </button>
                {saved ? <span className="text-xs font-semibold text-emerald-700">Saved</span> : null}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-zinc-900">Password</h2>
            <p className="mt-1 text-sm text-zinc-600">Change the password you use to sign in to this workspace.</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-900" htmlFor="acct-current-pw">
                  Current password
                </label>
                <input
                  id="acct-current-pw"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none ring-zinc-900/10 focus:ring-4"
                  autoComplete="current-password"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-900" htmlFor="acct-new-pw">
                  New password
                </label>
                <input
                  id="acct-new-pw"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none ring-zinc-900/10 focus:ring-4"
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-900" htmlFor="acct-confirm-pw">
                  Confirm new password
                </label>
                <input
                  id="acct-confirm-pw"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none ring-zinc-900/10 focus:ring-4"
                  autoComplete="new-password"
                />
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => void onChangePassword()}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:opacity-60"
              >
                {saving ? "Updating…" : "Update password"}
              </button>
            </div>
          </div>

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
          ) : null}
        </div>
      )}
    </>
  );
}
