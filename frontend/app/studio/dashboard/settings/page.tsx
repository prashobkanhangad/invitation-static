"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/studio-dashboard/blocks";
import { studioApiFetch } from "@/utils/studioApi";

type StorageProvider = "aws_s3" | "gcp_storage";

type EditablePlan = {
  id: string;
  name: string;
  subtitle: string;
  monthly: number;
  sixMonth: number;
  yearly: number;
  isCustom: boolean;
  ctaLabel: string;
  badgeLabel: string;
  features: string[];
  active: boolean;
};

const FALLBACK_PLANS: EditablePlan[] = [
  {
    id: "250gb",
    name: "250 GB",
    subtitle: "Ideal for growing studios",
    monthly: 2999,
    sixMonth: 11994,
    yearly: 20388,
    isCustom: false,
    ctaLabel: "Get Started",
    badgeLabel: "",
    features: ["Digital invitation", "Digital album", "Photo selection"],
    active: true,
  },
  {
    id: "500gb",
    name: "500 GB",
    subtitle: "For high-volume delivery",
    monthly: 4999,
    sixMonth: 20994,
    yearly: 35988,
    isCustom: false,
    ctaLabel: "Get Started",
    badgeLabel: "",
    features: ["Digital invitation", "Digital album", "Photo selection"],
    active: true,
  },
  {
    id: "1tb",
    name: "1 TB",
    subtitle: "Best for large studios",
    monthly: 7499,
    sixMonth: 29994,
    yearly: 50388,
    isCustom: false,
    ctaLabel: "Get Started",
    badgeLabel: "Current Plan",
    features: ["Digital invitation", "Digital album", "Photo selection"],
    active: true,
  },
];

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toEditablePlan(plan: Partial<EditablePlan>, index: number): EditablePlan {
  const name = String(plan.name || "").trim() || `Plan ${index + 1}`;
  return {
    id: String(plan.id || "").trim() || slugify(name) || `plan-${index + 1}`,
    name,
    subtitle: String(plan.subtitle || ""),
    monthly: Number(plan.monthly) || 0,
    sixMonth: Number(plan.sixMonth) || 0,
    yearly: Number(plan.yearly) || 0,
    isCustom: Boolean(plan.isCustom),
    ctaLabel: String(plan.ctaLabel || (plan.isCustom ? "Contact Sales" : "Get Started")),
    badgeLabel: String(plan.badgeLabel || ""),
    features: Array.isArray(plan.features) ? plan.features.map((f) => String(f)).filter(Boolean) : [],
    active: plan.active !== false,
  };
}

export default function StudioSettingsPage() {
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [provider, setProvider] = useState<StorageProvider>("aws_s3");
  const [plans, setPlans] = useState<EditablePlan[]>(FALLBACK_PLANS);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rawUser = window.localStorage.getItem("studio_user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    setIsMasterAdmin(user?.role === "master_admin");

    if (user?.role === "master_admin") {
      void (async () => {
        try {
          const data = await studioApiFetch<{
            settings?: { storageProvider?: StorageProvider; pricingPlans?: EditablePlan[] };
          }>(
            "/api/admin/settings"
          );
          const next = data?.settings?.storageProvider;
          if (next === "aws_s3" || next === "gcp_storage") setProvider(next);
          const incomingPlans = Array.isArray(data?.settings?.pricingPlans) ? data.settings.pricingPlans : [];
          setPlans(incomingPlans.length ? incomingPlans.map((plan, i) => toEditablePlan(plan, i)) : FALLBACK_PLANS);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load settings");
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, []);

  const onSave = async () => {
    setError(null);
    setSaving(true);
    try {
      await studioApiFetch("/api/admin/settings", {
        method: "PATCH",
        body: {
          storageProvider: provider,
          pricingPlans: plans.map((plan) => ({
            ...plan,
            id: plan.id || slugify(plan.name),
            features: plan.features.map((feature) => feature.trim()).filter(Boolean),
          })),
        },
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  const onProviderChange = (next: StorageProvider) => {
    if (next === provider) return;
    const nextLabel = next === "aws_s3" ? "AWS S3" : "GCP Storage";
    const confirmed = window.confirm(`Switch storage provider to ${nextLabel}?`);
    if (!confirmed) return;
    setProvider(next);
    setSaved(false);
  };

  const updatePlan = (index: number, patch: Partial<EditablePlan>) => {
    setPlans((prev) =>
      prev.map((plan, i) => {
        if (i !== index) return plan;
        const next = { ...plan, ...patch };
        if (typeof patch.name === "string" && !plan.id.startsWith("custom-")) {
          next.id = slugify(patch.name) || plan.id;
        }
        return next;
      })
    );
    setSaved(false);
  };

  const addPlan = () => {
    setPlans((prev) => [
      ...prev,
      toEditablePlan(
        {
          id: `custom-${Date.now()}`,
          name: `New Plan ${prev.length + 1}`,
          subtitle: "",
          monthly: 0,
          sixMonth: 0,
          yearly: 0,
          isCustom: false,
          ctaLabel: "Get Started",
          badgeLabel: "",
          features: ["Digital invitation", "Digital album", "Photo selection"],
          active: true,
        },
        prev.length
      ),
    ]);
    setSaved(false);
  };

  const removePlan = (index: number) => {
    setPlans((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Settings"
        description="Manage global studio settings and pricing plans shared across all studio users."
      />

      {!isMasterAdmin ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Only master admin can edit settings.
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">Loading settings…</div>
      ) : (
        <div className="space-y-6">
          <div className="max-w-2xl rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">Storage location</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Choose which storage provider should be treated as active in the admin UI.
            </p>

            <div className="mt-4 space-y-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <input
                  type="radio"
                  name="storage-provider"
                  value="aws_s3"
                  checked={provider === "aws_s3"}
                  onChange={() => onProviderChange("aws_s3")}
                  className="mt-0.5"
                />
                <span>
                  <span className="block text-sm font-semibold text-zinc-900">AWS S3</span>
                  <span className="block text-xs text-zinc-600">Amazon Simple Storage Service</span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <input
                  type="radio"
                  name="storage-provider"
                  value="gcp_storage"
                  checked={provider === "gcp_storage"}
                  onChange={() => onProviderChange("gcp_storage")}
                  className="mt-0.5"
                />
                <span>
                  <span className="block text-sm font-semibold text-zinc-900">GCP Storage</span>
                  <span className="block text-xs text-zinc-600">Google Cloud Storage</span>
                </span>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">Plan catalog</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Edit pricing/text and add plans. Saved changes are applied for all studio users.
                </p>
              </div>
              <button
                type="button"
                onClick={addPlan}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Add plan
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {plans.map((plan, index) => (
                <div key={`${plan.id}-${index}`} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <label className="text-xs text-zinc-600">
                      Name
                      <input
                        value={plan.name}
                        onChange={(e) => updatePlan(index, { name: e.target.value })}
                        className="mt-1 h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                      />
                    </label>
                    <label className="text-xs text-zinc-600">
                      Subtitle
                      <input
                        value={plan.subtitle}
                        onChange={(e) => updatePlan(index, { subtitle: e.target.value })}
                        className="mt-1 h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                      />
                    </label>
                    <label className="text-xs text-zinc-600">
                      Badge text
                      <input
                        value={plan.badgeLabel}
                        onChange={(e) => updatePlan(index, { badgeLabel: e.target.value })}
                        placeholder="Current Plan"
                        className="mt-1 h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                      />
                    </label>
                    <label className="text-xs text-zinc-600">
                      Monthly total
                      <input
                        type="number"
                        min={0}
                        value={plan.monthly}
                        onChange={(e) => updatePlan(index, { monthly: Number(e.target.value) || 0 })}
                        className="mt-1 h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                      />
                    </label>
                    <label className="text-xs text-zinc-600">
                      6 month total
                      <input
                        type="number"
                        min={0}
                        value={plan.sixMonth}
                        onChange={(e) => updatePlan(index, { sixMonth: Number(e.target.value) || 0 })}
                        className="mt-1 h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                      />
                    </label>
                    <label className="text-xs text-zinc-600">
                      Yearly total
                      <input
                        type="number"
                        min={0}
                        value={plan.yearly}
                        onChange={(e) => updatePlan(index, { yearly: Number(e.target.value) || 0 })}
                        className="mt-1 h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                      />
                    </label>
                    <label className="text-xs text-zinc-600 sm:col-span-2 xl:col-span-1">
                      CTA label
                      <input
                        value={plan.ctaLabel}
                        onChange={(e) => updatePlan(index, { ctaLabel: e.target.value })}
                        className="mt-1 h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                      />
                    </label>
                    <label className="text-xs text-zinc-600 sm:col-span-2 xl:col-span-2">
                      Features (comma separated)
                      <input
                        value={plan.features.join(", ")}
                        onChange={(e) =>
                          updatePlan(index, {
                            features: e.target.value
                              .split(",")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          })
                        }
                        className="mt-1 h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                      />
                    </label>
                  </div>

                  <div className="mt-3 flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-xs text-zinc-700">
                      <input
                        type="checkbox"
                        checked={plan.active}
                        onChange={(e) => updatePlan(index, { active: e.target.checked })}
                      />
                      Active
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs text-zinc-700">
                      <input
                        type="checkbox"
                        checked={plan.isCustom}
                        onChange={(e) => updatePlan(index, { isCustom: e.target.checked })}
                      />
                      Custom plan
                    </label>
                    <button
                      type="button"
                      onClick={() => removePlan(index)}
                      className="ml-auto text-xs font-semibold text-rose-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => void onSave()}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <p className="text-xs text-zinc-500">
              Current storage:{" "}
              <span className="font-semibold text-zinc-800">{provider === "aws_s3" ? "AWS S3" : "GCP Storage"}</span>
            </p>
            {saved ? <span className="text-xs font-semibold text-emerald-700">Saved</span> : null}
          </div>
          {error ? <p className="text-xs font-semibold text-rose-700">{error}</p> : null}
        </div>
      )}
    </>
  );
}
