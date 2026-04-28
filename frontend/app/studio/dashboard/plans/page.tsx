"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { studioApiFetch } from "@/utils/studioApi";

type BillingCycle = "monthly" | "sixMonth" | "yearly";

function formatAmount(value: number) {
  const hasFraction = value % 1 !== 0;
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  });
}

type StudioPlan = {
  id: string;
  name: string;
  subtitle?: string;
  monthly: number;
  sixMonth: number;
  yearly: number;
  isCustom?: boolean;
  ctaLabel?: string;
  badgeLabel?: string;
  features?: string[];
  active?: boolean;
};

type StudioAccountUser = {
  id: string;
  currentPlanId?: string;
  currentPlanStatus?: "active" | "expired" | "cancelled" | "none";
};

type StorageUsage = {
  totalBytes: number;
  albumsBytes: number;
  photoSelectionBytes: number;
  albumsCount: number;
  photoSelectionProjectsCount: number;
  provider?: string;
  albumUsageByProject?: Array<{ id: string; name: string; bytes: number }>;
  photoSelectionUsageByProject?: Array<{ id: string; name: string; bytes: number }>;
};

function parseCapacityBytes(planName: string): number | null {
  const m = String(planName || "").toLowerCase().match(/(\d+(?:\.\d+)?)\s*(tb|gb)\b/);
  if (!m) return null;
  const amount = Number(m[1]);
  const unit = m[2];
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const gb = unit === "tb" ? amount * 1024 : amount;
  return gb * 1024 * 1024 * 1024;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  const fixed = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(fixed)} ${units[idx]}`;
}

export default function StudioDashboardPlansPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [plans, setPlans] = useState<StudioPlan[]>([]);
  const [editablePlans, setEditablePlans] = useState<StudioPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [currentPlanId, setCurrentPlanId] = useState("");
  const [currentPlanStatus, setCurrentPlanStatus] = useState<"active" | "expired" | "cancelled" | "none">("none");
  const [usage, setUsage] = useState<StorageUsage | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [savingPlans, setSavingPlans] = useState(false);
  const [plansSaveMessage, setPlansSaveMessage] = useState<string | null>(null);

  const billingMeta = useMemo(
    () => ({
      monthly: { label: "Monthly", cycleLabel: "monthly" },
      sixMonth: { label: "6 Months", cycleLabel: "6 months" },
      yearly: { label: "Yearly", cycleLabel: "yearly" },
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    try {
      const raw = window.localStorage.getItem("studio_user");
      const user = raw ? JSON.parse(raw) : null;
      setIsMasterAdmin(user?.role === "master_admin");
    } catch {
      setIsMasterAdmin(false);
    }
    void (async () => {
      try {
        const [plansData, accountData] = await Promise.all([
          studioApiFetch<{ plans?: StudioPlan[] }>("/api/studio/plans"),
          studioApiFetch<{ user?: StudioAccountUser }>("/api/studio/account"),
        ]);
        if (cancelled) return;
        const incoming = Array.isArray(plansData?.plans) ? plansData.plans : [];
        const activePlans = incoming.filter((plan) => plan?.active !== false);
        setPlans(activePlans);
        setEditablePlans(activePlans);
        setCurrentPlanId(String(accountData?.user?.currentPlanId || ""));
        const status = accountData?.user?.currentPlanStatus;
        setCurrentPlanStatus(
          status === "active" || status === "expired" || status === "cancelled" ? status : "none"
        );
      } catch {
        if (cancelled) return;
        setPlans([]);
      } finally {
        if (!cancelled) setLoadingPlans(false);
      }
    })();

    void (async () => {
      try {
        const usageData = await studioApiFetch<{ usage?: StorageUsage }>("/api/studio/plans/usage");
        if (!cancelled) setUsage(usageData?.usage || null);
      } catch {
        if (!cancelled) setUsage(null);
      } finally {
        if (!cancelled) setLoadingUsage(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateEditablePlan = (index: number, patch: Partial<StudioPlan>) => {
    setEditablePlans((prev) => prev.map((plan, i) => (i === index ? { ...plan, ...patch } : plan)));
  };

  const savePlanPricing = async () => {
    setPlansSaveMessage(null);
    setSavingPlans(true);
    try {
      await studioApiFetch("/api/admin/settings", {
        method: "PATCH",
        body: { pricingPlans: editablePlans },
      });
      setPlans(editablePlans.filter((plan) => plan?.active !== false));
      setPlansSaveMessage("Plan pricing saved.");
    } catch (err) {
      setPlansSaveMessage(err instanceof Error ? err.message : "Failed to save plan pricing.");
    } finally {
      setSavingPlans(false);
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Studio pricing</p>
          <h1 className="mt-1 text-xl font-semibold text-zinc-900">Plan and Usage</h1>
          <p className="mt-2 text-sm text-zinc-600">Pick a billing period and compare your storage options.</p>
        </div>

        <div className="inline-flex w-full items-center rounded-xl border border-zinc-200 bg-zinc-50 p-1 sm:w-auto">
          {(Object.keys(billingMeta) as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setBillingCycle(cycle)}
              className={[
                "h-9 rounded-lg px-4 text-sm font-semibold transition",
                "flex-1 sm:flex-initial",
                billingCycle === cycle
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-white hover:text-zinc-900",
              ].join(" ")}
            >
              {billingMeta[cycle].label}
            </button>
          ))}
        </div>
      </div>

      {loadingPlans ? (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <article key={`plan-skeleton-${idx}`} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
                <div className="mt-2 h-4 w-40 animate-pulse rounded bg-zinc-100" />
                <div className="mt-5 h-10 w-28 animate-pulse rounded bg-zinc-200" />
                <div className="mt-1 h-3 w-36 animate-pulse rounded bg-zinc-100" />
                <div className="mt-5 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
                  <div className="h-4 w-11/12 animate-pulse rounded bg-zinc-100" />
                  <div className="h-4 w-10/12 animate-pulse rounded bg-zinc-100" />
                </div>
                <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-zinc-200" />
              </article>
            ))}
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
            <div className="mt-3 h-2.5 w-full animate-pulse rounded-full bg-zinc-200" />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="h-3.5 w-3/4 animate-pulse rounded bg-zinc-100" />
              <div className="h-3.5 w-3/4 animate-pulse rounded bg-zinc-100" />
              <div className="h-3.5 w-2/3 animate-pulse rounded bg-zinc-100" />
              <div className="h-3.5 w-2/3 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
          const isCurrentPlan = currentPlanStatus === "active" && currentPlanId === plan.id;
          const fallbackBadgeLabel = String(plan.badgeLabel || "").trim();
          const badgeLabel = isCurrentPlan
            ? "Current Plan"
            : fallbackBadgeLabel.toLowerCase() === "current plan"
              ? ""
              : fallbackBadgeLabel;
          const features = Array.isArray(plan.features) ? plan.features : [];
          const cycleAmount = plan[billingCycle];
          const monthCount = billingCycle === "yearly" ? 12 : billingCycle === "sixMonth" ? 6 : 1;
          const monthlyEquivalent = cycleAmount / monthCount;
          const isCustomPlan = Boolean(plan.isCustom);
            return (
              <article
                key={plan.id}
                className={[
                  "relative rounded-2xl border p-5 shadow-sm",
                  badgeLabel ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white",
                ].join(" ")}
              >
                {badgeLabel ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
                    {badgeLabel}
                  </span>
                ) : null}

                <h2 className="text-lg font-semibold text-zinc-900">{plan.name}</h2>
                <p className="mt-1 text-sm text-zinc-500">{plan.subtitle}</p>

                {isCustomPlan ? (
                  <div className="mt-4 text-4xl font-bold tracking-tight text-zinc-900">Custom pricing</div>
                ) : (
                  <>
                    <div className="mt-4 flex items-end gap-1">
                      <span className="text-4xl font-bold tracking-tight text-zinc-900">
                        {formatAmount(monthlyEquivalent)}
                      </span>
                      <span className="pb-1 text-sm text-zinc-500">/month</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      Billed {formatAmount(cycleAmount)} {billingMeta[billingCycle].cycleLabel}
                    </p>
                  </>
                )}

                {features.length ? (
                  <ul className="mt-5 space-y-2">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-zinc-700">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.25} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <button
                  type="button"
                  className={[
                    "mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg border text-sm font-semibold transition",
                    badgeLabel
                      ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
                      : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50",
                  ].join(" ")}
                >
                  {plan.ctaLabel || (plan.isCustom ? "Contact Sales" : "Get Started")}
                </button>
              </article>
            );
          })}
        </div>
      )}

      {isMasterAdmin ? (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Plan pricing editor</p>
              <p className="text-xs text-zinc-600">Edit plan text and pricing directly from this page.</p>
            </div>
            <button
              type="button"
              disabled={savingPlans}
              onClick={() => void savePlanPricing()}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPlans ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {editablePlans.map((plan, index) => (
              <div key={plan.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <input
                    value={plan.name}
                    onChange={(e) => updateEditablePlan(index, { name: e.target.value })}
                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900"
                  />
                  <input
                    value={plan.subtitle || ""}
                    onChange={(e) => updateEditablePlan(index, { subtitle: e.target.value })}
                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900"
                  />
                  <input
                    type="number"
                    min={0}
                    value={plan.monthly}
                    onChange={(e) => updateEditablePlan(index, { monthly: Number(e.target.value) || 0 })}
                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900"
                  />
                  <input
                    type="number"
                    min={0}
                    value={plan.sixMonth}
                    onChange={(e) => updateEditablePlan(index, { sixMonth: Number(e.target.value) || 0 })}
                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900"
                  />
                  <input
                    type="number"
                    min={0}
                    value={plan.yearly}
                    onChange={(e) => updateEditablePlan(index, { yearly: Number(e.target.value) || 0 })}
                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900"
                  />
                  <input
                    value={plan.ctaLabel || ""}
                    onChange={(e) => updateEditablePlan(index, { ctaLabel: e.target.value })}
                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900"
                  />
                  <input
                    value={plan.badgeLabel || ""}
                    onChange={(e) => updateEditablePlan(index, { badgeLabel: e.target.value })}
                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900"
                  />
                  <label className="inline-flex items-center gap-2 text-xs text-zinc-700">
                    <input
                      type="checkbox"
                      checked={plan.active !== false}
                      onChange={(e) => updateEditablePlan(index, { active: e.target.checked })}
                    />
                    Active
                  </label>
                </div>
              </div>
            ))}
          </div>
          {plansSaveMessage ? <p className="mt-3 text-xs text-zinc-700">{plansSaveMessage}</p> : null}
        </div>
      ) : null}

      {loadingUsage ? (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-2.5 w-full animate-pulse rounded-full bg-zinc-200" />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-zinc-100" />
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-zinc-100" />
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-zinc-100" />
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
      ) : usage ? (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          {(() => {
            const activePlan = plans.find((p) => p.id === currentPlanId);
            const capacityBytes = activePlan ? parseCapacityBytes(activePlan.name) : null;
            const totalBytes = Number(usage.totalBytes || 0);
            const percent = capacityBytes && capacityBytes > 0 ? Math.min(100, (totalBytes / capacityBytes) * 100) : 0;
            return (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-zinc-900">Storage usage</p>
                  <p className="text-xs text-zinc-600">
                    {formatBytes(totalBytes)}
                    {capacityBytes ? ` / ${formatBytes(capacityBytes)}` : ""}
                  </p>
                </div>
                {capacityBytes ? (
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-200">
                    <div className="h-full rounded-full bg-zinc-900" style={{ width: `${percent}%` }} />
                  </div>
                ) : null}
                <div className="mt-3 grid gap-2 text-xs text-zinc-600 sm:grid-cols-2">
                  <p>Digital albums: {formatBytes(Number(usage.albumsBytes || 0))}</p>
                  <p>Photo selection: {formatBytes(Number(usage.photoSelectionBytes || 0))}</p>
                  <p>Albums count: {usage.albumsCount || 0}</p>
                  <p>Selection projects: {usage.photoSelectionProjectsCount || 0}</p>
                </div>
                <p className="mt-2 text-[11px] text-zinc-500">
                  Source: {usage.provider === "gcp_storage" ? "GCP Storage folder sizes" : "Storage folder sizes"}
                </p>
                {Array.isArray(usage.albumUsageByProject) && usage.albumUsageByProject.length ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-zinc-700">Digital album usage by project</p>
                    <div className="mt-2 space-y-1 text-xs text-zinc-600">
                      {usage.albumUsageByProject.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3">
                          <span className="truncate">{item.name}</span>
                          <span className="shrink-0 font-medium text-zinc-700">{formatBytes(Number(item.bytes || 0))}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {Array.isArray(usage.photoSelectionUsageByProject) && usage.photoSelectionUsageByProject.length ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-zinc-700">Photo selection usage by project</p>
                    <div className="mt-2 space-y-1 text-xs text-zinc-600">
                      {usage.photoSelectionUsageByProject.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3">
                          <span className="truncate">{item.name}</span>
                          <span className="shrink-0 font-medium text-zinc-700">{formatBytes(Number(item.bytes || 0))}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            );
          })()}
        </div>
      ) : null}

      <div className="mt-6 rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-600 ring-1 ring-zinc-200/70">
        {loadingPlans
          ? "Loading plan configuration..."
          : plans.length === 0
            ? "No active plans available."
          : billingCycle === "monthly"
          ? "Monthly billing selected."
          : billingCycle === "sixMonth"
            ? "6 month billing selected."
            : "Yearly billing selected."}
      </div>
    </section>
  );
}
