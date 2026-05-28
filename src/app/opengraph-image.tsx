import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Agentic Payment Rails Prototype: x402 Protocol";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CYAN = "#7dd3fc";
const CYAN_BRIGHT = "#22d3ee";
const AMBER = "#fcd34d";
const TEXT = "#e6e8ed";
const MUTED = "rgba(230, 232, 237, 0.55)";
const SUBTLE = "rgba(230, 232, 237, 0.35)";
const FAINT = "rgba(230, 232, 237, 0.15)";
const BG = "#0a0d12";
const BG_DEEP = "#06080b";
const BORDER = "#2b323e";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: BG,
          color: TEXT,
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* atmosphere */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 18% -10%, rgba(56,189,248,0.22), transparent 55%), radial-gradient(ellipse at 88% 110%, rgba(252,211,77,0.18), transparent 55%)",
          }}
        />

        {/* faint engineering grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(125,211,252,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(125,211,252,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* giant watermark numeral */}
        <div
          style={{
            position: "absolute",
            right: -40,
            top: 60,
            fontSize: 380,
            fontStyle: "italic",
            color: BORDER,
            opacity: 0.18,
            letterSpacing: -16,
            lineHeight: 1,
            fontFamily: "serif",
          }}
        >
          x402
        </div>

        {/* top session bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 60px",
            background: BG_DEEP,
            borderBottom: `1px solid ${BORDER}`,
            fontFamily: "monospace",
            fontSize: 16,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: MUTED,
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: CYAN_BRIGHT,
                boxShadow: `0 0 12px ${CYAN_BRIGHT}`,
              }}
            />
            <span style={{ color: TEXT }}>x402 · protocol surface</span>
            <span style={{ color: FAINT, margin: "0 8px" }}>/</span>
            <span style={{ color: CYAN }}>base-sepolia</span>
            <span style={{ color: FAINT, margin: "0 8px" }}>·</span>
            <span style={{ color: AMBER }}>USDC · 6 dp</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid ${BORDER}`,
              padding: "4px 12px",
              color: AMBER,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 9999,
                background: AMBER,
              }}
            />
            testnet
          </div>
        </div>

        {/* body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "56px 60px",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          {/* schema chips */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 40,
              fontFamily: "monospace",
              fontSize: 14,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {[
              { text: "http 402", tone: "cyan" },
              { text: "eip-3009", tone: "muted" },
              { text: "usdc v2", tone: "muted" },
              { text: "base · 84532", tone: "amber" },
            ].map((c) => {
              const color =
                c.tone === "cyan"
                  ? CYAN
                  : c.tone === "amber"
                    ? AMBER
                    : MUTED;
              return (
                <div
                  key={c.text}
                  style={{
                    border: `1px solid ${c.tone === "cyan" ? "rgba(56,189,248,0.45)" : c.tone === "amber" ? "rgba(252,211,77,0.45)" : BORDER}`,
                    padding: "5px 12px",
                    color,
                    background: "rgba(13,17,23,0.6)",
                  }}
                >
                  {c.text}
                </div>
              );
            })}
          </div>

          {/* headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 124,
              lineHeight: 0.92,
              letterSpacing: -5,
              fontFamily: "serif",
            }}
          >
            <span
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #ffffff 0%, #e6e8ed 28%, #a9b0bc 62%, #d4d8df 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Agentic
            </span>
            <span
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #fde68a 0%, #fbbf24 45%, #d97706 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              payment rails.
            </span>
            <span
              style={{
                fontSize: 56,
                marginTop: 16,
                fontStyle: "italic",
                color: "rgba(230,232,237,0.7)",
                letterSpacing: -2,
              }}
            >
              Stablecoin,{" "}
              <span
                style={{
                  fontStyle: "normal",
                  backgroundImage:
                    "linear-gradient(180deg, #ffffff 0%, #d4d8df 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                per call.
              </span>
            </span>
          </div>

          {/* stat strip */}
          <div
            style={{
              display: "flex",
              gap: 0,
              marginTop: 48,
              border: `1px solid ${BORDER}`,
              fontFamily: "monospace",
            }}
          >
            {[
              { label: "end-to-end", value: "~3s", tone: "cyan" },
              { label: "cost / call", value: "$0.004", tone: "amber" },
              { label: "buyer gas", value: "$0.00", tone: "positive" },
              { label: "min charge", value: "$0.0001", tone: "amber" },
            ].map((s, i) => {
              const color =
                s.tone === "cyan"
                  ? CYAN
                  : s.tone === "amber"
                    ? AMBER
                    : "#34d399";
              return (
                <div
                  key={s.label}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px 22px",
                    background: "rgba(17,21,28,0.85)",
                    borderRight: i < 3 ? `1px solid ${BORDER}` : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 4,
                      textTransform: "uppercase",
                      color: SUBTLE,
                      marginBottom: 6,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "serif",
                      fontSize: 36,
                      color,
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* bottom strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 60px",
            background: BG_DEEP,
            borderTop: `1px solid ${BORDER}`,
            fontFamily: "monospace",
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: SUBTLE,
            zIndex: 2,
          }}
        >
          <span>x402-ai-agent-zeta.vercel.app</span>
          <span>by Michael Stanat · portfolio prototype</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
