import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "x402.demo — per-call settlement over plain HTTP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "70px",
          background: "#0a0d14",
          color: "#e4e4e7",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 25% 0%, rgba(125,211,252,0.18), transparent 55%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 22,
            fontFamily: "monospace",
            color: "#e4e4e7",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "9999px",
              background: "#38bdf8",
              boxShadow: "0 0 16px rgba(56,189,248,0.7)",
            }}
          />
          <div>x402.demo</div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(228,228,231,0.55)",
              borderLeft: "1px solid rgba(228,228,231,0.2)",
              paddingLeft: "12px",
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            testnet
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            marginBottom: "auto",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 26,
              color: "rgba(228,228,231,0.65)",
              fontFamily: "monospace",
              letterSpacing: 5,
              textTransform: "uppercase",
              marginBottom: 30,
            }}
          >
            HTTP 402 · EIP-3009 · USDC · BASE-SEPOLIA
          </div>

          <div
            style={{
              fontSize: 96,
              lineHeight: 0.95,
              letterSpacing: -3,
              fontFamily: "serif",
              maxWidth: "1050px",
              display: "flex",
              flexDirection: "column",
              backgroundImage:
                "linear-gradient(180deg, #f4f4f5 0%, #d4d4d8 40%, #a1a1aa 75%, #d4d4d8 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            <span>Per-call settlement</span>
            <span style={{ fontStyle: "italic" }}>over plain HTTP.</span>
          </div>

          <div
            style={{
              fontSize: 22,
              lineHeight: 1.4,
              color: "rgba(228,228,231,0.7)",
              maxWidth: "900px",
              marginTop: 36,
              fontFamily: "monospace",
            }}
          >
            Buyer hits 402. Signs an EIP-3009 USDC authorization. Facilitator
            settles on-chain. ~3 seconds, fractions of a cent, no card.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 18,
            fontFamily: "monospace",
            color: "rgba(228,228,231,0.6)",
            zIndex: 1,
          }}
        >
          <div>x402-ai-agent-zeta.vercel.app</div>
          <div>by Michael Stanat</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
