import registry from "@/content/projects.json";
import caseRecords from "@/content/case-studies.json";
import profile from "@/content/profile.json";
import { relatedProjects } from "@/lib/catalog";
import { isApprovedCaseMedia } from "@/lib/media-core.mjs";

export type ProjectStatus = "concept" | "prototype" | "in_development" | "pilot" | "released" | "maintained" | "retired";
export type PublicationStatus = "draft" | "in_review" | "published" | "archived";
export type Project = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  category: string;
  oneLiner: string;
  developmentStatus: ProjectStatus;
  publicationStatus: PublicationStatus;
  contentApproval: "owner_pending" | "owner_approved";
  repoUrl?: string;
  repoUrlVerified: boolean;
  featuredOrder?: number;
  projectDate?: string;
  technologies: string[];
  ownerRole: string;
  sourceCheckedAt: string;
  motif: string;
  coverTitle: string;
};
export type StudyBlock = { title: string; description: string; screenshot?: { src: string; alt: string; caption: string; approved: true } };
export type MediaGroup = "Mobile app" | "Web/admin" | "Workflow/architecture";
export type MediaDevice = "mobile" | "desktop" | "tablet";
export type CaseMedia =
  | { kind?: "image"; src: string; alt: string; caption: string; group: MediaGroup; device?: MediaDevice; approved: true }
  | { kind: "video"; src: string; poster: string; captions: string; alt: string; caption: string; group: MediaGroup; device?: MediaDevice; approved: true };
export type CaseStudy = {
  slug: string;
  audience: string;
  productType: string;
  platforms: string[];
  problem: string[];
  features: StudyBlock[];
  technicalNotes: StudyBlock[];
  tradeoffs: StudyBlock[];
  currentState: string;
  nextSteps: string[];
  media: CaseMedia[];
  sourceEvidence: string;
};

export const siteProfile = profile;

/** Central public projection: do not pass raw editorial drafts to client components. */
export function getPublishedProjects(): Project[] {
  return (registry as Project[]).filter(p => p.publicationStatus === "published" && p.repoUrlVerified);
}
export function getFeaturedProjects(): Project[] {
  return getPublishedProjects().filter(p => p.featuredOrder != null)
    .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999) || a.title.localeCompare(b.title)).slice(0, 6);
}
export function getPublicProject(slug: string): Project | undefined {
  return getPublishedProjects().find(p => p.slug === slug);
}
export function getCaseStudy(slug: string): CaseStudy | undefined {
  if (!getPublicProject(slug)) return undefined;
  const record = (caseRecords as CaseStudy[]).find(c => c.slug === slug);
  if (!record) return undefined;
  return { ...record, media: record.media.filter(m => isApprovedCaseMedia(m, slug)) };
}
export function getRelatedProjects(project: Project): Project[] {
  return relatedProjects(project, getPublishedProjects());
}
export { getDevelopmentLabel } from "@/lib/status";
