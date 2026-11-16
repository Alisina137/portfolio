import { renderOgCard, ogContentType } from "@/lib/og-card";
export const size={width:1200,height:630};
export const contentType=ogContentType;
export const alt="Verified public GitHub repositories — Alisina Sarwari";
export default function Image(){return renderOgCard({
  eyebrow:"GITHUB / SOURCE REVIEWED",
  heading:"Code behind the projects.",
  description:"Verified public sources, case studies and engineering context.",
});}
