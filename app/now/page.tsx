import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { NowPageView } from "@/components/now-section";

export const metadata: Metadata = createPageMetadata({
  title: "Now — Projects in Progress | Alisina Sarwari",
  description: "A source-reviewed snapshot of evolving web and mobile projects, upcoming verification needs and engineering topics. Not a live activity feed.",
  pathname: "/now",
});

export default function NowPage() { return <NowPageView/>; }
