"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const HOLD_MS = 3800;
const SLIDE_MS = 1100;
const SLIDE_WIDTH = 0.76;
const GAP_PX = 8;
// Shared frame for all slides (matches close/lantern). Cover crops alcove slightly — no stretch.
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
  const [pausedUntil, setPausedUntil] = useState(0);
  const [dot, setDot] = useState(0);
  const offsetRef = useRef(1);
  const busyRef = useRef(false);

  const count = photos.length;
  const loopPhotos =
    count > 0 ? [photos[count - 1], ...photos, photos[0]] : [];

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const width = viewport.clientWidth;
    const slide = Math.round(width * SLIDE_WIDTH);
    setSlidePx(slide);
    setSidePad(Math.round((width - slide) / 2));
  }, []);

  const setTrack = useCallback(
    (offset: number, animate: boolean) => {
      const track = trackRef.current;
      if (!track || !slidePx) return;
      const step = slidePx + GAP_PX;
      track.style.transition = animate
        ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
        : "none";
      track.style.transform = `translate3d(${-offset * step}px, 0, 0)`;
    },
    [slidePx],
  );

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
      if (count < 2 || busyRef.current || !slidePx) return;
      busyRef.current = true;
      const next = offsetRef.current + delta;
      offsetRef.current = next;
      setDot(logicalDot(next, count));
      setTrack(next, true);
      window.setTimeout(jumpIfClone, SLIDE_MS + 40);
    },
    [count, jumpIfClone, setTrack, slidePx],
  );

  const pauseAuto = useCallback(() => {
    setPausedUntil(Date.now() + HOLD_MS + 1500);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (!slidePx || count < 1) return;
    offsetRef.current = 1;
    setDot(0);
    setTrack(1, false);
    busyRef.current = false;
  }, [count, setTrack, slidePx]);

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      if (Date.now() < pausedUntil) return;
      goBy(1);
    }, HOLD_MS);

    return () => window.clearInterval(id);
  }, [count, goBy, pausedUntil]);

  if (count === 0) return null;

  const boxH = slidePx ? Math.round(slidePx / BOX_RATIO) : undefined;

  return (
    <div
      ref={viewportRef}
      className="relative overflow-hidden bg-[#071210]"
      aria-roledescription="carousel"
      onTouchStart={pauseAuto}
      onPointerDown={pauseAuto}
      style={boxH ? { height: boxH } : undefined}
    >
      <div
        ref={trackRef}
        className="flex items-stretch will-change-transform"
        style={{
          gap: GAP_PX,
          paddingLeft: sidePad,
          paddingRight: sidePad,
          height: boxH,
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
              loading={i <= 2 ? "eager" : "lazy"}
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
