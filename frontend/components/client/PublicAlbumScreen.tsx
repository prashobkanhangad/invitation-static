"use client";

import Link from "next/link";
import DigitalAlbumTemplatePreview from "@/components/client/DigitalAlbumTemplatePreview";
import type { DigitalAlbumTemplatePreviewConfig } from "@/utils/digitalAlbumTemplates";

type Props = {
  heading: string;
  subheading: string;
  loading: boolean;
  error: string | null;
  template: DigitalAlbumTemplatePreviewConfig | null;
  images: string[];
};

export default function PublicAlbumScreen({
  heading,
  subheading,
  loading,
  error,
  template,
  images,
}: Props) {
  return (
    <main className="min-h-screen bg-[#efe7da] antialiased text-[#2c1810]">
      <section className="border-b border-black/5 bg-gradient-to-b from-[#f7f2e9] to-[#efe7da] px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8b6914]">Invyto album</p>
              <h1 className="mt-2 text-3xl font-display text-[#2c1810] sm:text-4xl">{heading}</h1>
              <p className="mt-2 max-w-2xl text-sm text-[#654321] sm:text-base">{subheading}</p>
            </div>
            <Link
              href="/"
              className="rounded-xl border border-[#d7c6a6] bg-white/80 px-4 py-2 text-sm font-semibold text-[#654321] hover:bg-white"
            >
              Back
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="rounded-2xl border border-[#d8c8ad] bg-white/80 p-6 text-sm text-[#654321]">
              Loading album preview...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm text-red-800 sm:text-base">{error}</p>
            </div>
          ) : template ? (
            <DigitalAlbumTemplatePreview template={template} imageThumbs={images} />
          ) : (
            <div className="rounded-2xl border border-black/10 bg-white/70 p-6 text-sm text-[#654321]">
              No album template found for this link.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
