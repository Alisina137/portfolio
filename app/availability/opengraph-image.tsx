import { renderOgCard, ogContentType } from "@/lib/og-card";
export const size={width:1200,height:630};
export const contentType=ogContentType;
export const alt="Engineering roles, project experience and professional availability — Alisina Sarwari";
export default function Image(){return renderOgCard({
 eyebrow:"OPPORTUNITIES / ENGINEERING",heading:"Let's find the right fit.",
 description:"A source-backed engineering portfolio, with availability stated only when owner-approved."
});}
