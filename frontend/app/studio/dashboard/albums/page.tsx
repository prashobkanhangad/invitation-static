import type { Metadata } from "next";
import StudioAlbumsSection from "@/components/studio-dashboard/StudioAlbumsSection";

export const metadata: Metadata = {
  title: "Digital albums",
};

export default function AlbumsPage() {
  return <StudioAlbumsSection />;
}
