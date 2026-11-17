"use client";

import { useEffect, useState } from "react";

const WEDDING = new Date("2026-12-12T09:00:00+05:30").getTime();

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function remaining(now: number): Remaining {
  const total = Math.max(0, Math.floor((WEDDING - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const units = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export function Countdown({ numeralClass }: { numeralClass: string }) {
  const [time, setTime] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setTime(remaining(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const done = time !== null && WEDDING - Date.now() <= 0;

  return (
    <div className="mt-8" aria-live="polite">
      <p className="text-[11px] font-light uppercase tracking-[0.34em] text-[#9a7a55]">
        {done ? "The celebration has begun" : "Until we wed"}
      </p>
      {done ? null : (
        <dl className="mx-auto mt-5 grid max-w-[340px] grid-cols-4 gap-2">
          {units.map((unit) => (
            <div key={unit.key} className="text-center">
              <dt className="sr-only">{unit.label}</dt>
              <dd
                className={`${numeralClass} text-[1.85rem] font-medium leading-none tabular-nums text-[#5a1520]`}
              >
                {time ? String(time[unit.key]).padStart(2, "0") : "––"}
              </dd>
              <dd className="mt-2 text-[10px] font-light uppercase tracking-[0.18em] text-[#9a7a55]">
                {unit.label}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
