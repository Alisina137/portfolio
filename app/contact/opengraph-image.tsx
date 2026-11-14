import { renderOgCard, ogContentType } from "@/lib/og-card";
export const size = { width: 1200, height: 630 };
export const contentType = ogContentType;
export const alt = "Contact Alisina Sarwari — professional links and projects";
export default function Image() { return renderOgCard({ eyebrow: "CONTACT", heading: "Let’s connect.", description: "Engineering, collaboration, and useful product ideas." }); }
