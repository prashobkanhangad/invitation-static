/** All images in public/srideep_shobana (renamed img-1.jpeg … img-63.jpeg) */
const COUNT = 63;
const BASE = "/srideep_shobana";

/** Hero + Open Graph / Twitter preview image */
export const ALBUM_COVER = `${BASE}/img-36.jpeg`;

export const albumPhotos = Array.from({ length: COUNT }, (_, i) => ({
  src: `${BASE}/img-${i + 1}.jpeg`,
  alt: `Sreejai Sreedeep & Shobana Rambe — memory ${i + 1}`,
}));

/** Opening hero image (full-bleed cover) */
export const heroPhoto = {
  src: ALBUM_COVER,
  alt: "Sreejai Sreedeep & Shobana Rambe",
};
