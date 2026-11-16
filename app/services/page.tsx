import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ServicesPageView } from "@/components/services-section";

export const metadata: Metadata = createPageMetadata({
  title: "Services & Capabilities | Alisina Sarwari",
  description: "Explore evidence-linked web, mobile, backend, database, full-stack and product improvement capabilities through real software case studies.",
  pathname: "/services",
});

export default function ServicesPage() {
  return <ServicesPageView />;
}
