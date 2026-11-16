import { getPublishedProjects, type Project } from "@/lib/content";

export type SkillFamily = "frontend" | "mobile" | "backend" | "database" | "language" | "delivery";
export type SkillGroup = {
  id: SkillFamily;
  number: string;
  technologies: string[];
  examples: Pick<Project, "slug" | "title">[];
  evidence: "project" | "portfolio";
};

/** Public evidence, not self-rated proficiency. Delivery is this site's own workflow. */
const families: ReadonlyArray<{ id: SkillFamily; technologies: readonly string[] }> = [
  { id: "frontend", technologies: ["Next.js"] },
  { id: "mobile", technologies: ["React Native", "Expo"] },
  { id: "backend", technologies: ["Fastify", "Express"] },
  { id: "database", technologies: ["PostgreSQL", "Drizzle"] },
  { id: "language", technologies: ["TypeScript"] },
];

export const PORTFOLIO_SOURCE_URL = "https://github.com/Alisina137/portfolio";

export function getSkillGroups(): SkillGroup[] {
  const projects = getPublishedProjects();
  const evidence = new Set(projects.flatMap(project => project.technologies));
  const groups = families.map((family, index) => {
    const technologies = family.technologies.filter(tech => evidence.has(tech));
    const examples = projects
      .filter(project => technologies.some(tech => project.technologies.includes(tech)))
      .slice(0, 2)
      .map(({ slug, title }) => ({ slug, title }));
    return { id: family.id, number: String(index + 1).padStart(2, "0"), technologies, examples, evidence: "project" as const };
  }).filter(group => group.technologies.length && group.examples.length);
  return [...groups, {
    id: "delivery", number: String(groups.length + 1).padStart(2, "0"),
    technologies: ["GitHub", "Netlify"], examples: [], evidence: "portfolio",
  }];
}
