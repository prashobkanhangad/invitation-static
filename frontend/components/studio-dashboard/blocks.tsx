import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  delta,
}: {
  label: string;
  value: string;
  hint: string;
  delta?: { text: string; positive?: boolean };
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
        {delta ? (
          <span
            className={[
              "text-xs font-semibold",
              delta.positive === false ? "text-rose-600" : "text-emerald-700",
            ].join(" ")}
          >
            {delta.text}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-500">{hint}</p>
    </div>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad";
}) {
  const styles =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200/60"
      : tone === "warn"
        ? "bg-amber-50 text-amber-900 ring-amber-200/70"
        : tone === "bad"
          ? "bg-rose-50 text-rose-800 ring-rose-200/60"
          : "bg-zinc-100 text-zinc-700 ring-zinc-200/70";

  return (
    <span className={["inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1", styles].join(" ")}>
      {children}
    </span>
  );
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
      {...props}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}
