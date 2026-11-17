import localFont from "next/font/local";

/** Self-hosted so deploy builds do not depend on fonts.gstatic.com */
export const invytoDisplay = localFont({
  src: [
    {
      path: "../public/fonts/fraunces-latin-wght-normal.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../public/fonts/fraunces-latin-wght-italic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-invyto-display",
  display: "swap",
});

export const invytoSans = localFont({
  src: [
    {
      path: "../public/fonts/sora-latin-wght-normal.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-invyto-sans",
  display: "swap",
});
