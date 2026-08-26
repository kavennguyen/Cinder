import { ImageResponse } from "next/og";

/**
 * Social card for link previews (Slack, LinkedIn, iMessage, X).
 *
 * Next.js picks this file up by convention and emits both og:image and
 * twitter:image, so no metadata wiring is needed. Kept to plain shapes and
 * system text: ImageResponse renders via Satori, which cannot use the site's
 * Palatino without shipping a font file here.
 */
export const alt = "Cinder — AI visibility tracking for Canadian brands";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#000000",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              backgroundColor: "#FF6E00",
              display: "flex",
            }}
          />
          <div style={{ color: "#ffffff", fontSize: "34px", fontWeight: 700 }}>
            Cinder
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: "82px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Be the answer AI gives.
          </div>
          <div
            style={{
              color: "#FF6E00",
              fontSize: "30px",
              marginTop: "26px",
              display: "flex",
            }}
          >
            AI visibility tracking for Canadian brands
          </div>
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "24px",
            display: "flex",
          }}
        >
          ChatGPT · Perplexity · Gemini
        </div>
      </div>
    ),
    size,
  );
}
