"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import { STUDIO_OVERVIEW_HREF, studioNavItems } from "./nav";

type Props = {
  children: React.ReactNode;
};

function NavLink({
  href,
  label,
  description,
  Icon,
  onNavigate,
  active,
}: {
  href: string;
  label: string;
  description: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  onNavigate?: () => void;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "group flex gap-3 rounded-xl px-3 py-2.5 text-left transition",
        active
          ? "bg-zinc-900 text-white shadow-sm"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
      ].join(" ")}
    >
      <span
        className={[
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
          active
            ? "border-white/15 bg-white/10 text-white"
            : "border-zinc-200/80 bg-white text-zinc-500 group-hover:border-zinc-300 group-hover:text-zinc-800",
        ].join(" ")}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-snug">{label}</span>
        <span
          className={[
            "block text-xs leading-snug",
            active ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-600",
          ].join(" ")}
        >
          {description}
        </span>
      </span>
    </Link>
  );
}

export default function StudioDashboardLayoutClient({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const studioName = "Lumière Studios";

  useEffect(() => {
    const token = window.localStorage.getItem("studio_token") || window.localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/studio/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  const onLogout = () => {
    window.localStorage.removeItem("studio_token");
    window.localStorage.removeItem("auth_token");
    window.localStorage.removeItem("studio_user");
    window.sessionStorage.removeItem("studio_token");
    router.replace("/studio/login");
  };

  if (!authChecked) {
    return <div className="min-h-screen bg-zinc-50" />;
  }

  return (
    <div className="relative z-[2] min-h-screen bg-zinc-50 text-zinc-900 antialiased">
      <div className="flex min-h-screen">
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col border-r border-zinc-200/80 bg-white/90 backdrop-blur-md",
            "lg:sticky lg:top-0 lg:shrink-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            "transition-transform duration-200 ease-out",
          ].join(" ")}
        >
          <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-zinc-100 px-4">
            <Link href={STUDIO_OVERVIEW_HREF} className="min-w-0" onClick={() => setMobileOpen(false)}>
              <span className="block truncate text-sm font-semibold tracking-tight">{studioName}</span>
              <span className="block truncate text-xs text-zinc-500">Studio workspace</span>
            </Link>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 lg:hidden"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Products
            </p>
            <nav className="space-y-1">
              {studioNavItems.map((item) => {
                const active =
                  item.href === STUDIO_OVERVIEW_HREF
                    ? pathname === STUDIO_OVERVIEW_HREF
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    description={item.description}
                    Icon={item.icon}
                    active={active}
                    onNavigate={() => setMobileOpen(false)}
                  />
                );
              })}
            </nav>
          </div>

          <div className="shrink-0 border-t border-zinc-100 p-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-semibold text-zinc-900">UI preview</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                This dashboard is front-end only. Wire your APIs when you are ready to ship.
              </p>
            </div>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/80 backdrop-blur">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 lg:hidden"
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" strokeWidth={1.75} />
              </button>

              <div className="hidden min-w-0 flex-1 sm:block">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    strokeWidth={1.75}
                  />
                  <input
                    readOnly
                    placeholder="Search clients, projects, links…"
                    className="h-10 w-full max-w-xl rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm text-zinc-900 outline-none ring-zinc-900/10 placeholder:text-zinc-400 focus:ring-4"
                  />
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
                >
                  Logout
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" strokeWidth={1.75} />
                </button>
                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-sm font-semibold text-white sm:flex">
                  LS
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
