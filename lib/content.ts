import publicProjects from "@/content/projects.json";
import profile from "@/content/profile.json";

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
  repoUrl: string;
  repoUrlVerified: boolean;
  featuredOrder?: number;
  technologies: string[];
  ownerRole: string;
  sourceCheckedAt: string;
  motif: string;
  coverTitle: string;
};

export const siteProfile = profile;

// Every consumer must use this projection instead of importing the raw registry.
// Do not expose draft fields in client bundles, generated routes, or public search.
export function getFeaturedProjects(): Project[] {
  const available = (publicProjects as Project[]).filter(
    (project) => project.publicationStatus === "published" &&
      project.featuredOrder != null &&
      project.repoUrlVerified,
  );
  return available.sort((a, b) =>
    (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER),
  ).slice(0, 6);
}

export function getDevelopmentLabel(status: ProjectStatus): string {
  switch (status) {
    case "concept": return "Concept";
    case "prototype": return "Prototype";
    case "in_development": return "In development";
    case "pilot": return "Pilot / beta";
    case "released": return "Released";
    case "maintained": return "Maintained";
    case "retired": return "Retired";
  }
}
