import {
  BookOpen,
  CreditCard,
  Globe2,
  Heart,
  Image as ImageIcon,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StudioNavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type StudioUserRole = "master_admin" | "studio";

export const STUDIO_OVERVIEW_HREF = "/studio/dashboard";

export const studioNavItems: StudioNavItem[] = [
  // Overview — hidden while dashboard home overview is disabled (`app/studio/dashboard/page.tsx`).
  // {
  //   href: STUDIO_OVERVIEW_HREF,
  //   label: "Overview",
  //   description: "KPIs and shortcuts",
  //   icon: LayoutDashboard,
  // },
  {
    href: "/studio/dashboard/selection",
    label: "Photo selection",
    description: "Culls from raw footage",
    icon: ImageIcon,
  },
  {
    href: "/studio/dashboard/albums",
    label: "Digital albums",
    description: "Deliverable galleries",
    icon: BookOpen,
  },
  {
    href: "/studio/dashboard/studio-site",
    label: "Studio site",
    description: "Your public studio landing",
    icon: Globe2,
  },
  {
    href: "/studio/dashboard/invitations",
    label: "Client invitations",
    description: "Wedding & event pages",
    icon: Heart,
  },
  {
    href: "/studio/dashboard/plans",
    label: "Plan and Usage",
    description: "Pricing and storage plans",
    icon: CreditCard,
  },
  {
    href: "/studio/dashboard/account",
    label: "Account",
    description: "Studio name, profile, and sign-in",
    icon: UserCircle,
  },
  {
    href: "/studio/dashboard/users",
    label: "Users",
    description: "Master admin user management",
    icon: Users,
  },
  {
    href: "/studio/dashboard/settings",
    label: "Settings",
    description: "Admin storage preferences",
    icon: Settings,
  },
];

export function getStudioNavItemsByRole(role: StudioUserRole | null | undefined): StudioNavItem[] {
  if (role === "master_admin") return studioNavItems;
  return studioNavItems.filter(
    (item) =>
      item.href !== "/studio/dashboard/users" &&
      item.href !== "/studio/dashboard/settings"
  );
}
