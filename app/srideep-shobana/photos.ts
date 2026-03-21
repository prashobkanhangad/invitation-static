/** Base images in public/srideep_shobana (renamed img-1.jpeg … img-63.jpeg) */
const COUNT = 63;
const BASE = "/srideep_shobana";

/** Hero + Open Graph / Twitter preview image */
export const ALBUM_COVER = `${BASE}/img-36.jpeg`;

const basePhotos = Array.from({ length: COUNT }, (_, i) => ({
  src: `${BASE}/img-${i + 1}.jpeg`,
  alt: `Sreejai Sreedeep & Shobana Rambe — memory ${i + 1}`,
}));

// Additional photos that were added later (original filenames)
const extraPhotos = [
  {
    src: `${BASE}/_G6A3075 (1).jpg`,
    alt: "Sreejai Sreedeep & Shobana Rambe — featured memory",
  },
  {
    src: `${BASE}/WhatsApp Image 2026-03-21 at 11.08.37.jpeg`,
    alt: "Sreejai Sreedeep & Shobana Rambe — memory (extra 1)",
  },
  {
    src: `${BASE}/WhatsApp Image 2026-03-21 at 11.08.40.jpeg`,
    alt: "Sreejai Sreedeep & Shobana Rambe — memory (extra 2)",
  },
];

export const albumPhotos = [...basePhotos, ...extraPhotos];

/** Opening hero image (full-bleed cover) */
export const heroPhoto = {
  src: ALBUM_COVER,
  alt: "Sreejai Sreedeep & Shobana Rambe",
};
