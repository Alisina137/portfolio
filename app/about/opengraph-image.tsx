import { renderOgCard, ogContentType } from "@/lib/og-card";
export const size = { width: 1200, height: 630 };
export const contentType = ogContentType;
export const alt = "About Alisina Sarwari — engineering approach and skills";
export default function Image() { return renderOgCard({ eyebrow: "ABOUT", heading: "A product-minded engineer.", description: "The approach and technologies behind the work." }); }
