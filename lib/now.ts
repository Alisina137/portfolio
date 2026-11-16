import records from "@/content/now.json";
import faFocus from "@/content/locales/fa-now.json";
import psFocus from "@/content/locales/ps-now.json";
import { getCaseStudy, getPublishedProjects, getDevelopmentLabel, type Project } from "@/lib/content";
import { getTranslatedUi, getTranslatedCase, getTranslatedProject } from "@/lib/i18n";

export type NowLocale = "en" | "fa" | "ps";
export type NowProject = {
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  status: string;
  sourceReviewedAt: string;
  nextReview: string | null;
};
export type NowFocus = {
  id: string; title: string; description: string; technologies: string[];
  projects: { slug: string; title: string }[];
};
type LearningGoal = { id: string; title: string; note: string; ownerApproved: true };
const ongoing = new Set<Project["developmentStatus"]>(["concept", "prototype", "in_development", "pilot"]);

/**
 * This is a published-source snapshot, NOT a realtime GitHub activity feed.
 * Nothing here implies a current sprint, measured completion %, or recent commit.
 */
export function getNowProjects(locale: NowLocale = "en"): NowProject[] {
  return getPublishedProjects()
    .filter(project => ongoing.has(project.developmentStatus) && Boolean(getCaseStudy(project.slug)))
    .sort((a,b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999))
    .map(project => {
      const caseStudy = getCaseStudy(project.slug)!;
      const localized = locale === "en" ? project : getTranslatedProject(locale,project);
      const translatedCase = locale === "en" ? caseStudy : getTranslatedCase(locale,caseStudy);
      const category = locale === "en" ? project.category : getTranslatedUi(locale)[project.category as "Education" | "Sports" | "Marketplace" | "Healthcare"] ?? project.category;
      const status = locale === "en" ? getDevelopmentLabel(project.developmentStatus) : getTranslatedUi(locale)[project.developmentStatus];
      return {
        slug:project.slug,title:localized.title,category,description:localized.oneLiner,
        technologies:project.technologies,status,sourceReviewedAt:project.sourceCheckedAt,
        nextReview:translatedCase.nextSteps[0] || null,
      };
    });
}

export function getFeaturedNowProjects(locale: NowLocale = "en"): NowProject[] {
  const bySlug=new Map(getNowProjects(locale).map(project => [project.slug,project]));
  return [...new Set(records.featuredProjects)]
    .map(slug => bySlug.get(slug)).filter((project):project is NowProject => Boolean(project));
}

export function getNowFocus(locale: NowLocale = "en"): NowFocus[] {
  const bySlug=new Map(getPublishedProjects().filter(project => ongoing.has(project.developmentStatus) && getCaseStudy(project.slug)).map(project => [project.slug,project]));
  const labels=locale === "fa" ? faFocus : psFocus;
  return records.focusAreas.map(item => {
    const projects=[...new Set(item.projectSlugs)]
      .map(slug => bySlug.get(slug)).filter((p):p is Project => Boolean(p));
    if(!projects.length) return null;
    const technologies=item.technologies.filter(t => projects.some(p => p.technologies.includes(t)));
    if(!technologies.length) return null;
    const translated=locale === "en" ? null : labels[item.id as keyof typeof labels];
    return {
      id:item.id,title:translated?.title ?? item.title,
      description:translated?.description ?? item.description,technologies,
      projects:projects.map(p => ({slug:p.slug,title:p.title})),
    };
  }).filter((item):item is NowFocus => item !== null);
}

export function getPublicLearningGoals(): LearningGoal[] {
  const values: unknown = records.learningGoals;
  if(!Array.isArray(values)) return [];
  return values.filter((item): item is LearningGoal =>
    item && typeof item === "object" &&
    item.ownerApproved === true && typeof item.id === "string" && /^[a-z0-9-]+$/.test(item.id) &&
    typeof item.title === "string" && item.title.trim().length >= 5 &&
    typeof item.note === "string" && item.note.trim().length >= 12
  );
}
