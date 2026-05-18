import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "x402.demo — payment rails for software, not for humans with cards";
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
          background: "#fbfaf7",
          color: "#0a0e1a",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 22,
            fontFamily: "monospace",
            color: "#0a0e1a",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "9999px",
              background: "#ff6b1a",
            }}
          />
          <div>x402.demo</div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(10,14,26,0.55)",
              borderLeft: "1px solid rgba(10,14,26,0.2)",
              paddingLeft: "12px",
              letterSpacing: 4,
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
          }}
        >
          <div
            style={{
              fontSize: 30,
              color: "rgba(10,14,26,0.55)",
              fontFamily: "monospace",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            x402 protocol · EIP-3009 · Base Sepolia
          </div>

          <div
            style={{
              fontSize: 88,
              lineHeight: 0.95,
              letterSpacing: -2,
              fontFamily: "serif",
              maxWidth: "1000px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Payment rails for</span>
            <span>
              <span style={{ fontStyle: "italic", color: "#ff6b1a" }}>
                software
              </span>
              , not for humans
            </span>
            <span>with cards.</span>
          </div>

          <div
            style={{
              fontSize: 26,
              lineHeight: 1.35,
              color: "rgba(10,14,26,0.7)",
              maxWidth: "900px",
              marginTop: 30,
            }}
          >
            A working portfolio prototype where an AI agent pays a research
            API in stablecoin per call, in seconds, for fractions of a cent.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 18,
            fontFamily: "monospace",
            color: "rgba(10,14,26,0.65)",
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
