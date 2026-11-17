import type { Metadata } from "next";
import { invytoDisplay as display, invytoSans as sans } from "@/lib/invytoFonts";
import { AutoScrollPair } from "./AutoScrollPair";
import { Countdown } from "./Countdown";
import { KeepTop } from "./KeepTop";
import { OpenInviteLink } from "./OpenInviteLink";
import { Reveal } from "./Reveal";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.invyto.in"),
  title: {
    absolute: "Vasudevan & Athira | Wedding Invitation",
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
    title: "Vasudevan & Athira | Wedding Invitation",
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
    title: "Vasudevan & Athira | Wedding Invitation",
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

const MAP =
  "https://www.google.com/maps/search/?api=1&query=P.P+Auditorium+Chalissery+Palakkad";

export default function VasudevanAthiraInvitationV2() {
  return (
    <main
      className={`${sans.className} relative z-10 min-h-screen bg-[#030908] text-[#e8efe9]`}
    >
      <style>{`
        @keyframes va2-fade {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes va2-hero-in {
          0% { opacity: 0; transform: scale(1.14); filter: contrast(1.06) saturate(0.9) brightness(0.72); }
          55% { opacity: 1; }
          100% { opacity: 1; transform: scale(1); filter: contrast(1.06) saturate(0.9) brightness(0.94); }
        }
        @keyframes va2-draw {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }
        .va2-fade { animation: va2-fade 1.15s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both; }
        .va2-fade-2 { animation: va2-fade 1.15s cubic-bezier(0.22, 1, 0.36, 1) 0.72s both; }
        .va2-fade-3 { animation: va2-fade 1.15s cubic-bezier(0.22, 1, 0.36, 1) 0.88s both; }
        .va2-hero-img {
          transform-origin: center 30%;
          animation: va2-hero-in 2.4s cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }
        .va2-draw { transform-origin: left center; animation: va2-draw 1s ease 1s both; }
        .va2-photo {
          filter: contrast(1.06) saturate(0.9) brightness(0.94);
        }
        .va2-pair-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        .va2-pair-scroll::-webkit-scrollbar {
          display: none;
        }
        .va2-reveal {
          opacity: 0;
          transform: translate3d(0, 22px, 0);
          transition:
            opacity 1.15s cubic-bezier(0.22, 1, 0.36, 1),
            transform 1.15s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .va2-reveal.va2-reveal-in {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
        @supports (animation-timeline: view()) {
          .va2-reveal:not(.va2-reveal-in) {
            animation: va2-fade 1.15s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-timeline: view();
            animation-range: entry 0% cover 35%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .va2-reveal,
          .va2-reveal.va2-reveal-in {
            opacity: 1;
            transform: none;
            transition: none;
            animation: none;
          }
        }
      `}</style>

      <KeepTop />
      <article className="mx-auto min-h-screen max-w-[460px] overflow-x-hidden bg-[#071210] md:my-10 md:min-h-0 md:shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        {/* Hero — phone frame only */}
        <section className="relative isolate min-h-[100svh] overflow-hidden md:min-h-[720px]">
          <img
            src="/vasudevan/web/07-glow.jpg"
            alt="Vasudevan and Athira in golden light"
            width={1067}
            height={1600}
            className="va2-hero-img absolute inset-0 h-full w-full object-cover object-[center_30%]"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(7,18,16,0.35) 0%, rgba(7,18,16,0.15) 35%, rgba(7,18,16,0.55) 70%, rgba(7,18,16,0.92) 100%)",
            }}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-14 pt-28">
            <p className="va2-fade text-[11px] font-light uppercase tracking-[0.42em] text-[#c9b896]">
              Wedding invitation
            </p>
            <h1
              className={`va2-fade-2 ${display.className} mt-5 text-[3.4rem] font-light leading-[0.92] tracking-[-0.02em] text-[#e8efe9]`}
            >
              Vasudevan
              <span className="mx-3 inline-block text-[0.42em] italic text-[#c4786a]">
                &amp;
              </span>
              Athira
            </h1>
            <p className="va2-fade-3 mt-6 text-[15px] font-light leading-relaxed text-[#c5d4cc]">
              Saturday, 12 December 2026 · P.P Auditorium, Chalissery
            </p>
            <OpenInviteLink className="va2-fade-3 mt-8 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#e8efe9]">
              <span className="va2-draw h-px w-10 bg-[#c9b896]" aria-hidden />
              Open invitation
            </OpenInviteLink>
          </div>
        </section>

        <section
          id="details"
          className="relative overflow-hidden px-6 py-16"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, rgba(196,120,106,0.12), transparent 45%), radial-gradient(ellipse at 90% 40%, rgba(20,70,55,0.45), transparent 50%), #0a1a15",
          }}
        >
          <Reveal>
            <p
              className={`${display.className} text-[1.55rem] font-light italic leading-snug text-[#e8efe9]`}
            >
              Together with their families, they invite you to celebrate their
              wedding.
            </p>
          </Reveal>

          <div className="mt-14 space-y-12">
            <Reveal delayMs={120}>
              <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#c4786a]">
                Groom
              </p>
              <p
                className={`${display.className} mt-3 text-[2rem] font-normal leading-none text-[#e8efe9]`}
              >
                Vasudevan
              </p>
              <p className="mt-4 text-[13px] font-light leading-relaxed text-[#9bb0a4]">
                S/o Mr. Narayanan Unni &amp; Mrs. Sreedevi
                <br />
                Kottoor Mana, Alikkara, Chalissery P.O, Palakkad
              </p>
            </Reveal>
            <Reveal delayMs={200}>
              <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#c4786a]">
                Bride
              </p>
              <p
                className={`${display.className} mt-3 text-[2rem] font-normal leading-none text-[#e8efe9]`}
              >
                Athira
              </p>
              <p className="mt-4 text-[13px] font-light leading-relaxed text-[#9bb0a4]">
                D/o Mr. Vinod &amp; Mrs. Yamuna
                <br />
                Arayakkil Perikamana, Nileshwar, Kasaragod
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-[#1d332b] bg-[#071210] px-6 py-14">
          <div className="flex flex-col gap-10">
            <Reveal>
              <p className="text-[11px] font-light uppercase tracking-[0.34em] text-[#9bb0a4]">
                The day
              </p>
              <p
                className={`${display.className} mt-4 text-[5.5rem] font-light leading-none tracking-[-0.04em] text-[#e8efe9]`}
              >
                12
              </p>
              <p className="mt-2 text-[14px] font-light tracking-[0.08em] text-[#c9b896]">
                December 2026 · Saturday
              </p>
            </Reveal>
            <Reveal delayMs={140}>
              <p
                className={`${display.className} text-[1.65rem] font-normal leading-tight text-[#e8efe9]`}
              >
                P.P Auditorium
              </p>
              <p className="mt-2 text-[14px] font-light text-[#9bb0a4]">
                Chalissery, Palakkad
              </p>
              <a
                href={MAP}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-[11px] uppercase tracking-[0.24em] text-[#c9b896] underline decoration-[#3d5248] underline-offset-4"
              >
                Get directions
              </a>
            </Reveal>
          </div>
          <Reveal delayMs={220}>
            <Countdown numeralClass={display.className} />
          </Reveal>
        </section>

        <section className="flex flex-col gap-1 bg-[#071210]">
          <img
            src="/vasudevan/web/02-pond.jpg"
            alt="Vasudevan and Athira by the temple pond"
            width={1067}
            height={1600}
            loading="lazy"
            className="va2-photo h-auto w-full"
          />
          <img
            src="/vasudevan/web/05-veena.jpg"
            alt="Vasudevan and Athira with a veena and mirror"
            width={1067}
            height={1440}
            loading="lazy"
            className="va2-photo h-auto w-full"
          />
        </section>

        <section
          className="relative overflow-hidden px-7 py-16 text-center"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(196,120,106,0.16), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(16,60,48,0.5), transparent 50%), #0a1612",
          }}
        >
          <Reveal>
            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#c4786a]">
              A quiet promise
            </p>
            <div
              className={`${display.className} mx-auto mt-2 text-[3.5rem] font-light leading-none text-[#c9b896]/45`}
              aria-hidden
            >
              “
            </div>
            <blockquote
              className={`${display.className} -mt-4 text-[1.45rem] font-light italic leading-snug text-[#e8efe9]`}
            >
              Two souls, one rhythm
              <br />
              like a veena finding its song.
            </blockquote>
          </Reveal>
          <Reveal delayMs={160}>
            <div className="mx-auto mt-8 h-px w-12 bg-[#c9b896]/50" />
            <p
              className={`${display.className} mt-8 text-[1.15rem] font-light italic leading-relaxed text-[#b7c9bf]`}
            >
              Where the lotus rests,
              <br />
              love learns to stay.
            </p>
            <p className="mt-10 text-[11px] font-light uppercase tracking-[0.28em] text-[#7f968a]">
              Vasudevan &amp; Athira
            </p>
          </Reveal>
        </section>

        <section className="flex flex-col gap-1 bg-[#071210]">
          <AutoScrollPair
            photos={[
              {
                src: "/vasudevan/web/06-close.jpg",
                alt: "Vasudevan and Athira in a close embrace",
                width: 1067,
                height: 1440,
              },
              {
                src: "/vasudevan/web/04-lantern.jpg",
                alt: "Vasudevan and Athira under warm lantern light",
                width: 1067,
                height: 1440,
              },
              {
                src: "/vasudevan/web/03-alcove.jpg",
                alt: "Vasudevan and Athira by a painted alcove",
                width: 1067,
                height: 1600,
              },
            ]}
          />
          <img
            src="/vasudevan/web/01-steps.jpg"
            alt="Vasudevan and Athira on the temple steps"
            width={1600}
            height={1067}
            loading="lazy"
            className="va2-photo h-auto w-full"
          />
        </section>

        <footer className="px-6 py-16 text-center">
          <Reveal>
            <p
              className={`${display.className} text-[1.45rem] font-light italic leading-snug text-[#c5d4cc]`}
            >
              Your gracious presence
              <br />
              is our greatest blessing.
            </p>
          </Reveal>
          <Reveal delayMs={140}>
            <div className="mt-12 flex flex-col items-center gap-3 text-[11px] font-light uppercase tracking-[0.22em] text-[#7f968a]">
              <a
                href="https://www.instagram.com/vijith_krishna_photography"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#2a4038] underline-offset-4"
              >
                Vijith Krishna Photography
              </a>
              <a
                href="https://invyto.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] tracking-[0.18em] text-[#5f746a] underline decoration-[#2a4038] underline-offset-4"
              >
                Powered by Invyto
              </a>
            </div>
          </Reveal>
        </footer>
      </article>
    </main>
  );
}
