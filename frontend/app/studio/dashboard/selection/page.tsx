import type { Metadata } from "next";
import StudioPhotoSelectionSection from "@/components/studio-dashboard/StudioPhotoSelectionSection";

export const metadata: Metadata = {
  title: "Photo selection",
};

export default function SelectionPage() {
  return <StudioPhotoSelectionSection />;
}
