import records from "@/content/qualifications.json";
import { getPublishedProjects, type Project } from "@/lib/content";
import { getPublicIdentity } from "@/lib/public-identity";
import { getTranslatedProject } from "@/lib/i18n";
import { selectPublicEducation, selectPublicCertificates, selectPublicTraining } from "@/lib/qualifications-core.mjs";

export type EducationRecord = {
  id: string; title: string; institution: string; field?: string;
  description?: string; startYear?: number; endYear?: number;
  academicProjects?: string[]; ownerApproved: true; documentReviewed: true;
};
export type CertificationRecord = {
  id: string; title: string; issuer: string; description?: string;
  issuedOn?: string; credentialUrl?: string; ownerApproved: true; documentReviewed: true;
};
export type TrainingRecord = {
  id: string; title: string; provider: string; description?: string;
  completedOn?: string; ownerApproved: true; documentReviewed: true;
};
export type QualificationLocale = "en" | "fa" | "ps";

/** One review gate for every credential item. Nothing pending is projected to clients. */
export function getPublicQualifications() {
  const catalog = records as unknown as Record<string, unknown>;
  const education = selectPublicEducation(catalog) as EducationRecord[];
  const certifications = selectPublicCertificates(catalog) as CertificationRecord[];
  const training = selectPublicTraining(catalog) as TrainingRecord[];

  // Reuse the existing owner-approved legacy profile field if this is all the
  // education information the owner has authorized. Never print raw profile.education.
  const legacyEducation = education.length ? null : getPublicIdentity().education;
  return { education, certifications, training, legacyEducation };
}

/** Independent app work is an example of learning-in-practice, NOT university coursework. */
export function getIndependentLearningProjects(locale: QualificationLocale = "en"): Project[] {
  const projectMap = new Map(getPublishedProjects().map(p => [p.slug, p]));
  const slugs = records.independentLearningProjects as string[];
  return [...new Set(slugs)].map(slug => projectMap.get(slug))
    .filter((p): p is Project => Boolean(p))
    .map(p => locale === "en" ? p : getTranslatedProject(locale, p));
}

/** University-attributed projects are only linked if explicitly approved in the reviewed degree record. */
export function getReviewedAcademicProjects(entry: EducationRecord, locale: QualificationLocale = "en") {
  const map = new Map(getPublishedProjects().map(p => [p.slug, p]));
  return [...new Set(entry.academicProjects ?? [])].map(slug => map.get(slug))
    .filter((p): p is Project => Boolean(p))
    .map(p => locale === "en" ? p : getTranslatedProject(locale, p));
}
