import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Outfit } from "next/font/google";
import { Countdown } from "./Countdown";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.invyto.in"),
  title: {
    absolute: "Vasudevan & Athira | Invyto Wedding Invitation",
  },
  description:
    "Celebrate the wedding of Vasudevan and Athira on Saturday, 12 December 2026 at P.P Auditorium, Chalissery.",
  keywords: [
    "Vasudevan and Athira wedding",
    "digital wedding invitation",
    "Chalissery wedding",
    "Palakkad wedding",
    "Kerala wedding invitation",
  ],
  authors: [{ name: "Vasudevan & Athira" }],
  creator: "Invyto",
  publisher: "Invyto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.invyto.in/vasudevan-athira",
  },
  openGraph: {
    title: "Vasudevan & Athira | Invyto Wedding Invitation",
    description:
      "Join us on Saturday, 12 December 2026 at P.P Auditorium, Chalissery.",
    url: "https://www.invyto.in/vasudevan-athira",
    siteName: "Invyto",
    images: [
      {
        url: "https://www.invyto.in/vasudevan-athira/og.jpg",
        width: 1200,
        height: 630,
        alt: "Vasudevan and Athira",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vasudevan & Athira | Invyto Wedding Invitation",
    description: "Save the date — 12 December 2026 at P.P Auditorium, Chalissery.",
    images: ["https://www.invyto.in/vasudevan-athira/og.jpg"],
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

const gallery = [
  {
    src: "/vasudevan/web/03-alcove.jpg",
    alt: "Vasudevan and Athira by a painted alcove",
    width: 1067,
    height: 1600,
  },
  {
    src: "/vasudevan/web/01-steps.jpg",
    alt: "Vasudevan and Athira on the temple steps",
    width: 1600,
    height: 1067,
  },
  {
    src: "/vasudevan/web/04-lantern.jpg",
    alt: "Vasudevan and Athira under warm lantern light",
    width: 1067,
    height: 1440,
  },
  {
    src: "/vasudevan/web/06-close.jpg",
    alt: "Vasudevan and Athira in a close embrace",
    width: 1067,
    height: 1440,
  },
  {
    src: "/vasudevan/web/05-veena.jpg",
    alt: "Vasudevan and Athira with a veena and mirror",
    width: 1067,
    height: 1440,
  },
  {
    src: "/vasudevan/web/07-glow.jpg",
    alt: "Vasudevan and Athira in golden light",
    width: 1067,
    height: 1600,
  },
];

export default function VasudevanAthiraInvitation() {
  return (
    <main
      className={`${sans.className} relative z-10 min-h-screen bg-[#1a0c10] text-[#2a1618]`}
    >
      <style>{`
        @keyframes va-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes va-soft-rise {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes va-line {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }
        .va-fade { animation: va-fade-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .va-fade-delay { animation: va-fade-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both; }
        .va-fade-later { animation: va-fade-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.36s both; }
        .va-rise { animation: va-soft-rise 1.25s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both; }
        .va-line { transform-origin: center; animation: va-line 1s ease 0.45s both; }
        .va-grade-img {
          filter: contrast(1.08) saturate(0.86) brightness(0.96);
        }
        .va-grade-layer {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 42%, transparent 38%, rgba(18, 8, 12, 0.42) 100%),
            linear-gradient(165deg, rgba(42, 78, 92, 0.22) 0%, transparent 42%, rgba(92, 36, 28, 0.28) 100%),
            linear-gradient(0deg, rgba(196, 150, 90, 0.12), rgba(26, 12, 16, 0.08));
          mix-blend-mode: soft-light;
        }
        .va-grade-layer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(26, 12, 16, 0.12) 0%, transparent 28%, transparent 72%, rgba(26, 12, 16, 0.18) 100%);
          mix-blend-mode: multiply;
        }
      `}</style>

      <article className="mx-auto min-h-screen max-w-[460px] overflow-hidden bg-[#f4ebe1] md:my-10 md:min-h-0 md:shadow-[0_30px_80px_rgba(26,12,16,0.45)]">
        <section className="relative">
          <div className="va-rise relative">
            <img
              src="/vasudevan/web/02-pond.jpg"
              alt="Vasudevan and Athira by the temple pond"
              width={1067}
              height={1600}
              className="va-grade-img h-auto w-full"
            />
            <div className="va-grade-layer" aria-hidden />
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#1a0c10]/55 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f4ebe1] to-transparent" />

          <header className="absolute inset-x-0 top-0 px-8 pt-11 text-center text-[#f7efe6]">
            <p className="va-fade text-[10px] font-light uppercase tracking-[0.42em] text-[#e8d2b0]">
              Together with their families
            </p>
            <h1 className={`va-fade-delay ${script.className} mt-4 text-[3.6rem] leading-[0.95]`}>
              Vasudevan
              <span
                className={`${display.className} my-1 block text-[1.15rem] font-normal italic tracking-[0.18em] text-[#e0c39a]`}
              >
                &amp;
              </span>
              Athira
            </h1>
          </header>
        </section>

        <section className="relative z-10 -mt-8 px-8 pb-4 text-center">
          <p className={`va-fade-later ${display.className} text-[1.05rem] font-normal italic leading-relaxed text-[#5a1520]`}>
            We solicit your gracious presence
            <br />
            on the auspicious occasion of our wedding
          </p>

          <div className="va-line mx-auto mt-8 h-px w-16 bg-[#c4a46a]/70" />

          <div className="mt-8 space-y-7">
            <div>
              <p className={`${script.className} text-[2.35rem] leading-none text-[#5a1520]`}>
                Vasudevan
              </p>
              <p className="mt-3 text-[12px] font-light leading-relaxed tracking-[0.04em] text-[#6d5348]">
                S/o Mr. Narayanan Unni &amp; Mrs. Sreedevi
                <br />
                Kottoor Mana, Alikkara, Chalissery P.O, Palakkad
              </p>
            </div>

            <p className={`${display.className} text-[1.4rem] italic text-[#9a7a55]`}>&amp;</p>

            <div>
              <p className={`${script.className} text-[2.35rem] leading-none text-[#5a1520]`}>
                Athira
              </p>
              <p className="mt-3 text-[12px] font-light leading-relaxed tracking-[0.04em] text-[#6d5348]">
                D/o Mr. Vinod &amp; Mrs. Yamuna
                <br />
                Arayakkil Perikamana, Nileshwar, Kasaragod
              </p>
            </div>
          </div>
        </section>

        <section className="px-8 pb-2 pt-10 text-center">
          <div className="mx-auto mb-8 h-px w-10 bg-[#d7c4a8]" />
          <p className="text-[11px] font-light uppercase tracking-[0.34em] text-[#9a7a55]">
            Saturday, 12 December 2026
          </p>
          <p className={`${display.className} mt-4 text-[1.75rem] font-medium leading-tight text-[#5a1520]`}>
            P.P Auditorium
          </p>
          <p className="mt-2 text-[14px] font-light tracking-wide text-[#6d5348]">
            Chalissery, Palakkad
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=P.P+Auditorium+Chalissery+Palakkad"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-[11px] uppercase tracking-[0.24em] text-[#8a5a2b] underline decoration-[#d7c4a8] underline-offset-4"
          >
            Directions
          </a>
          <Countdown numeralClass={display.className} />
        </section>

        <section className="mt-10 flex flex-col gap-1">
          {gallery.map((photo) => (
            <div key={photo.src} className="relative">
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                className="va-grade-img h-auto w-full"
              />
              <div className="va-grade-layer" aria-hidden />
            </div>
          ))}
        </section>

        <footer className="px-8 pb-12 pt-14 text-center">
          <p
            className={`${display.className} text-[1.55rem] font-normal italic leading-snug text-[#5c463c]`}
          >
            Your gracious presence
            <br />
            is our greatest blessing.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 text-[11px] font-light uppercase tracking-[0.22em] text-[#9a7a55]">
            <a
              href="https://www.instagram.com/vijith_krishna_photography"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#d7c4a8] underline-offset-4"
            >
              Vijith Krishna Photography
            </a>
            <a
              href="https://invyto.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#d7c4a8] underline-offset-4"
            >
              Powered by Invyto
            </a>
          </div>
        </footer>
      </article>
    </main>
  );
}
