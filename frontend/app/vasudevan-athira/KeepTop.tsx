"use client";

import { useEffect } from "react";

/** Prevents mobile browsers from jumping mid-page on image/carousel layout. */
export function KeepTop() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const pin = () => {
      if (window.location.hash) {
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
      window.scrollTo(0, 0);
    };

    pin();
    const t1 = window.setTimeout(pin, 0);
    const t2 = window.setTimeout(pin, 50);
    const t3 = window.setTimeout(pin, 200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  return null;
}
