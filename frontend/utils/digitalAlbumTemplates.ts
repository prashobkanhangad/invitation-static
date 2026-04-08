export const DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID = "album-default" as const;

export type DigitalAlbumTemplateId = typeof DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID;

export type DigitalAlbumTemplatePreviewConfig = {
  id: DigitalAlbumTemplateId;
  title: string;
  subtitle: string;
  category: "wedding" | "birthday" | "baby" | "corporate";
  gradient: string;
  coverSrc: string;
  coverAlt: string;
  thumbs: string[];
  footerText: string;
  /** Layout variant for the preview renderer (only variant 1 is defined). */
  previewVariant: 1;
};

// Single album layout — uses sample assets from `public/srideep_shobana/`.
export const digitalAlbumTemplatePreviews: DigitalAlbumTemplatePreviewConfig[] = [
  {
    id: DEFAULT_DIGITAL_ALBUM_TEMPLATE_ID,
    title: "Classic album",
    subtitle: "A cherished collection",
    category: "wedding",
    gradient: "from-[#1c1410] to-[#f7f2e9]",
    coverSrc: "/srideep_shobana/img-36.jpeg",
    coverAlt: "Digital album cover",
    thumbs: [
      "/srideep_shobana/img-13.jpeg",
      "/srideep_shobana/img-17.jpeg",
      "/srideep_shobana/img-18.jpeg",
      "/srideep_shobana/img-12.jpeg",
    ],
    footerText: "Crafted on Invyto",
    previewVariant: 1,
  },
];

export function getDigitalAlbumTemplatePreview(
  id: DigitalAlbumTemplateId | string
): DigitalAlbumTemplatePreviewConfig {
  return digitalAlbumTemplatePreviews.find((t) => t.id === id) ?? digitalAlbumTemplatePreviews[0]!;
}
