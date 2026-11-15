import Link from "next/link";
import type { Project } from "@/lib/content";
import { getDevelopmentLabel } from "@/lib/status";
import { ArrowUpRightIcon, ArrowRightIcon } from "./icons";
import { ProjectArtwork } from "./project-artwork";
import { getUi } from "@/lib/i18n-client";
import type { Locale } from "@/lib/i18n-core.mjs";

type Props = { project: Project; index: number; context?: "home" | "catalog"; detailHref?: string; locale?: Locale };

export function ProjectCard({ project, index, context = "home", detailHref, locale = "en" }: Props) {
  const ui = locale === "en" ? null : getUi(locale);
  const lead = context === "home" && index === 0;
  const href = detailHref ?? `/projects/${project.slug}`;
  const tags = project.technologies.slice(0, context === "catalog" ? 3 : 4);
  return <article className={`project-card project-card--${project.motif} ${lead ? "project-card--lead" : ""} ${context === "catalog" ? "project-card--catalog" : ""}`}>
    <ProjectArtwork project={project} index={index} labels={ui ? { alt: ui.heroAlt, top: ui.artTop, visual: ui.artVisual } : undefined} />
    <div className="project-info">
      <div className="project-metadata"><span>{project.eyebrow}</span><span className="status"><span className="status-indicator" />{ui?.[project.developmentStatus] ?? getDevelopmentLabel(project.developmentStatus)}</span></div>
      <h3><Link className="project-card-title-link" href={href}>{project.title}<span className="project-title-punctuation">.</span></Link></h3>
      <p className="project-summary">{project.oneLiner}</p>
      <div className="project-tags" aria-label={ui?.technologies ?? "Technologies"}>{tags.map(technology => <span key={technology}>{technology}</span>)}{project.technologies.length > tags.length && <span>+{project.technologies.length - tags.length} {ui?.more ?? "more"}</span>}</div>
      <span className="project-link" aria-hidden="true">{ui?.caseRead ?? "Read case study"} <ArrowRightIcon width="17" height="17" /></span>
      {project.repoUrlVerified && project.repoUrl && <a className="project-card-source" href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title}: ${ui?.codeGitHub ?? "View source on GitHub"} (${ui?.newTab ?? "opens in a new tab"})`}>GitHub <ArrowUpRightIcon width="14" height="14" /></a>}
    </div>
  </article>;
}
