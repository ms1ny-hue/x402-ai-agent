"use client";

/**
 * Decorative oscilloscope waveform for the hero. Generates a stable
 * pseudo-noise path so it is consistent between SSR and client. Pure
 * SVG, no continuous animation — relies on a single fade-in opacity.
 */

interface WaveformProps {
  className?: string;
  width?: number;
  height?: number;
  /** Number of sample points along the X axis */
  samples?: number;
  /** Amplitude multiplier (0..1) */
  amplitude?: number;
  /** Stable seed for the noise */
  seed?: number;
  /** Stroke colors for foreground and shadow line */
  stroke?: string;
  strokeShadow?: string;
}

// Tiny seeded LCG so the same `seed` yields the same path every render.
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generatePath(
  width: number,
  height: number,
  samples: number,
  amplitude: number,
  seed: number,
): string {
  const rng = mulberry32(seed);
  const mid = height / 2;
  const amp = (height / 2) * amplitude;
  const step = width / (samples - 1);

  // Combine three sine harmonics with seeded noise for an organic waveform
  const baseFreq1 = 0.025 + rng() * 0.01;
  const baseFreq2 = 0.07 + rng() * 0.02;
  const baseFreq3 = 0.15 + rng() * 0.05;
  const phase1 = rng() * Math.PI * 2;
  const phase2 = rng() * Math.PI * 2;
  const phase3 = rng() * Math.PI * 2;

  const points: string[] = [];
  for (let i = 0; i < samples; i++) {
    const x = i * step;
    const noise = (rng() - 0.5) * 0.15;
    const y =
      mid +
      amp *
        (Math.sin(i * baseFreq1 + phase1) * 0.6 +
          Math.sin(i * baseFreq2 + phase2) * 0.3 +
          Math.sin(i * baseFreq3 + phase3) * 0.1 +
          noise);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${points.join(" L ")}`;
}

export function Waveform({
  className,
  width = 1200,
  height = 200,
  samples = 240,
  amplitude = 0.7,
  seed = 42,
  stroke = "rgba(125, 211, 252, 0.55)",
  strokeShadow = "rgba(125, 211, 252, 0.15)",
}: WaveformProps) {
  const path = generatePath(width, height, samples, amplitude, seed);
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      {/* baseline */}
      <line
        x1={0}
        x2={width}
        y1={height / 2}
        y2={height / 2}
        stroke="rgba(125, 211, 252, 0.1)"
        strokeDasharray="3 6"
        strokeWidth={0.5}
      />
      {/* shadow trace */}
      <path
        d={path}
        stroke={strokeShadow}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.5}
      />
      {/* main trace */}
      <path
        d={path}
        stroke={stroke}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Tiny sparkline used inside Stat cells.
 */
export function Sparkline({
  values,
  width = 80,
  height = 18,
  stroke = "currentColor",
  showArea = true,
  className,
}: {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  showArea?: boolean;
  className?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => `${(i * step).toFixed(1)},${(
      height -
      ((v - min) / range) * height * 0.85 -
      height * 0.08
    ).toFixed(1)}`)
    .join(" ");
  const linePath = `M ${points}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      {showArea && (
        <path
          d={areaPath}
          fill={stroke}
          opacity={0.15}
          stroke="none"
        />
      )}
      <path
        d={linePath}
        stroke={stroke}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={width}
        cy={
          height -
          ((values[values.length - 1] - min) / range) * height * 0.85 -
          height * 0.08
        }
        r={1.6}
        fill={stroke}
      />
    </svg>
  );
}
