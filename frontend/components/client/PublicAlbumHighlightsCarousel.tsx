"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type Item = { id: string; url: string };

function useVisibleSlides(): number {
  const [v, setV] = useState(1);

  const update = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    if (w < 768) setV(1);
    else if (w < 1280) setV(4);
    else setV(5);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return v;
}

export default function PublicAlbumHighlightsCarousel({ items }: { items: Item[] }) {
  const visible = useVisibleSlides();
  const [index, setIndex] = useState(0);

  const maxIndex = useMemo(() => Math.max(0, items.length - visible), [items.length, visible]);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (items.length === 0 || maxIndex === 0) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 4000);
    return () => window.clearInterval(t);
  }, [items.length, maxIndex]);

  /** Inner track width as % of viewport container so each slide is 100%/visible of container. */
  const innerWidthPct = items.length > 0 ? (items.length / visible) * 100 : 100;
  const slideWidthPctOfInner = items.length > 0 ? 100 / items.length : 100;

  if (items.length === 0) return null;

  return (
    <section className="border-t border-[#d8c8ad]/60 bg-[#f7f4ef] px-2 py-8 sm:py-10">
      <div className="w-full">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b6914]">Highlights</p>
        <div className="relative mt-4 w-full overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              width: `${innerWidthPct}%`,
              transform: `translateX(-${(index / items.length) * 100}%)`,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="box-border shrink-0 px-1 sm:px-1.5"
                style={{ width: `${slideWidthPctOfInner}%` }}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-black/5 bg-black/5">
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 25vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {maxIndex > 0 ? (
          <div className="mt-4 flex justify-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={[
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-[#2c1810]" : "w-2 bg-[#d8c8ad] hover:bg-[#a89880]",
                ].join(" ")}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
