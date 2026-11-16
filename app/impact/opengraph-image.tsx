import { renderOgCard, ogContentType } from "@/lib/og-card";
export const size={width:1200,height:630};
export const contentType=ogContentType;
export const alt="Engineering achievements and evidence — Alisina Sarwari";
export default function Image(){return renderOgCard({
 eyebrow:"EVIDENCE / IMPACT",heading:"Proof over promises.",
 description:"Documented project scope, repository links and honest engineering outcomes.",
});}
