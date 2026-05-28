import Link from "next/link";
import { Waveform } from "@/components/landing/waveform";

const LINES: Array<{
  prompt: string;
  text: string;
  tone: "muted" | "cyan" | "amber" | "positive";
}> = [
  {
    prompt: "$",
    text: "curl https://x402.demo/api/research?ticker=NVDA",
    tone: "muted",
  },
  {
    prompt: "<-",
    text: "HTTP/1.1 402 Payment Required",
    tone: "amber",
  },
  {
    prompt: "$",
    text: "sign EIP-3009 · POST X-PAYMENT",
    tone: "muted",
  },
  {
    prompt: "<-",
    text: "HTTP/1.1 200 OK · tx 0x4f…ae · 2.81s",
    tone: "cyan",
  },
  {
    prompt: "✓",
    text: "settled · 0.005 USDC · base-sepolia",
    tone: "positive",
  },
];

export function ClosingCta() {
  return (
    <section
      data-reveal
      className="border-b border-[var(--x-border-bright)] bg-[var(--x-bg-deep)] relative overflow-hidden"
    >
      <div className="absolute left-0 right-0 top-0 h-[6px] tick-ruler opacity-50 pointer-events-none" />
      <div className="absolute inset-0 cross-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_70%_50%,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_20%_120%,rgba(252,211,77,0.10),transparent_55%)]" />

      <div className="absolute left-0 right-0 bottom-0 h-[140px] pointer-events-none opacity-25 mix-blend-screen">
        <Waveform
          className="w-full h-full"
          seed={777}
          amplitude={0.6}
          samples={200}
          stroke="rgba(125, 211, 252, 0.45)"
          strokeShadow="rgba(56, 189, 248, 0.15)"
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 py-16 md:py-24 relative grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center">
        {/* LEFT — pitch */}
        <div>
          <div className="flex items-center gap-2 mb-5 text-[10px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] font-mono">
            <span className="text-[var(--x-accent)]">◢</span>
            <span>end of brief</span>
            <span className="ml-2 flex-1 h-px bg-[var(--x-border-bright)] max-w-[80px]" />
          </div>

          <h2
            className="font-serif leading-[0.92] tracking-[-0.035em] mb-5"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontVariationSettings: '"opsz" 144, "SOFT" 100',
              fontWeight: 400,
            }}
          >
            <span className="chrome-text">Same envelope.</span>
            <br />
            <span
              className="italic amber-text"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
            >
              your endpoint.
            </span>
          </h2>

          <p className="text-[14px] text-[var(--x-text-muted)] leading-[1.65] max-w-[55ch] mb-6">
            The handshake above is the entire contract. Wire a 402 in front
            of any paid endpoint, register a wallet with the facilitator,
            and a software buyer can pay you in stablecoin per call. No
            checkout. No merchant account. No card on file.
          </p>

          <div className="flex flex-wrap gap-2 mb-7">
            <Link href="#demo" className="console-button-primary">
              <span>Trigger a payment</span>
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="https://github.com/ms1ny-hue/x402-ai-agent"
              className="console-button-ghost"
            >
              <span className="text-[var(--x-text-faint)]">⌗</span>
              <span>View source</span>
              <span aria-hidden>↗</span>
            </Link>
            <Link href="#integrate" className="console-button-ghost is-amber">
              <span className="text-[var(--x-text-faint)]">◇</span>
              <span>Integration snippet</span>
            </Link>
          </div>

          <ul className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-[var(--x-text-subtle)] space-y-1.5 border-l border-[var(--x-border-bright)] pl-4">
            <li>
              <span className="text-[var(--x-accent)]">›</span> two files of
              middleware
            </li>
            <li>
              <span className="text-[var(--x-accent)]">›</span> one Coinbase
              CDP wallet
            </li>
            <li>
              <span className="text-[var(--x-accent)]">›</span> zero buyer gas
            </li>
            <li>
              <span className="text-[var(--x-signal)]">›</span> one
              hundred atomic-USDC minimum charge
            </li>
          </ul>
        </div>

        {/* RIGHT — terminal showpiece */}
        <div className="relative">
          <div className="absolute -top-3 left-4 px-2 text-[9.5px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)] bg-[var(--x-bg-deep)] z-10">
            terminal · session 0001
          </div>
          <div className="chrome-border bg-black/85 relative">
            {/* terminal title bar */}
            <div className="flex items-center justify-between border-b border-[var(--x-border-bright)] px-3 py-1.5 bg-black/60 text-[9.5px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-muted)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[var(--x-negative)] rounded-full" />
                <span className="w-2 h-2 bg-[var(--x-signal)] rounded-full" />
                <span className="w-2 h-2 bg-[var(--x-positive)] rounded-full" />
                <span className="ml-3">x402 · live</span>
              </div>
              <span className="text-[var(--x-text-subtle)]">~/agent</span>
            </div>

            <div className="p-5 font-mono text-[12px] leading-[1.85] tabular-nums">
              {LINES.map((line, i) => {
                const promptColor =
                  line.tone === "cyan"
                    ? "text-[var(--x-accent)]"
                    : line.tone === "amber"
                      ? "text-[var(--x-signal)]"
                      : line.tone === "positive"
                        ? "text-[var(--x-positive)]"
                        : "text-[var(--x-text-subtle)]";

                const textColor =
                  line.tone === "cyan"
                    ? "text-[var(--x-accent)]"
                    : line.tone === "amber"
                      ? "text-[var(--x-signal)]"
                      : line.tone === "positive"
                        ? "text-[var(--x-positive)]"
                        : "text-[var(--x-text-muted)]";

                return (
                  <div key={i} className="flex items-baseline gap-2">
                    <span
                      className={`${promptColor} w-4 flex-none text-right`}
                    >
                      {line.prompt}
                    </span>
                    <span className={textColor}>{line.text}</span>
                  </div>
                );
              })}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-[var(--x-text-subtle)] w-4 flex-none text-right">
                  $
                </span>
                <span className="text-[var(--x-text-muted)]">_</span>
                <span className="inline-block w-2 h-3.5 bg-[var(--x-accent)] hud-blink ml-0.5" />
              </div>
            </div>

            <div className="border-t border-[var(--x-border-bright)] px-3 py-1.5 flex items-center justify-between text-[9.5px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)] bg-black/60">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-positive)] diode" />
                <span>5 hops · 0 errors</span>
              </div>
              <span className="tnum text-[var(--x-accent)]">2.81 s</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
