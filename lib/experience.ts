import experience from "@/content/experience.json";
import { getCaseStudy, getPublishedProjects, type CaseStudy, type Project } from "@/lib/content";
import { getTranslatedCase, getTranslatedProject } from "@/lib/i18n";

export type ExperienceLocale = "en" | "fa" | "ps";
export type IndependentProject = {
  number: string;
  project: Project;
  caseStudy: CaseStudy;
};
export type PublishedRole = {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string | null;
  responsibilities: string[];
  technologies: string[];
  ownerApproved: true;
};

/**
 * Source-backed independent projects, deliberately not presented as employment.
 * Ordering is editorial, NOT chronological: no invented start/end dates or clients.
 */
export function getIndependentWork(locale: ExperienceLocale = "en", variant: "home" | "about" = "about"): IndependentProject[] {
  const projectMap = new Map(getPublishedProjects().map(project => [project.slug, project]));
  const selected = variant === "home" ? experience.independentWork.featured : experience.independentWork.selected;
  const seen = new Set<string>();
  const entries: IndependentProject[] = [];
  for (const slug of selected) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    const raw = projectMap.get(slug);
    const study = getCaseStudy(slug);
    if (!raw || !study) continue;
    entries.push({
      number: String(entries.length + 1).padStart(2, "0"),
      project: locale === "en" ? raw : getTranslatedProject(locale, raw),
      caseStudy: locale === "en" ? study : getTranslatedCase(locale, study),
    });
  }
  return entries;
}

/**
 * Future employer roles must be entered explicitly and approved by the owner.
 * Fail closed for missing identity, malformed dates, or missing work evidence.
 */
export function getApprovedEmployment(): PublishedRole[] {
  const rows = (experience as unknown as { formalRoles?: unknown }).formalRoles;
  if (!Array.isArray(rows)) return [];
  const validDate = (value: unknown) => typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
  return rows.filter((row: unknown): row is PublishedRole => {
    if (!row || typeof row !== "object") return false;
    const role = row as Partial<PublishedRole>;
    return role.ownerApproved === true &&
      typeof role.id === "string" && role.id.trim().length > 0 &&
      typeof role.title === "string" && role.title.trim().length > 2 &&
      typeof role.organization === "string" && role.organization.trim().length > 2 &&
      validDate(role.startDate) &&
      (role.endDate === null || (validDate(role.endDate) && role.endDate! >= role.startDate!)) &&
      Array.isArray(role.responsibilities) && role.responsibilities.length > 0 &&
      role.responsibilities.every(item => typeof item === "string" && item.trim().length >= 8) &&
      Array.isArray(role.technologies) && role.technologies.every(item => typeof item === "string" && item.trim().length > 0);
  }).sort((a,b) => b.startDate.localeCompare(a.startDate));
}
