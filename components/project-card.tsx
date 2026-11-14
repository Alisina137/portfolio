import type { Project } from "@/lib/content";
import { getDevelopmentLabel } from "@/lib/content";
import { ArrowUpRightIcon } from "./icons";

type Props = { project: Project; index: number };

export function ProjectCard({ project, index }: Props) {
  const lead = index === 0;
  return <article className={`project-card project-card--${project.motif} ${lead ? "project-card--lead" : ""}`}>
    <div className="project-art" aria-label={`Typographic artwork for ${project.title}; not a product screenshot`} role="img">
      <div className="project-art-top"><span>PROJECT / {String(index + 1).padStart(2, "0")}</span><span>ALISINA / LAB</span></div>
      <div className="project-art-visual" aria-hidden="true"><span className="art-orbit art-orbit--one"/><span className="art-orbit art-orbit--two"/><span className="art-node art-node--one"/><span className="art-node art-node--two"/><span className="art-node art-node--three"/></div>
      <div className="project-art-caption">{project.coverTitle.split("\\n").map((line, idx) => <span key={idx}>{line}</span>)}</div>
      <div className="project-art-bottom"><span>{project.eyebrow}</span><span>↗</span></div>
    </div>
    <div className="project-info">
      <div className="project-metadata"><span>{project.eyebrow}</span><span className="status"><span className="status-indicator" />{getDevelopmentLabel(project.developmentStatus)}</span></div>
      <h3>{project.title}<span className="project-title-punctuation">.</span></h3>
      <p className="project-summary">{project.oneLiner}</p>
      <div className="project-tags" aria-label="Technologies">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
      <a className="project-link" href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} source on GitHub (opens in a new tab)`}>
        View source on GitHub <ArrowUpRightIcon width="17" height="17" />
      </a>
    </div>
  </article>;
}
