import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { TestimonialsPageView } from "@/components/testimonials-section";
export const metadata: Metadata = createPageMetadata({
  title: "Testimonials & Recommendations | Alisina Sarwari",
  description: "Genuine professional recommendations, shown only with reviewed context, identity checks and written permission. No fabricated endorsements.",
  pathname: "/testimonials",
});
export default function TestimonialsPage(){return <TestimonialsPageView/>;}
