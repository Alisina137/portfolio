import catalog from "@/content/services.json";
import faServices from "@/content/locales/fa-services.json";
import psServices from "@/content/locales/ps-services.json";
import { getPublishedProjects, getCaseStudy, type Project } from "@/lib/content";
import { getTranslatedProject } from "@/lib/i18n";

export type ServiceLocale = "en" | "fa" | "ps";
export type ServiceCategory = "web" | "mobile" | "backend" | "data" | "fullstack" | "improvements";
export type Service = {
  id: ServiceCategory;
  category: ServiceCategory;
  title: string;
  summary: string;
  capabilities: string[];
  technologies: string[];
  examples: Pick<Project, "slug" | "title" | "technologies">[];
  featured: boolean;
};

/**
 * Describes areas practiced within source-reviewed projects, not client delivery,
 * formal employment, fixed-price offerings, production uptime, or skill ratings.
 */
export function getServices(locale: ServiceLocale = "en", variant: "preview" | "full" = "full"): Service[] {
  const source = catalog as unknown as Array<{
    id: ServiceCategory; category: ServiceCategory; title: string; summary: string;
    capabilities: string[]; technologies: string[]; projects: string[]; featured: boolean;
  }>;
  const translations = locale === "fa" ? faServices : psServices;
  const projects = new Map(getPublishedProjects().filter(p => Boolean(getCaseStudy(p.slug))).map(p => [p.slug,p]));
  return source
    .filter(row => variant === "full" || row.featured)
    .map(row => {
      const evidence = [...new Set(row.projects)].map(slug => projects.get(slug)).filter((p): p is Project => Boolean(p));
      const tech = row.technologies.filter(name => evidence.some(p => p.technologies.includes(name)));
      if (!evidence.length || !tech.length) return null;
      const translated = locale === "en" ? null : translations[row.id];
      return {
        id:row.id,category:row.category,featured:row.featured,
        title:translated?.title ?? row.title,
        summary:translated?.summary ?? row.summary,
        capabilities:translated?.capabilities ?? row.capabilities,
        technologies:tech,
        examples:evidence.map(p => {
          const proj=locale==="en"?p:getTranslatedProject(locale,p);
          return {slug:proj.slug,title:proj.title,technologies:proj.technologies};
        }),
      };
    })
    .filter((item): item is Service => item !== null);
}
