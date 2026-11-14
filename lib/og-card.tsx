import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Text-only open-graph graphics: these deliberately are not fabricated product screenshots. */
export function renderOgCard({ eyebrow, heading, description, label = "SOFTWARE ENGINEER / PRODUCT BUILDER" }: {
  eyebrow: string;
  heading: string;
  description: string;
  label?: string;
}) {
  return new ImageResponse(
    <div style={{ display: "flex", height: "100%", width: "100%", background: "#0B111B", color: "#F1F5F9", fontFamily: "Arial, sans-serif", padding: 66, flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: 22, letterSpacing: 2 }}>
        <span style={{ color: "#83E3D0" }}>AS / ALISINA</span><span style={{ color: "#A9B9C9" }}>PORTFOLIO · 2026</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 920 }}>
        <div style={{ color: "#83E3D0", fontSize: 19, letterSpacing: 3, fontWeight: 700 }}>{eyebrow.toUpperCase()}</div>
        <div style={{ fontSize: heading.length > 27 ? 62 : 86, fontWeight: 800, letterSpacing: -3, lineHeight: 1.08 }}>{heading}</div>
        <div style={{ color: "#A9B9C9", fontSize: 29, lineHeight: 1.4 }}>{description}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #2B3B4F", paddingTop: 24, color: "#A9B9C9", fontSize: 16, letterSpacing: 1 }}><span>{label}</span><span style={{ color: "#83E3D0" }}>THINK → BUILD → IMPROVE</span></div>
    </div>,
    ogSize,
  );
}
