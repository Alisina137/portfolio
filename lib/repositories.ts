
import records from "@/content/repositories.json";
import { getPublishedProjects, getCaseStudy, getDevelopmentLabel, type Project } from "@/lib/content";
import { getTranslatedUi, getTranslatedProject } from "@/lib/i18n";

export type RepoLocale = "en" | "fa" | "ps";
export type RepoCard = {
  slug:string; title:string; description:string; category:string; technologies:string[];
  repoFullName:string; repoHref:string; branch:string; language:string;
  checkedOn:string; status:string; featured:boolean; kind:"project"|"portfolio";
  projectSlug:string|null;
};
const website={
  title:"This portfolio",
  description:"A Next.js portfolio with multilingual drafts, accessible project case studies and a verified GitHub-to-Netlify deployment workflow.",
  technologies:["Next.js","TypeScript"],
};
const publicRepoPattern=/^Alisina137\/[A-Za-z0-9_.-]+$/;

/**
 * Published repository directory backed by verified public URLs and project
 * records. Repository metadata is a dated *snapshot*, never a real-time feed.
 * No stars, forks, issue counts, commits or last-activity claims.
 */
export function getRepositories(locale:RepoLocale="en"):RepoCard[] {
  const bySlug=new Map(getPublishedProjects().filter(p=>getCaseStudy(p.slug)).map(p=>[p.slug,p]));
  const featured=new Set(records.featured);
  return records.repositories.flatMap(record=>{
    if(!publicRepoPattern.test(record.repository))return [];
    const url="https://github.com/"+record.repository;
    const project=bySlug.get(record.slug);
    if(record.slug!=="portfolio" && (!project?.repoUrlVerified || project.repoUrl!==url))return [];
    if(record.slug==="portfolio" && record.repository!=="Alisina137/portfolio")return [];
    const localized=project && locale!=="en" ? getTranslatedProject(locale,project) : project;
    const isPortfolio=record.slug==="portfolio";
    const ui=locale==="en"?null:getTranslatedUi(locale);
    const category=isPortfolio?(ui?.repoSiteCategory ?? "Portfolio source"):
      locale==="en" ? project!.category : getTranslatedUi(locale)[project!.category as "Education"|"Sports"|"Marketplace"|"Healthcare"] ?? project!.category;
    const status=isPortfolio?(ui?.repoSiteStatus ?? "Portfolio source"):
      locale==="en"?getDevelopmentLabel(project!.developmentStatus):getTranslatedUi(locale)[project!.developmentStatus];
    const description=isPortfolio?(ui?.repoSiteDescription ?? website.description):localized!.oneLiner;
    return [{
      slug:record.slug,
      title:isPortfolio?(ui?.repoSiteTitle ?? website.title):localized!.title,
      description,category,
      technologies:isPortfolio?website.technologies:project!.technologies,
      repoFullName:record.repository,repoHref:url,
      branch:record.defaultBranch,language:record.language,
      checkedOn:records.verifiedOn, status,
      featured:featured.has(record.slug),kind:isPortfolio?"portfolio" as const:"project" as const,
      projectSlug:isPortfolio?null:record.slug,
    }];
  });
}

export function getFeaturedRepositories(locale:RepoLocale="en"):RepoCard[] {
  const index=new Map(getRepositories(locale).map(r=>[r.slug,r]));
  return records.featured.map(slug=>index.get(slug)).filter((r):r is RepoCard=>Boolean(r));
}
