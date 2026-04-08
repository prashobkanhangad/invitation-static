import type { Metadata } from "next";
import { Globe2, Link2, Palette, ShieldCheck, Sparkles } from "lucide-react";
import { GhostButton, PageHeader, PrimaryButton, StatusBadge } from "@/components/studio-dashboard/blocks";

export const metadata: Metadata = {
  title: "Studio site",
};

const pages = [
  { name: "Home", path: "/", status: "Published" as const, updated: "Apr 2, 2026" },
  { name: "Collections", path: "/collections", status: "Draft" as const, updated: "Mar 28, 2026" },
  { name: "Pricing & packages", path: "/pricing", status: "Published" as const, updated: "Apr 5, 2026" },
  { name: "Contact & booking", path: "/contact", status: "Published" as const, updated: "Mar 12, 2026" },
];

export default function StudioSitePage() {
  return (
    <>
      <PageHeader
        eyebrow="Module 1"
        title="Your studio’s public landing"
        description="Positioning, portfolio, packages, and a frictionless inquiry flow—without touching code for every tweak. This screen is the editorial control room."
        actions={
          <>
            <GhostButton type="button">Preview live</GhostButton>
            <PrimaryButton type="button">Edit site</PrimaryButton>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
                <Globe2 className="h-5 w-5 text-zinc-800" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-900">lumiere.studio</p>
                <p className="text-xs text-zinc-600">Custom domain · SSL on</p>
              </div>
            </div>
            <StatusBadge tone="good">Healthy</StatusBadge>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-semibold text-zinc-500">Visitors (7d)</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">12.4k</p>
              <p className="mt-1 text-xs text-zinc-600">Demo metric</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-semibold text-zinc-500">Inquiries</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">37</p>
              <p className="mt-1 text-xs text-zinc-600">With calendar holds</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-semibold text-zinc-500">Top source</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Instagram</p>
              <p className="mt-1 text-xs text-zinc-600">Attribution stub</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Hero preview</p>
                <p className="mt-2 max-w-xl text-lg font-semibold leading-snug">
                  Editorial weddings & slow, honest portraits—rooted in light and place.
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
                  Swap imagery, tone, and CTAs per season. Keep performance budgets green with automatic image
                  sizing.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
              >
                <Sparkles className="h-4 w-4" strokeWidth={1.75} />
                Suggest copy
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/15">
                Brand tokens
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/15">
                SEO checklist
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/15">
                Accessibility scan
              </span>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">Site map</p>
            <p className="mt-1 text-sm text-zinc-600">Reorder sections, hide seasonal offers, set scheduling windows.</p>
            <ul className="mt-4 space-y-2">
              {pages.map((p) => (
                <li
                  key={p.path}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-900">{p.name}</p>
                    <p className="truncate text-xs text-zinc-600">{p.path}</p>
                  </div>
                  <StatusBadge tone={p.status === "Published" ? "good" : "warn"}>{p.status}</StatusBadge>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Palette className="mt-0.5 h-5 w-5 text-zinc-800" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-semibold text-zinc-900">Design system</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                  Typography, spacing, and components stay consistent across your studio site and client deliverables.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-200/70">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-semibold text-zinc-900">Privacy-friendly analytics</p>
                <p className="text-xs leading-relaxed text-zinc-600">
                  Optional, aggregate-only metrics—avoid sharing client PII in marketing dashboards.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5">
            <div className="flex items-start gap-3">
              <Link2 className="mt-0.5 h-5 w-5 text-zinc-700" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-semibold text-zinc-900">Integrations (future)</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                  Calendly, HoneyBook, Stripe deposits, and Mapbox for studio location—all behind feature flags.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
