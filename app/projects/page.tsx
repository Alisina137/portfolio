import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { ProjectsExplorer } from "@/components/projects-explorer";
import { getPublishedProjects } from "@/lib/content";

export const metadata: Metadata = createPageMetadata({
  title: "Projects | Alisina Sarwari",
  description: "Explore source-reviewed software projects in education, mobile, marketplaces and operational platforms, with detailed engineering case studies.",
  pathname: "/projects",
});

export default function ProjectsPage() {
  const projects = getPublishedProjects();
  return <main id="main" tabIndex={-1}>
    <section className="projects-page section-pad" aria-labelledby="projects-heading">
      <div className="container">
        <div className="page-eyebrow"><span>01 /</span> SELECTED WORK & EXPERIMENTS</div>
        <div className="projects-intro"><div><h1 id="projects-heading">Ideas built<br/><em>into systems.</em></h1><p>Explore the products, engineering decisions, and ongoing experiments behind the work. A published case study doesn’t necessarily mean the product is publicly launched.</p></div><div className="projects-intro-aside"><strong>{String(projects.length).padStart(2, "0")}</strong><span>PUBLIC CASE STUDIES<br/>SOURCE-REVIEWED</span></div></div>
        <Suspense fallback={<div className="catalog-loading" role="status">Preparing project filters…</div>}><ProjectsExplorer projects={projects} /></Suspense>
      </div>
    </section>
  </main>;
}
