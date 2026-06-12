"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  getStudioNavItemsByRole,
  STUDIO_OVERVIEW_HREF,
  type StudioUserRole,
} from "@/components/studio-dashboard/nav";
import { GhostButton, PageHeader, PrimaryButton, StatCard, StatusBadge } from "@/components/studio-dashboard/blocks";

const recentActivity = [
  {
    id: "1",
    project: "Meera & Vikram — Bangalore",
    action: "Guest RSVPs exported",
    module: "Invitations",
    when: "2h ago",
    status: "good" as const,
    statusLabel: "Done",
  },
  {
    id: "2",
    project: "Aina — Editorial portraits",
    action: "Album proof v3 shared",
    module: "Albums",
    when: "Yesterday",
    status: "warn" as const,
    statusLabel: "Awaiting feedback",
  },
  {
    id: "3",
    project: "Ritu & Omar — two-day wedding",
    action: "Selection round 2 opened",
    module: "Selection",
    when: "Yesterday",
    status: "neutral" as const,
    statusLabel: "In progress",
  },
  {
    id: "4",
    project: "Studio website",
    action: "Pricing section updated",
    module: "Studio site",
    when: "3d ago",
    status: "good" as const,
    statusLabel: "Published",
  },
];

const storagePlans = [
  {
    id: "250gb",
    name: "250 GB",
    monthly: "3000/month",
    sixMonth: "12000/6 months",
    yearly: "20000/year",
  },
  {
    id: "500gb",
    name: "500 GB",
    monthly: "5000/month",
    sixMonth: "20000/6 months",
    yearly: "35000/year",
  },
  {
    id: "1tb",
    name: "1 TB",
    monthly: "7500/month",
    sixMonth: "30000/6 months",
    yearly: "50000/year",
  },
];

export default function StudioDashboardOverviewPage() {
  const [userRole, setUserRole] = useState<StudioUserRole | null>(null);

  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem("studio_user");
      const user = rawUser ? JSON.parse(rawUser) : null;
      const role = user?.role;
      setUserRole(role === "master_admin" ? "master_admin" : "studio");
    } catch {
      setUserRole("studio");
    }
  }, []);

  const modules = useMemo(
    () => getStudioNavItemsByRole(userRole).filter((i) => i.href !== STUDIO_OVERVIEW_HREF),
    [userRole]
  );

  /* Overview marketing/KPI section — disabled; set to true to restore. */
  const showOverviewSection = false;

  return (
    <>
      <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Studio pricing</p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-900">Choose your storage plan</h2>
            <p className="mt-2 text-sm text-zinc-600">
              All plans include digital invitation, digital album, and photo selection.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {storagePlans.map((plan) => (
            <article key={plan.id} className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4">
              <h3 className="text-base font-semibold text-zinc-900">{plan.name}</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2">
                  <dt className="text-zinc-500">Monthly</dt>
                  <dd className="font-semibold text-zinc-900">{plan.monthly}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2">
                  <dt className="text-zinc-500">6 Months</dt>
                  <dd className="font-semibold text-zinc-900">{plan.sixMonth}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2">
                  <dt className="text-zinc-500">1 Year</dt>
                  <dd className="font-semibold text-zinc-900">{plan.yearly}</dd>
                </div>
              </dl>
            </article>
          ))}

          <article className="rounded-2xl border border-zinc-900/20 bg-zinc-900 p-4 text-white">
            <h3 className="text-base font-semibold">Custom Plan</h3>
            <p className="mt-3 text-sm text-zinc-200">
              Need more storage or a tailored setup? Contact us for a custom quote.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-zinc-100">
              <li>Digital invitation included</li>
              <li>Digital album included</li>
              <li>Photo selection included</li>
            </ul>
          </article>
        </div>
      </section>

      {showOverviewSection ? (
        <>
      <PageHeader
        eyebrow="Operations"
        title="Run your studio like a product"
        description="One workspace for your public presence, client-facing pages, album delivery, and selection workflows. Below is a UI-only preview with sample data."
        actions={
          <>
            <GhostButton type="button">Import sample project</GhostButton>
            <PrimaryButton type="button">Create client project</PrimaryButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active client projects"
          value="18"
          hint="Across invitations, albums, and selection"
          delta={{ text: "+3 this month", positive: true }}
        />
        <StatCard
          label="Live client links"
          value="42"
          hint="Shareable URLs with access controls"
          delta={{ text: "+6 WoW", positive: true }}
        />
        <StatCard
          label="Median time to approve selection"
          value="6.4 days"
          hint="From upload to final picks (sample)"
          delta={{ text: "−0.8d", positive: true }}
        />
        <StatCard
          label="Albums delivered (30d)"
          value="11"
          hint="Proof → final handoff"
          delta={{ text: "On track", positive: true }}
        />
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Product modules</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Each surface maps to a client journey—from first impression to final delivery.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900">{m.label}</p>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-600">{m.description}</p>
                      </div>
                    </div>
                    <ArrowRight
                      className="mt-1 h-5 w-5 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-zinc-700"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200/70">
                      UI mock
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-200/70">
                      No backend
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">What to wire next</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Ship in layers: auth → project directory → asset pipeline → client permissions → notifications.
          </p>
          <ul className="mt-4 space-y-3 text-sm text-zinc-700">
            <li className="flex gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-xs font-bold text-white">
                1
              </span>
              <span>
                <span className="font-semibold text-zinc-900">Identity & roles</span>
                <span className="block text-zinc-600">Studio admin vs. client guest access.</span>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-xs font-bold text-white">
                2
              </span>
              <span>
                <span className="font-semibold text-zinc-900">Asset ingestion</span>
                <span className="block text-zinc-600">Raw uploads, proxies, and EXIF-safe previews.</span>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-xs font-bold text-white">
                3
              </span>
              <span>
                <span className="font-semibold text-zinc-900">Client UX polish</span>
                <span className="block text-zinc-600">Commenting, versioning, and audit trails.</span>
              </span>
            </li>
          </ul>

          <div className="mt-5 rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200/70">
            <p className="text-xs font-semibold text-zinc-900">Quality bar</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              Treat every client link like a product: fast loads, clear states, and explicit next actions.
            </p>
          </div>
        </aside>
      </section>

      <section className="mt-10 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Recent activity</h2>
            <p className="mt-1 text-sm text-zinc-600">A concise audit trail your team can scan in seconds.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:underline"
          >
            View full log
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-3">Project</th>
                <th className="px-5 py-3">Update</th>
                <th className="px-5 py-3">Module</th>
                <th className="px-5 py-3">When</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {recentActivity.map((row) => (
                <tr key={row.id} className="bg-white">
                  <td className="px-5 py-3 font-semibold text-zinc-900">{row.project}</td>
                  <td className="px-5 py-3 text-zinc-700">{row.action}</td>
                  <td className="px-5 py-3 text-zinc-700">{row.module}</td>
                  <td className="px-5 py-3 text-zinc-600">{row.when}</td>
                  <td className="px-5 py-3">
                    <StatusBadge
                      tone={row.status === "good" ? "good" : row.status === "warn" ? "warn" : "neutral"}
                    >
                      {row.statusLabel}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
        </>
      ) : null}
    </>
  );
}
