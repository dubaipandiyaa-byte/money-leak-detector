import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social-share preview card — reuses the same brand mark and gradient language as the FinalCTA section. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #14181d 0%, #1b2229 55%, #0f2e24 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 44 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#1f252c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3.5c2.8 3.4 5.5 6.4 5.5 9.6a5.5 5.5 0 1 1-11 0c0-3.2 2.7-6.2 5.5-9.6Z"
                fill="#b6f04a"
              />
              <circle cx="12" cy="13.4" r="2.3" fill="#14181d" opacity="0.85" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#fbfcfd" }}>
            Money Leak Detector
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#fbfcfd",
            maxWidth: 920,
          }}
        >
          Stop losing money you never meant to spend.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 26,
            color: "#b6f04a",
            fontWeight: 600,
          }}
        >
          AI Financial Guardian · by DONRITHIK LABS
        </div>
      </div>
    ),
    { ...size }
  );
}
