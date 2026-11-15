import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Countdown } from "./Countdown";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.invyto.in"),
  title: {
    absolute: "Shreerag & Revathi | Invyto Wedding Invitation",
  },
  description:
    "Celebrate the wedding of Shreerag PR and Revathi Sankar. Thalikettu at Guruvayoor Sreekrishna Temple on 12 December 2026, wedding at Devapadam Auditorium, and reception at Sreebhadra Convention Centre.",
  keywords: [
    "Shreerag and Revathi wedding",
    "digital wedding invitation",
    "Guruvayoor wedding",
    "Palakkad wedding",
    "Sreekrishnapuram wedding",
  ],
  authors: [{ name: "Shreerag & Revathi" }],
  creator: "Invyto",
  publisher: "Invyto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.invyto.in/shreerag-revathi",
  },
  openGraph: {
    title: "Shreerag & Revathi | Invyto Wedding Invitation",
    description:
      "Join us on 12 and 13 December 2026 for the wedding of Shreerag and Revathi.",
    url: "https://www.invyto.in/shreerag-revathi",
    siteName: "Invyto",
    images: [
      {
        url: "https://www.invyto.in/shreerag-revathi/og.jpg",
        width: 1200,
        height: 630,
        alt: "Shreerag and Revathi",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreerag & Revathi | Invyto Wedding Invitation",
    description: "Save the dates and celebrate with Shreerag and Revathi.",
    images: ["https://www.invyto.in/shreerag-revathi/og.jpg"],
    creator: "@invyto",
  },
  robots: {
    index: false,
    follow: false,
    nocache: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "wedding",
};

const events = [
  {
    name: "Thalikettu",
    place: "Guruvayoor Sreekrishna Temple",
    when: "Saturday, 12 December 2026",
    time: "Early morning",
    map: "https://www.google.com/maps/search/?api=1&query=Guruvayoor+Sree+Krishna+Temple",
  },
  {
    name: "Wedding ceremony",
    place: "Devapadam Auditorium",
    detail: "Thiruvazhiyode, Palakkad",
    when: "Saturday, 12 December 2026",
    time: "From 9:00 AM",
    map: "https://www.google.com/maps/search/?api=1&query=Devapadam+Auditorium+Thiruvazhiyode+Palakkad",
  },
  {
    name: "Reception",
    place: "Sreebhadra Convention Centre",
    detail: "Mannampatta, Sreekrishnapuram",
    when: "Sunday, 13 December 2026",
    time: "4:30 PM – 8:30 PM",
    map: "https://www.google.com/maps/search/?api=1&query=Sreebhadra+Convention+Centre+Mannampatta+Sreekrishnapuram",
  },
];

const gallery = [
  {
    src: "/Shreerag/web/01-walk.jpg",
    alt: "Shreerag and Revathi walking together",
    width: 1067,
    height: 1067,
  },
  {
    src: "/Shreerag/web/02-house.jpg",
    alt: "Shreerag and Revathi beside a stone cottage",
    width: 1067,
    height: 1380,
  },
  {
    src: "/Shreerag/web/04-trees.jpg",
    alt: "Shreerag and Revathi holding hands beneath the trees",
    width: 1067,
    height: 1067,
  },
  {
    src: "/Shreerag/web/05-window.jpg",
    alt: "Shreerag and Revathi at a green window",
    width: 1067,
    height: 1067,
  },
];

export default function ShreeragInvitation() {
  return (
    <main
      className={`${sans.className} relative z-10 min-h-screen bg-[#ebe6df] text-[#241f1c]`}
    >
      <article className="mx-auto min-h-screen max-w-[460px] bg-[#f7f4ef] md:my-12 md:min-h-0 md:shadow-[0_24px_70px_rgba(36,31,28,0.08)]">
        <div className="relative">
          <img
            src="/Shreerag/web/03-mist.jpg"
            alt="Shreerag and Revathi walking through the mist"
            width={1067}
            height={1600}
            className="h-auto w-full"
          />
          <header className="absolute inset-x-0 top-0 px-8 pt-10 text-center">
            <p className="text-[11px] font-light uppercase tracking-[0.38em] text-[#8a8176]">
              Together with their families
            </p>
            <h1
              className={`${display.className} mt-5 text-[3.15rem] font-medium leading-[0.92] tracking-tight`}
            >
              Shreerag
              <span className="my-1.5 block font-normal text-[1.7rem] italic text-[#b08980]">
                and
              </span>
              Revathi
            </h1>
            <p className="mt-4 text-[13px] font-light tracking-[0.16em] text-[#6d6560]">
              Shreerag PR
              <span className="mx-2 text-[#b08980]">·</span>
              Revathi Sankar
            </p>
          </header>
        </div>

        <section className="px-8 pb-2 pt-10 text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.32em] text-[#8a8176]">
            12 — 13 December 2026
          </p>
          <Countdown numeralClass={display.className} />
        </section>

        <section className="px-8 pb-12 pt-10">
          <div className="mx-auto mb-10 h-px w-10 bg-[#d9cfc4]" />
          <ul className="space-y-9">
            {events.map((event) => (
              <li key={event.name} className="text-center">
                <h2
                  className={`${display.className} text-[1.85rem] font-medium leading-none`}
                >
                  {event.name}
                </h2>
                <p className="mt-3 text-[15px] font-light leading-snug">
                  {event.place}
                </p>
                {event.detail ? (
                  <p className="text-[15px] font-light leading-snug text-[#6d6560]">
                    {event.detail}
                  </p>
                ) : null}
                <p className="mt-3 text-[12px] font-light uppercase tracking-[0.16em] text-[#8a8176]">
                  {event.when}
                </p>
                <p className="mt-1 text-[13px] font-normal tracking-wide">
                  {event.time}
                </p>
                <a
                  href={event.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[11px] uppercase tracking-[0.22em] text-[#8d735c] underline decoration-[#d9cfc4] underline-offset-4"
                >
                  Directions
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-1">
          {gallery.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              className="h-auto w-full"
            />
          ))}
        </section>

        <footer className="px-8 pb-10 pt-14 text-center">
          <p
            className={`${display.className} text-[1.65rem] font-normal italic leading-snug text-[#5c554f]`}
          >
            Your presence will make
            <br />
            the day complete.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 text-[11px] font-light uppercase tracking-[0.22em] text-[#8a8176]">
            <a
              href="https://www.instagram.com/vijith_krishna_photography"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#d9cfc4] underline-offset-4"
            >
              Vijith Krishna Photography
            </a>
            <a
              href="https://invyto.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#d9cfc4] underline-offset-4"
            >
              Powered by Invyto
            </a>
          </div>
        </footer>
      </article>
    </main>
  );
}
