import { renderOgCard, ogContentType } from "@/lib/og-card";
export const size = { width:1200, height:630 };
export const contentType = ogContentType;
export const alt = "Software services and engineering capabilities — Alisina Sarwari";
export default function Image() {
  return renderOgCard({
    eyebrow: "SERVICES / CAPABILITIES",
    heading: "What I can help build.",
    description: "Web and mobile products, APIs, data and workflow improvements.",
  });
}
