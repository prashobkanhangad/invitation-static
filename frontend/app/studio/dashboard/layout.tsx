import type { Metadata } from "next";
import StudioDashboardLayoutClient from "@/components/studio-dashboard/StudioDashboardLayoutClient";

export const metadata: Metadata = {
  title: {
    default: "Studio dashboard",
    template: "%s · Studio",
  },
  description: "Manage your studio site, client invitations, digital albums, and photo selection in one place.",
  robots: { index: false, follow: false },
};

export default function StudioDashboardLayout({ children }: { children: React.ReactNode }) {
  return <StudioDashboardLayoutClient>{children}</StudioDashboardLayoutClient>;
}
