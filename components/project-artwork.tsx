import type { Project } from "@/lib/content";

type Props = { project: Project; index?: number; large?: boolean };

/** Intentionally illustrative. Never present this typographic art as captured app UI. */
export function ProjectArtwork({ project, index = 0, large = false }: Props) {
  return <div className={`project-art ${large ? "project-art--large" : ""}`}
    role="img" aria-label={`Conceptual typographic illustration for ${project.title}, not a product screenshot`}>
    <div className="project-art-top"><span>PROJECT / {String(index + 1).padStart(2, "0")}</span><span>CONCEPTUAL ARTWORK</span></div>
    <div className="project-art-visual" aria-hidden="true"><span className="art-orbit art-orbit--one"/><span className="art-orbit art-orbit--two"/><span className="art-node art-node--one"/><span className="art-node art-node--two"/><span className="art-node art-node--three"/></div>
    <div className="project-art-caption">{project.coverTitle.split("\\n").map((line, idx) => <span key={idx}>{line}</span>)}</div>
    <div className="project-art-bottom"><span>{project.eyebrow}</span><span aria-hidden="true">✳</span></div>
  </div>;
}
