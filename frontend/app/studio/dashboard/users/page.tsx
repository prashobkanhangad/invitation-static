"use client";

import { useEffect, useState } from "react";
import { PageHeader, StatusBadge } from "@/components/studio-dashboard/blocks";
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
};

export default function StudioUsersPage() {
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const raw = window.localStorage.getItem("studio_user");
        const user = raw ? JSON.parse(raw) : null;
        const isAdmin = user?.role === "master_admin";
        setIsMasterAdmin(isAdmin);
        if (!isAdmin) {
          setLoading(false);
          return;
        }
        const data = await studioApiFetch<{ users: AdminUser[] }>("/api/admin/users");
        if (cancelled) return;
        setUsers(data.users || []);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Master admin can view and manage studio users."
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
                  <th className="px-5 py-3">Created</th>
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
                    <td className="px-5 py-3 text-zinc-600">
                      {u.createdAt
                        ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
                            new Date(u.createdAt)
                          )
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
