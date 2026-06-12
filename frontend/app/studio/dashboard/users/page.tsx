"use client";

import { Pencil, Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GhostButton, PageHeader, PrimaryButton, StatusBadge } from "@/components/studio-dashboard/blocks";
import { studioApiFetch } from "@/utils/studioApi";

type AdminUser = {
  _id?: string;
  id?: string;
  email: string;
  name?: string;
  role: "master_admin" | "studio";
  studioName?: string;
  isActive?: boolean;
  createdAt?: string;
  currentPlanId?: string;
  currentPlanName?: string;
  currentPlanBillingCycle?: "monthly" | "sixMonth" | "yearly" | "";
  currentPlanStartedAt?: string | null;
  currentPlanExpiresAt?: string | null;
  currentPlanStatus?: "active" | "expired" | "cancelled" | "none";
  usage?: {
    totalBytes?: number;
    albumsBytes?: number;
    photoSelectionBytes?: number;
  } | null;
};

type StudioPlan = {
  id: string;
  name: string;
  active?: boolean;
};

function userRowId(u: AdminUser): string {
  return String(u._id ?? u.id ?? "");
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const decimals = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

export default function StudioUsersPage() {
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [plans, setPlans] = useState<StudioPlan[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [createFormError, setCreateFormError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"studio" | "master_admin">("studio");
  const [newStudioName, setNewStudioName] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editBusy, setEditBusy] = useState(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [editStudioName, setEditStudioName] = useState("");
  const [editRole, setEditRole] = useState<"studio" | "master_admin">("studio");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editPassword, setEditPassword] = useState("");
  const [editPasswordConfirm, setEditPasswordConfirm] = useState("");
  const [editPlanId, setEditPlanId] = useState("");
  const [editPlanBillingCycle, setEditPlanBillingCycle] = useState<"monthly" | "sixMonth" | "yearly">("monthly");
  const [editPlanStartedAt, setEditPlanStartedAt] = useState("");
  const [editPlanExpiresAt, setEditPlanExpiresAt] = useState("");
  const [editPlanStatus, setEditPlanStatus] = useState<"active" | "expired" | "cancelled" | "none">("none");

  const loadUsers = useCallback(async () => {
    const data = await studioApiFetch<{ users: AdminUser[] }>("/api/admin/users");
    setUsers(data.users || []);
  }, []);

  const loadPlans = useCallback(async () => {
    const data = await studioApiFetch<{ plans: StudioPlan[] }>("/api/studio/plans");
    setPlans((data.plans || []).filter((p) => p.active !== false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const raw = window.localStorage.getItem("studio_user");
        const user = raw ? JSON.parse(raw) : null;
        const isAdmin = user?.role === "master_admin";
        setIsMasterAdmin(isAdmin);
        if (!isAdmin) {
          setLoading(false);
          return;
        }
        await Promise.all([loadUsers(), loadPlans()]);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void init();
    return () => {
      cancelled = true;
    };
  }, [loadPlans, loadUsers]);

  const resetCreateForm = () => {
    setCreateFormError(null);
    setNewEmail("");
    setNewPassword("");
    setNewName("");
    setNewRole("studio");
    setNewStudioName("");
  };

  const openCreate = () => {
    resetCreateForm();
    setCreateOpen(true);
  };

  const closeCreate = () => {
    if (createBusy) return;
    setCreateOpen(false);
    resetCreateForm();
  };

  const submitCreate = async () => {
    setCreateFormError(null);
    const email = newEmail.trim().toLowerCase();
    if (!email) {
      setCreateFormError("Email is required.");
      return;
    }
    if (newPassword.length < 6) {
      setCreateFormError("Password must be at least 6 characters.");
      return;
    }
    setCreateBusy(true);
    try {
      await studioApiFetch<{ user: AdminUser }>("/api/admin/users", {
        method: "POST",
        body: {
          email,
          password: newPassword,
          name: newName.trim(),
          role: newRole,
          studioName: newStudioName.trim(),
        },
      });
      await loadUsers();
      setCreateOpen(false);
      resetCreateForm();
    } catch (e) {
      setCreateFormError(e instanceof Error ? e.message : "Could not create user");
    } finally {
      setCreateBusy(false);
    }
  };

  const openEdit = (u: AdminUser) => {
    const id = userRowId(u);
    if (!id) return;
    setEditFormError(null);
    setEditUserId(id);
    setEditEmail(u.email);
    setEditName(u.name ?? "");
    setEditStudioName(u.studioName ?? "");
    setEditRole(u.role);
    setEditIsActive(u.isActive !== false);
    setEditPassword("");
    setEditPasswordConfirm("");
    setEditPlanId(u.currentPlanId ?? "");
    setEditPlanBillingCycle((u.currentPlanBillingCycle || "monthly") as "monthly" | "sixMonth" | "yearly");
    setEditPlanStartedAt(
      u.currentPlanStartedAt ? new Date(u.currentPlanStartedAt).toISOString().slice(0, 10) : ""
    );
    setEditPlanExpiresAt(
      u.currentPlanExpiresAt ? new Date(u.currentPlanExpiresAt).toISOString().slice(0, 10) : ""
    );
    setEditPlanStatus((u.currentPlanStatus || "none") as "active" | "expired" | "cancelled" | "none");
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (editBusy) return;
    setEditOpen(false);
    setEditUserId("");
    setEditFormError(null);
    setEditPassword("");
    setEditPasswordConfirm("");
    setEditPlanId("");
    setEditPlanBillingCycle("monthly");
    setEditPlanStartedAt("");
    setEditPlanExpiresAt("");
    setEditPlanStatus("none");
  };

  const submitEdit = async () => {
    if (!editUserId) return;
    setEditFormError(null);
    const pw = editPassword.trim();
    const pw2 = editPasswordConfirm.trim();
    const wantsPassword = pw.length > 0 || pw2.length > 0;
    if (wantsPassword) {
      if (pw.length < 6) {
        setEditFormError("New password must be at least 6 characters.");
        return;
      }
      if (pw !== pw2) {
        setEditFormError("Password and confirmation do not match.");
        return;
      }
    }
    setEditBusy(true);
    try {
      const body: Record<string, unknown> = {
        name: editName.trim(),
        studioName: editStudioName.trim(),
        role: editRole,
        isActive: editIsActive,
        currentPlanId: editPlanId,
        currentPlanBillingCycle: editPlanBillingCycle,
        currentPlanStartedAt: editPlanStartedAt || null,
        currentPlanExpiresAt: editPlanExpiresAt || null,
        currentPlanStatus: editPlanStatus,
      };
      if (wantsPassword) body.password = pw;
      await studioApiFetch<{ user: AdminUser }>(
        `/api/admin/users/${encodeURIComponent(editUserId)}`,
        {
          method: "PATCH",
          body,
        }
      );
      await loadUsers();
      setEditOpen(false);
      setEditUserId("");
      setEditPassword("");
      setEditPasswordConfirm("");
    } catch (e) {
      setEditFormError(e instanceof Error ? e.message : "Could not update user");
    } finally {
      setEditBusy(false);
    }
  };

  const reactivatePlan = async () => {
    if (!editUserId || !editPlanId) {
      setEditFormError("Select a plan before reactivating.");
      return;
    }
    setEditBusy(true);
    setEditFormError(null);
    try {
      const result = await studioApiFetch<{ user: AdminUser }>(
        `/api/admin/users/${encodeURIComponent(editUserId)}/reactivate-plan`,
        {
          method: "POST",
          body: {
            planId: editPlanId,
            billingCycle: editPlanBillingCycle,
          },
        }
      );
      await loadUsers();
      const updated = result?.user;
      if (updated) {
        setEditPlanStatus((updated.currentPlanStatus || "active") as "active" | "expired" | "cancelled" | "none");
        setEditPlanStartedAt(
          updated.currentPlanStartedAt ? new Date(updated.currentPlanStartedAt).toISOString().slice(0, 10) : ""
        );
        setEditPlanExpiresAt(
          updated.currentPlanExpiresAt ? new Date(updated.currentPlanExpiresAt).toISOString().slice(0, 10) : ""
        );
      }
    } catch (e) {
      setEditFormError(e instanceof Error ? e.message : "Could not reactivate plan");
    } finally {
      setEditBusy(false);
    }
  };

  const sessionEmail =
    typeof window !== "undefined"
      ? (() => {
          try {
            const raw = window.localStorage.getItem("studio_user");
            const u = raw ? JSON.parse(raw) : null;
            return typeof u?.email === "string" ? u.email.toLowerCase() : "";
          } catch {
            return "";
          }
        })()
      : "";
  const editingSelf = sessionEmail && editEmail.toLowerCase() === sessionEmail;

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Master admin can view and manage studio users."
        actions={
          isMasterAdmin ? (
            <PrimaryButton type="button" onClick={openCreate}>
              <span className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" strokeWidth={2} />
                New user
              </span>
            </PrimaryButton>
          ) : null
        }
      />

      {!isMasterAdmin ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Only master admin can access the users list.
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600">Loading users...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Studio</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Current plan</th>
                  <th className="px-5 py-3">Plan expiry</th>
                  <th className="px-5 py-3">Usage</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((u, idx) => (
                  <tr key={u._id || u.id || `${u.email}-${idx}`} className="bg-white">
                    <td className="px-5 py-3 font-semibold text-zinc-900">{u.name || "—"}</td>
                    <td className="px-5 py-3 text-zinc-700">{u.email}</td>
                    <td className="px-5 py-3 text-zinc-700">{u.role}</td>
                    <td className="px-5 py-3 text-zinc-700">{u.studioName || "—"}</td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={u.isActive === false ? "warn" : "good"}>
                        {u.isActive === false ? "Inactive" : "Active"}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-zinc-700">
                      {u.currentPlanName || "—"}
                      {u.currentPlanStatus && u.currentPlanStatus !== "none" ? (
                        <span className="ml-2 text-xs text-zinc-500">({u.currentPlanStatus})</span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-zinc-600">
                      {u.currentPlanExpiresAt
                        ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                            new Date(u.currentPlanExpiresAt)
                          )
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-zinc-600">
                      {formatBytes(Number(u.usage?.totalBytes || 0))}
                    </td>
                    <td className="px-5 py-3 text-zinc-600">
                      {u.createdAt
                        ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
                            new Date(u.createdAt)
                          )
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(u)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-black/45" onClick={closeCreate} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-user-title"
            className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
              <div>
                <p id="create-user-title" className="text-base font-semibold text-zinc-900">
                  New user
                </p>
                <p className="mt-1 text-sm text-zinc-600">Create a studio or master admin account with a password.</p>
              </div>
              <button
                type="button"
                className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-800 hover:bg-zinc-50"
                onClick={closeCreate}
                aria-label="Close dialog"
                disabled={createBusy}
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-4">
                <div>
                  <label htmlFor="new-user-email" className="text-sm font-semibold text-zinc-900">
                    Email
                  </label>
                  <input
                    id="new-user-email"
                    type="email"
                    autoComplete="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                  />
                </div>
                <div>
                  <label htmlFor="new-user-password" className="text-sm font-semibold text-zinc-900">
                    Password
                  </label>
                  <input
                    id="new-user-password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                  />
                  <p className="mt-1 text-xs text-zinc-500">Minimum 6 characters.</p>
                </div>
                <div>
                  <label htmlFor="new-user-name" className="text-sm font-semibold text-zinc-900">
                    Display name
                  </label>
                  <input
                    id="new-user-name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                  />
                </div>
                <div>
                  <label htmlFor="new-user-role" className="text-sm font-semibold text-zinc-900">
                    Role
                  </label>
                  <select
                    id="new-user-role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as "studio" | "master_admin")}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                  >
                    <option value="studio">Studio</option>
                    <option value="master_admin">Master admin</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="new-user-studio" className="text-sm font-semibold text-zinc-900">
                    Studio name
                  </label>
                  <input
                    id="new-user-studio"
                    type="text"
                    value={newStudioName}
                    onChange={(e) => setNewStudioName(e.target.value)}
                    placeholder="Optional"
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4 placeholder:text-zinc-400"
                  />
                </div>
                {createFormError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {createFormError}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3">
              <GhostButton type="button" onClick={closeCreate} disabled={createBusy}>
                Cancel
              </GhostButton>
              <PrimaryButton type="button" onClick={() => void submitCreate()} disabled={createBusy}>
                {createBusy ? "Creating…" : "Create user"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}

      {editOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-black/45" onClick={closeEdit} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
            className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
              <div>
                <p id="edit-user-title" className="text-base font-semibold text-zinc-900">
                  Edit user
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Update profile, role, and access. Email cannot be changed. Set a new password below only if you want
                  to reset it.
                </p>
              </div>
              <button
                type="button"
                className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-800 hover:bg-zinc-50"
                onClick={closeEdit}
                aria-label="Close dialog"
                disabled={editBusy}
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Email</p>
                  <p className="mt-2 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700">{editEmail}</p>
                </div>
                <div>
                  <label htmlFor="edit-user-password" className="text-sm font-semibold text-zinc-900">
                    New password
                  </label>
                  <input
                    id="edit-user-password"
                    type="password"
                    autoComplete="new-password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4 placeholder:text-zinc-400"
                  />
                  <p className="mt-1 text-xs text-zinc-500">Minimum 6 characters when set.</p>
                </div>
                <div>
                  <label htmlFor="edit-user-password-confirm" className="text-sm font-semibold text-zinc-900">
                    Confirm new password
                  </label>
                  <input
                    id="edit-user-password-confirm"
                    type="password"
                    autoComplete="new-password"
                    value={editPasswordConfirm}
                    onChange={(e) => setEditPasswordConfirm(e.target.value)}
                    placeholder="Repeat new password"
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4 placeholder:text-zinc-400"
                  />
                </div>
                <div>
                  <label htmlFor="edit-user-plan" className="text-sm font-semibold text-zinc-900">
                    Current plan
                  </label>
                  <select
                    id="edit-user-plan"
                    value={editPlanId}
                    onChange={(e) => setEditPlanId(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                  >
                    <option value="">No plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-user-plan-cycle" className="text-sm font-semibold text-zinc-900">
                    Billing cycle
                  </label>
                  <select
                    id="edit-user-plan-cycle"
                    value={editPlanBillingCycle}
                    onChange={(e) => setEditPlanBillingCycle(e.target.value as "monthly" | "sixMonth" | "yearly")}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="sixMonth">6 months</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-user-plan-status" className="text-sm font-semibold text-zinc-900">
                    Plan status
                  </label>
                  <select
                    id="edit-user-plan-status"
                    value={editPlanStatus}
                    onChange={(e) =>
                      setEditPlanStatus(e.target.value as "active" | "expired" | "cancelled" | "none")
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                  >
                    <option value="none">None</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-user-plan-start" className="text-sm font-semibold text-zinc-900">
                    Plan start date
                  </label>
                  <input
                    id="edit-user-plan-start"
                    type="date"
                    value={editPlanStartedAt}
                    onChange={(e) => setEditPlanStartedAt(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                  />
                </div>
                <div>
                  <label htmlFor="edit-user-plan-expiry" className="text-sm font-semibold text-zinc-900">
                    Plan expiry date
                  </label>
                  <input
                    id="edit-user-plan-expiry"
                    type="date"
                    value={editPlanExpiresAt}
                    onChange={(e) => setEditPlanExpiresAt(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                  />
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3">
                  <p className="text-sm font-semibold text-zinc-900">Re-activate plan</p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Sets status to active, start date to today, and expiry from selected billing cycle.
                  </p>
                  <button
                    type="button"
                    onClick={() => void reactivatePlan()}
                    disabled={editBusy}
                    className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reactivate plan
                  </button>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3">
                  <p className="text-sm font-semibold text-zinc-900">Storage usage</p>
                  <div className="mt-1 space-y-1 text-xs text-zinc-600">
                    <p>Total: {formatBytes(Number(users.find((u) => userRowId(u) === editUserId)?.usage?.totalBytes || 0))}</p>
                    <p>
                      Digital albums:{" "}
                      {formatBytes(Number(users.find((u) => userRowId(u) === editUserId)?.usage?.albumsBytes || 0))}
                    </p>
                    <p>
                      Photo selection:{" "}
                      {formatBytes(
                        Number(users.find((u) => userRowId(u) === editUserId)?.usage?.photoSelectionBytes || 0)
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-user-name" className="text-sm font-semibold text-zinc-900">
                    Display name
                  </label>
                  <input
                    id="edit-user-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                  />
                </div>
                <div>
                  <label htmlFor="edit-user-role" className="text-sm font-semibold text-zinc-900">
                    Role
                  </label>
                  <select
                    id="edit-user-role"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as "studio" | "master_admin")}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4"
                  >
                    <option value="studio">Studio</option>
                    <option value="master_admin">Master admin</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-user-studio" className="text-sm font-semibold text-zinc-900">
                    Studio name
                  </label>
                  <input
                    id="edit-user-studio"
                    type="text"
                    value={editStudioName}
                    onChange={(e) => setEditStudioName(e.target.value)}
                    placeholder="Optional"
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:ring-4 placeholder:text-zinc-400"
                  />
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3">
                  <input
                    id="edit-user-active"
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-900"
                  />
                  <div>
                    <label htmlFor="edit-user-active" className="text-sm font-semibold text-zinc-900">
                      Account active
                    </label>
                    <p className="mt-0.5 text-xs text-zinc-600">Inactive users cannot sign in.</p>
                    {editingSelf && !editIsActive ? (
                      <p className="mt-2 text-xs font-medium text-amber-800">You are deactivating your own account; you will be signed out after save.</p>
                    ) : null}
                  </div>
                </div>
                {editFormError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {editFormError}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3">
              <GhostButton type="button" onClick={closeEdit} disabled={editBusy}>
                Cancel
              </GhostButton>
              <PrimaryButton type="button" onClick={() => void submitEdit()} disabled={editBusy}>
                {editBusy ? "Saving…" : "Save changes"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
