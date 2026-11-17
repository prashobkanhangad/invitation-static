"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const HOLD_MS = 3800;
const SLIDE_MS = 1100;
const SLIDE_WIDTH = 0.76;
const GAP_PX = 5.5;
const BOX_RATIO = 1067 / 1440;

function logicalDot(offset: number, count: number) {
  if (count < 1) return 0;
  if (offset === 0) return count - 1;
  if (offset === count + 1) return 0;
  return Math.min(count - 1, Math.max(0, offset - 1));
}

export function AutoScrollPair({ photos }: { photos: Photo[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [slidePx, setSlidePx] = useState(0);
  const [sidePad, setSidePad] = useState(0);
  const [dot, setDot] = useState(0);
  const [inView, setInView] = useState(false);

  const offsetRef = useRef(1);
  const busyRef = useRef(false);
  const slidePxRef = useRef(0);
  const pausedUntilRef = useRef(0);
  const busyTimerRef = useRef(0);

  const count = photos.length;
  const loopPhotos =
    count > 0 ? [photos[count - 1], ...photos, photos[0]] : [];

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const width = viewport.clientWidth;
    if (width < 2) return;
    const slide = Math.round(width * SLIDE_WIDTH);
    slidePxRef.current = slide;
    setSlidePx(slide);
    setSidePad(Math.round((width - slide) / 2));
  }, []);

  const setTrack = useCallback((offset: number, animate: boolean) => {
    const track = trackRef.current;
    const width = slidePxRef.current;
    if (!track || !width) return;
    const step = width + GAP_PX;
    const next = `translate3d(${-offset * step}px, 0, 0)`;

    if (!animate) {
      track.style.transition = "none";
      track.style.webkitTransform = next;
      track.style.transform = next;
      // Flush so the next animated move isn't skipped
      void track.offsetHeight;
      return;
    }

    track.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    track.style.webkitTransform = next;
    track.style.transform = next;
  }, []);

  const jumpIfClone = useCallback(() => {
    if (count < 2) {
      busyRef.current = false;
      return;
    }
    let offset = offsetRef.current;
    if (offset === 0) {
      offset = count;
      offsetRef.current = offset;
      setTrack(offset, false);
    } else if (offset === count + 1) {
      offset = 1;
      offsetRef.current = offset;
      setTrack(offset, false);
    }
    setDot(logicalDot(offsetRef.current, count));
    busyRef.current = false;
  }, [count, setTrack]);

  const goBy = useCallback(
    (delta: number) => {
      if (count < 2 || busyRef.current || !slidePxRef.current) return;
      busyRef.current = true;
      const next = offsetRef.current + delta;
      offsetRef.current = next;
      setDot(logicalDot(next, count));
      setTrack(next, true);

      window.clearTimeout(busyTimerRef.current);
      busyTimerRef.current = window.setTimeout(jumpIfClone, SLIDE_MS + 50);
    },
    [count, jumpIfClone, setTrack],
  );

  const pauseAuto = useCallback(() => {
    pausedUntilRef.current = Date.now() + HOLD_MS + 1200;
  }, []);

  useLayoutEffect(() => {
    measure();
    offsetRef.current = 1;
    setDot(0);
    setTrack(1, false);
    busyRef.current = false;
  }, [measure, setTrack, count]);

  useEffect(() => {
    const onResize = () => {
      measure();
      setTrack(offsetRef.current, false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    const id = window.setTimeout(() => {
      measure();
      setTrack(offsetRef.current, false);
    }, 100);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.clearTimeout(id);
    };
  }, [measure, setTrack]);

  // Only auto-advance while carousel is on screen (helps mobile timer throttling)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.25),
      { threshold: [0, 0.25, 0.5] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // rAF-based auto advance — more reliable than setInterval on mobile Safari
  useEffect(() => {
    if (count < 2 || !inView || !slidePx) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const elapsed = now - last;
      if (
        elapsed >= HOLD_MS &&
        now >= pausedUntilRef.current &&
        !busyRef.current
      ) {
        last = now;
        goBy(1);
      }
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(busyTimerRef.current);
    };
  }, [count, goBy, inView, slidePx]);

  if (count === 0) return null;

  const boxH = slidePx ? Math.round(slidePx / BOX_RATIO) : undefined;

  // Reserve height before JS measure so the page doesn't jump past the hero.
  const reservedAspect = BOX_RATIO / SLIDE_WIDTH;

  return (
    <div
      ref={viewportRef}
      className="relative overflow-hidden bg-[#071210]"
      aria-roledescription="carousel"
      style={{
        height: boxH,
        aspectRatio: boxH ? undefined : `${reservedAspect}`,
        overflowAnchor: "none",
      }}
    >
      <div
        ref={trackRef}
        className="flex items-stretch will-change-transform"
        style={{
          gap: GAP_PX,
          paddingLeft: sidePad,
          paddingRight: sidePad,
          height: boxH,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {loopPhotos.map((photo, i) => (
          <div
            key={`${photo.src}-${i}`}
            className="relative shrink-0 overflow-hidden"
            style={{
              width: slidePx || `${SLIDE_WIDTH * 100}%`,
              height: boxH,
            }}
          >
            <img
              src={photo.src}
              alt={i > 0 && i < count + 1 ? photo.alt : ""}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              draggable={false}
              aria-hidden={i === 0 || i === count + 1}
              className="va2-photo absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous photo"
        onClick={() => {
          pauseAuto();
          goBy(-1);
        }}
        className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#071210]/55 text-[#e8efe9] backdrop-blur-[2px]"
      >
        <span aria-hidden className="text-[18px] leading-none">
          ‹
        </span>
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={() => {
          pauseAuto();
          goBy(1);
        }}
        className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#071210]/55 text-[#e8efe9] backdrop-blur-[2px]"
      >
        <span aria-hidden className="text-[18px] leading-none">
          ›
        </span>
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {photos.map((item, i) => (
          <span
            key={item.src}
            className={`h-1 w-1 rounded-full transition-colors duration-500 ${
              i === dot ? "bg-[#c9b896]" : "bg-[#c9b896]/35"
            }`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
