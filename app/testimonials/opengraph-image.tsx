import { renderOgCard, ogContentType } from "@/lib/og-card";
export const size={width:1200,height:630};
export const contentType=ogContentType;
export const alt="Verified testimonials and professional recommendations — Alisina Sarwari";
export default function Image(){return renderOgCard({
  eyebrow:"PEOPLE / PERSPECTIVES",heading:"Trust should be earned.",
  description:"Independent perspectives, shared only with explicit written permission.",
});}
