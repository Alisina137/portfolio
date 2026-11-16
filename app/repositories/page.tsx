import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { RepositoriesPageView } from "@/components/repositories-section";

export const metadata: Metadata=createPageMetadata({
  title:"GitHub Repositories — Alisina Sarwari | Project Sources",
  description:"Browse verified public repositories and the case studies behind Alisina Sarwari's software projects. A dated link directory, not a live activity feed.",
  pathname:"/repositories",
});
export default function RepositoriesPage(){return <RepositoriesPageView/>;}
