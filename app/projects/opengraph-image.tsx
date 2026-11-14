import { renderOgCard, ogContentType } from "@/lib/og-card";
export const size = { width: 1200, height: 630 };
export const contentType = ogContentType;
export const alt = "Software projects and engineering case studies — Alisina Sarwari";
export default function Image() { return renderOgCard({ eyebrow: "SELECTED WORK", heading: "Projects & case studies.", description: "Product thinking, technical decisions and source-reviewed work." }); }
