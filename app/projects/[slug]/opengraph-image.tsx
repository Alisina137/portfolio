import { notFound } from "next/navigation";
import { getCaseStudy, getPublicProject, getPublishedProjects } from "@/lib/content";
import { renderOgCard, ogContentType } from "@/lib/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = ogContentType;
export const alt = "An engineering case study by Alisina Sarwari";
export const dynamicParams = false;
export function generateStaticParams() { return getPublishedProjects().filter(p => Boolean(getCaseStudy(p.slug))).map(p => ({ slug: p.slug })); }
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getPublicProject(slug);
  if (!project || !getCaseStudy(slug)) notFound();
  return renderOgCard({ eyebrow: project.eyebrow, heading: project.title, description: project.oneLiner, label: "CASE STUDY / ALISINA SARWARI" });
}
