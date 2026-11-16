import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ImpactPageView } from "@/components/impact-section";
export const metadata:Metadata=createPageMetadata({
 title:"Achievements & Engineering Impact | Alisina Sarwari",
 description:"Explore verifiable project documentation, public repositories, engineering examples and the difference between evidence and measured outcomes.",
 pathname:"/impact",
});
export default function ImpactPage(){return <ImpactPageView/>;}
