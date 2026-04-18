"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: "master_admin" | "studio";
    name?: string;
    studioName?: string;
  };
};

export default function StudioLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: { email: email.trim(), password },
      });
      window.localStorage.setItem("studio_token", data.token);
      window.localStorage.setItem("studio_user", JSON.stringify(data.user));
      router.replace("/studio/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 text-zinc-900 antialiased sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Studio access</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-600">Use your studio or master admin credentials.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-zinc-900" htmlFor="studio-login-email">
              Email
            </label>
            <input
              id="studio-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none ring-zinc-900/10 focus:ring-4"
              placeholder="studio@invyto.local"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-zinc-900" htmlFor="studio-login-password">
              Password
            </label>
            <input
              id="studio-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none ring-zinc-900/10 focus:ring-4"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

      </div>
    </main>
  );
}
