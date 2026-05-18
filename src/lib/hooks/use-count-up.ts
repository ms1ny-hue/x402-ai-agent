"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  duration?: number;
  decimals?: number;
}

export function useCountUp(target: number, opts: Options = {}): number {
  const { duration = 900, decimals = 0 } = opts;
  const [value, setValue] = useState<number>(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;

    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = fromRef.current + (target - fromRef.current) * eased;
      const factor = Math.pow(10, decimals);
      setValue(Math.round(next * factor) / factor);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, decimals]);

  return value;
}
