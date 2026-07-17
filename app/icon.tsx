import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Browser-tab favicon — the same droplet-in-graphite glyph as the in-app Logo. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14181d",
          borderRadius: 18,
        }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3.5c2.8 3.4 5.5 6.4 5.5 9.6a5.5 5.5 0 1 1-11 0c0-3.2 2.7-6.2 5.5-9.6Z"
            fill="#b6f04a"
          />
          <circle cx="12" cy="13.4" r="2.3" fill="#14181d" opacity="0.85" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
