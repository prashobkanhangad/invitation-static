"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

function isInView(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh * 0.92 && rect.bottom > vh * 0.08;
}

export function Reveal({ children, className = "", delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transitionDelay = `${delayMs}ms`;

    const show = () => {
      el.classList.add("va2-reveal-in");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      return;
    }

    // Immediate check helps iOS when content is already on screen after layout.
    const frame = window.requestAnimationFrame(() => {
      if (isInView(el)) show();
    });

    if (typeof IntersectionObserver === "undefined") {
      show();
      return () => window.cancelAnimationFrame(frame);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show();
          obs.unobserve(el);
          break;
        }
      },
      {
        // Pixel margins — % rootMargin is flaky on mobile Safari.
        root: null,
        threshold: [0, 0.05, 0.15],
        rootMargin: "80px 0px 80px 0px",
      },
    );

    obs.observe(el);

    // Scroll/resize fallback for browsers that miss IO callbacks while scrolling.
    const onScroll = () => {
      if (!el.classList.contains("va2-reveal-in") && isInView(el)) {
        show();
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      obs.disconnect();
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [delayMs]);

  return (
    <div ref={ref} className={`va2-reveal ${className}`}>
      {children}
    </div>
  );
}
