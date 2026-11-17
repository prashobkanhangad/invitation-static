"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

function isInView(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vh =
    window.visualViewport?.height ||
    window.innerHeight ||
    document.documentElement.clientHeight;
  // Generous on mobile — trigger as soon as it enters the lower/upper band.
  return rect.top < vh * 0.96 && rect.bottom > 0;
}

export function Reveal({ children, className = "", delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;
    let raf = 0;

    const show = () => {
      if (done) return;
      done = true;
      el.style.transitionDelay = `${delayMs}ms`;
      el.classList.add("va2-reveal-in");
      cleanup();
    };

    const check = () => {
      if (!done && isInView(el)) show();
    };

    const onScrollOrTouch = () => {
      if (done) return;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        check();
      });
    };

    const observers: IntersectionObserver[] = [];
    const cleanupFns: Array<() => void> = [];

    const cleanup = () => {
      if (raf) window.cancelAnimationFrame(raf);
      observers.forEach((o) => o.disconnect());
      cleanupFns.forEach((fn) => fn());
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      return;
    }

    // 1) IntersectionObserver (desktop + modern mobile)
    if (typeof IntersectionObserver !== "undefined") {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting || e.intersectionRatio > 0)) {
            show();
          }
        },
        { root: null, threshold: [0, 0.01, 0.1], rootMargin: "120px 0px 120px 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    }

    // 2) iOS often delays window "scroll" until momentum ends — also listen to touch + visualViewport
    const opts: AddEventListenerOptions = { passive: true, capture: true };
    window.addEventListener("scroll", onScrollOrTouch, opts);
    document.addEventListener("scroll", onScrollOrTouch, opts);
    document.addEventListener("touchmove", onScrollOrTouch, opts);
    document.addEventListener("touchend", onScrollOrTouch, opts);
    window.visualViewport?.addEventListener("scroll", onScrollOrTouch);
    window.visualViewport?.addEventListener("resize", onScrollOrTouch);
    window.addEventListener("resize", onScrollOrTouch, opts);

    cleanupFns.push(() => {
      window.removeEventListener("scroll", onScrollOrTouch, true);
      document.removeEventListener("scroll", onScrollOrTouch, true);
      document.removeEventListener("touchmove", onScrollOrTouch, true);
      document.removeEventListener("touchend", onScrollOrTouch, true);
      window.visualViewport?.removeEventListener("scroll", onScrollOrTouch);
      window.visualViewport?.removeEventListener("resize", onScrollOrTouch);
      window.removeEventListener("resize", onScrollOrTouch, true);
    });

    // 3) Periodic check while the page is alive (cheap; stops after reveal)
    const interval = window.setInterval(check, 400);
    cleanupFns.push(() => window.clearInterval(interval));

    // Initial layout pass
    check();
    const t1 = window.setTimeout(check, 100);
    const t2 = window.setTimeout(check, 400);
    cleanupFns.push(() => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    });

    return cleanup;
  }, [delayMs]);

  return (
    <div ref={ref} className={`va2-reveal ${className}`}>
      {children}
    </div>
  );
}
