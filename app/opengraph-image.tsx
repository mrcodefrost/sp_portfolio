import { ImageResponse } from "next/og";

export const alt = "Daksh Nauni - Full-Stack & Mobile Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#030014",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid rgba(112, 66, 248, 0.55)",
            borderRadius: "999px",
            padding: "10px 22px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              backgroundColor: "#4ade80",
            }}
          />
          <span style={{ color: "#e5e7eb", fontSize: "22px" }}>
            Available for remote work
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "96px",
            fontWeight: 700,
            backgroundImage: "linear-gradient(90deg, #a855f7, #06b6d4)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Daksh Nauni
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "40px",
            color: "#d1d5db",
            marginTop: "18px",
          }}
        >
          Full-Stack &amp; Mobile Engineer
        </div>
      </div>
    ),
    { ...size }
  );
}
