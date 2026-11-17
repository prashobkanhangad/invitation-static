"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { openWhatsApp } from "@/utils/whatsapp";

/** Real phone layout width so fonts/spacing match /vasudevan-athira on device */
const INVITE_WIDTH = 390;
const INVITE_HEIGHT = Math.round((INVITE_WIDTH * 16) / 9);

function LiveInvitePhone() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(INVITE_WIDTH > 0 ? 280 / INVITE_WIDTH : 1);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setScale(w / INVITE_WIDTH);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className="relative aspect-[9/16] w-full overflow-hidden bg-[#030908]"
    >
      <iframe
        src="/vasudevan-athira"
        title="Vasudevan and Athira live digital wedding invitation"
        className="absolute left-0 top-0 border-0"
        style={{
          width: INVITE_WIDTH,
          height: INVITE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

const Hero = () => (
  <section className="relative isolate min-h-[100svh] overflow-hidden">
    <img
      src="/landing/hero-atmosphere.jpg"
      alt=""
      width={1920}
      height={1080}
      className="invyto-bloom absolute inset-0 h-full w-full scale-105 object-cover object-center"
      fetchPriority="high"
      aria-hidden
    />
    <img
      src="/landing/hero-florals.jpg"
      alt=""
      width={1920}
      height={1080}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.28] mix-blend-screen"
      aria-hidden
    />
    <div
      className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full blur-3xl"
      style={{ background: "radial-gradient(circle, rgba(201,168,96,0.22), transparent 70%)" }}
      aria-hidden
    />
    <div
      className="pointer-events-none absolute bottom-10 right-[18%] h-80 w-80 rounded-full blur-3xl"
      style={{ background: "radial-gradient(circle, rgba(201,168,96,0.14), transparent 68%)" }}
      aria-hidden
    />
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, rgba(7,18,16,0.62) 0%, rgba(7,18,16,0.42) 38%, rgba(7,18,16,0.78) 72%, rgba(7,18,16,0.96) 100%)",
      }}
      aria-hidden
    />
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          "radial-gradient(1.5px 1.5px at 20% 30%, rgba(255,236,190,0.35), transparent), radial-gradient(1px 1px at 70% 22%, rgba(255,236,190,0.28), transparent), radial-gradient(1.5px 1.5px at 55% 68%, rgba(255,236,190,0.22), transparent), radial-gradient(1px 1px at 82% 55%, rgba(255,236,190,0.2), transparent)",
      }}
      aria-hidden
    />

    <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-14 pt-24 md:justify-center md:pb-20 md:pt-28">
      <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1.05fr)_minmax(250px,300px)] md:gap-16 lg:gap-20">
        <div className="relative max-w-xl md:pb-6">
          <div
            className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 hidden rounded-[2rem] md:block"
            style={{
              background:
                "radial-gradient(ellipse at 30% 45%, rgba(7,18,16,0.55) 0%, rgba(7,18,16,0.18) 55%, transparent 75%)",
            }}
            aria-hidden
          />

          <p className="invyto-fade font-display text-[clamp(3.4rem,9vw,5.6rem)] font-light leading-[0.9] tracking-[-0.04em] text-foreground">
            Invyto
          </p>

          <div
            className="invyto-fade-2 mt-5 h-px w-16 bg-gradient-to-r from-primary/80 to-transparent"
            aria-hidden
          />

          <h1 className="invyto-fade-2 mt-6 max-w-[22ch] font-display text-[clamp(1.55rem,3.8vw,2.15rem)] font-normal leading-[1.25] tracking-[-0.01em] text-foreground/95">
            Digital wedding invitations made for WhatsApp
          </h1>

          <p className="invyto-fade-3 mt-5 max-w-[34ch] text-[15px] font-light leading-[1.7] text-muted-foreground">
            One polished link with dates, venue map, timings and your story —
            ready to share with every guest group.
          </p>

          <div className="invyto-fade-3 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#live-examples"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              See live examples
            </a>
            <button
              type="button"
              onClick={() =>
                openWhatsApp(
                  "Hi! I'd like to create a digital wedding invitation for WhatsApp.",
                )
              }
              className="inline-flex items-center justify-center rounded-full border border-border/80 bg-background/20 px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur-sm transition hover:border-primary/50 hover:bg-background/35"
            >
              Create on WhatsApp
            </button>
          </div>
        </div>

        <div className="invyto-fade-3 relative mx-auto w-full max-w-[280px] md:mx-0 md:justify-self-end">
          <div className="overflow-hidden rounded-[1.6rem] border border-border/80 bg-[#030908] shadow-[0_30px_80px_rgba(0,0,0,0.45)] ring-1 ring-primary/15">
            <div className="flex items-center justify-center gap-1 border-b border-border/60 bg-secondary/80 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
            </div>
            <LiveInvitePhone />
          </div>
          <Link
            href="/vasudevan-athira"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-center text-[11px] font-medium uppercase tracking-[0.22em] text-primary underline-offset-4 hover:underline"
          >
            Open full invite →
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
