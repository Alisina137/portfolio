import { renderOgCard, ogContentType } from "@/lib/og-card";
export const size = { width: 1200, height: 630 };
export const contentType = ogContentType;
export const alt = "Alisina Sarwari — software engineer and product builder portfolio";
export default function Image() { return renderOgCard({ eyebrow: "PERSONAL PORTFOLIO", heading: "Alisina Sarwari.", description: "Useful web and mobile products, built with intention." }); }
