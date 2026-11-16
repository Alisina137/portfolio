import source from "@/content/testimonials.json";
import { approvedTestimonials, type ApprovedTestimonial } from "@/lib/testimonials-core.mjs";
import { getPublicProject } from "@/lib/content";
import { getTranslatedProject } from "@/lib/i18n";

export type TestimonialLocale = "en" | "fa" | "ps";
export type PublicTestimonial = ApprovedTestimonial & { projectTitle?: string };

/** Only review-gated public fields reach React; drafts and private evidence stay out. */
export function getPublicTestimonials(locale: TestimonialLocale = "en"): PublicTestimonial[] {
  return approvedTestimonials(source).flatMap(record => {
    if (!record.projectSlug) return [{ ...record }];
    const project = getPublicProject(record.projectSlug);
    if (!project) return [];
    return [{ ...record, projectTitle: locale === "en" ? project.title : getTranslatedProject(locale, project).title }];
  });
}
