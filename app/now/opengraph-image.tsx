import { renderOgCard, ogContentType } from "@/lib/og-card";
export const size = { width:1200, height:630 };
export const contentType = ogContentType;
export const alt = "Now — evolving portfolio projects and engineering topics";
export default function Image() {
  return renderOgCard({
    eyebrow: "NOW / SOURCE REVIEWED",
    heading: "Projects in progress.",
    description: "Evolving software products, source-backed progress and next verification checks.",
  });
}
