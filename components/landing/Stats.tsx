"use client";

import { useState, useEffect, useRef } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "Events Hosted" },
  { value: 5, suffix: "M+", label: "Photos Delivered" },
  { value: 98, suffix: "%", label: "Guest Satisfaction" },
  { value: 150, suffix: "+", label: "Cities" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const dur = 2000;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl font-bold text-gradient-gold">
        {count.toLocaleString()}
        {suffix}
      </div>
    </div>
  );
}

const Stats = () => (
  <section className="py-20 border-y border-border">
    <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <Counter target={s.value} suffix={s.suffix} />
          <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Stats;
