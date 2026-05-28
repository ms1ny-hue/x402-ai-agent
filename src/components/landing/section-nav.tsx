"use client";

import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
  code: string;
}

const ITEMS: NavItem[] = [
  { id: "top", label: "Surface", code: "00" },
  { id: "envelope", label: "Envelope", code: "01" },
  { id: "how", label: "Handshake", code: "02" },
  { id: "demo", label: "Agent", code: "03" },
  { id: "payments", label: "On-chain", code: "04" },
  { id: "spec", label: "Spec", code: "05" },
  { id: "trust", label: "Trust", code: "06" },
  { id: "economics", label: "Econ", code: "07" },
  { id: "compare", label: "vs PSPs", code: "08" },
  { id: "questions", label: "Q&A", code: "09" },
  { id: "integrate", label: "Integrate", code: "10" },
];

export function SectionNav() {
  const [active, setActive] = useState<string>("top");
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      setProgress(docHeight > 0 ? scrollY / docHeight : 0);

      // active section = the one closest to viewport top + 25%
      const cursor = scrollY + window.innerHeight * 0.25;
      let bestId = ITEMS[0]!.id;
      let bestDelta = Infinity;
      for (const item of ITEMS) {
        const el =
          item.id === "envelope"
            ? document.querySelectorAll("section[data-reveal]")[0]
            : item.id === "top"
              ? document.body
              : document.getElementById(item.id);
        if (!el) continue;
        const rect = (el as HTMLElement).getBoundingClientRect();
        const top = rect.top + scrollY;
        const delta = Math.abs(top - cursor);
        if (delta < bestDelta) {
          bestDelta = delta;
          bestId = item.id;
        }
      }
      setActive(bestId);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (id === "envelope") {
      // hero-numeral is the first data-reveal section
      const el = document.querySelectorAll("section[data-reveal]")[0];
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigator"
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-0 backdrop-blur-md bg-black/30 border border-[var(--x-border-bright)] px-2 py-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--x-text-subtle)] pointer-events-auto"
    >
      <div className="text-center text-[8.5px] tracking-[0.32em] text-[var(--x-text-faint)] mb-2">
        ◇ nav
      </div>
      <div className="flex flex-col">
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleClick(item.id)}
              className={`group relative flex items-center gap-2 py-1.5 pl-2 pr-3 border-l ${
                isActive
                  ? "border-l-[var(--x-accent)] text-[var(--x-accent)]"
                  : "border-l-transparent hover:text-[var(--x-text)] hover:border-l-[var(--x-border-bright)]"
              } transition-colors`}
            >
              <span
                className={`tnum text-[8.5px] ${
                  isActive
                    ? "text-[var(--x-signal)]"
                    : "text-[var(--x-text-faint)]"
                }`}
              >
                {item.code}
              </span>
              <span
                className={
                  isActive
                    ? "text-[var(--x-text)]"
                    : "text-[var(--x-text-subtle)] group-hover:text-[var(--x-text)]"
                }
              >
                {item.label}
              </span>
              <span
                aria-hidden
                className={`ml-auto w-1 h-1 rounded-full ${
                  isActive
                    ? "bg-[var(--x-accent-bright)] shadow-[0_0_6px_rgba(56,189,248,0.9)]"
                    : "bg-[var(--x-text-faint)]"
                }`}
              />
            </a>
          );
        })}
      </div>
      {/* progress bar */}
      <div className="mt-3 pt-2 border-t border-[var(--x-border-bright)]">
        <div className="flex items-center justify-between text-[8.5px] mb-1">
          <span>scroll</span>
          <span className="tnum text-[var(--x-accent)]">
            {(progress * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-1 bg-[var(--x-border)] relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--x-accent-bright)] to-[var(--x-signal)]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </nav>
  );
}
