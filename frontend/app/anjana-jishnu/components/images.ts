const base = "/anjana-jishnu";

export const images = {
  hero: `${base}/img-15.webp`,
  story: `${base}/img-4.webp`,
  footer: `${base}/img-9.webp`,
  desktop: [`${base}/img-2.webp`, `${base}/img-7.webp`, `${base}/img-8.webp`] as const,
  gallery: [
    { src: `${base}/img-1.webp`, alt: "Anjana & Jishnu in the misty meadow" },
    { src: `${base}/img-3.webp`, alt: "A quiet moment together" },
    { src: `${base}/img-5.webp`, alt: "Walking through the hills" },
    { src: `${base}/img-6.webp`, alt: "Wedding moment" },
    { src: `${base}/img-10.webp`, alt: "A tender blessing" },
    { src: `${base}/img-11.webp`, alt: "Joyful memory" },
    { src: `${base}/img-12.webp`, alt: "Playful twirl" },
    { src: `${base}/img-13.webp`, alt: "Close portrait" },
  ],
  carousel: [
    { src: `${base}/img-14.webp`, alt: "In each other's arms" },
    { src: `${base}/img-4.webp`, alt: "Sitting together" },
    { src: `${base}/img-7.webp`, alt: "Walking towards forever" },
    { src: `${base}/img-8.webp`, alt: "Holding hands" },
    { src: `${base}/img-10.webp`, alt: "Forehead kiss" },
    { src: `${base}/img-12.webp`, alt: "A joyful step" },
  ],
};

export const venueMapLink =
  "https://www.google.com/maps/search/?api=1&query=Malabar+Ocean+Front+and+Spa+Nileshwar";
export const venueEmbedUrl =
  "https://www.google.com/maps?q=Malabar+Ocean+Front+and+Spa+Nileshwar&output=embed";
