import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { AvailabilityPageView } from "@/components/availability-section";

export const metadata: Metadata=createPageMetadata({
  title:"Professional Availability & Opportunities | Alisina Sarwari",
  description:"Explore engineering opportunity fit, documented project work and approved professional availability information. Contact options are shown only when approved.",
  pathname:"/availability"
});
export default function AvailabilityPage(){return <AvailabilityPageView/>;}
