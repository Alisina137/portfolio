import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectArtwork } from "@/components/project-artwork";
import { ProjectGallery } from "@/components/project-gallery";
import { FeatureShowcase } from "@/components/feature-showcase";
import { ArrowUpRightIcon, ArrowRightIcon } from "@/components/icons";
import { getCaseStudy, getDevelopmentLabel, getPublicProject, getPublishedProjects, getRelatedProjects } from "@/lib/content";
import { returnToCatalog } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ back?: string | string[] }>;
};
export const dynamicParams = false;
export function generateStaticParams() { return getPublishedProjects().filter(p => Boolean(getCaseStudy(p.slug))).map(p => ({ slug: p.slug })); }

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublicProject(slug);
  if (!project || !getCaseStudy(slug)) return { title: "Project not found | Alisina Sarwari", robots: { index: false, follow: false } };
  return createPageMetadata({ title: `${project.title} — Project case study | Alisina Sarwari`, description: project.oneLiner, pathname: `/projects/${project.slug}` });
}

export default async function ProjectCasePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const project = getPublicProject(slug);
  const study = getCaseStudy(slug);
  if (!project || !study) notFound();
  const query = await searchParams;
  const backHref = returnToCatalog(query.back, getPublishedProjects());
  const back = new URL(backHref, "https://portfolio.invalid").search;
  const related = getRelatedProjects(project);
  return <main id="main" tabIndex={-1}>
    <div className={`case-layout project-card--${project.motif}`}>
      <div className="container">
        <nav aria-label="Breadcrumb" className="case-breadcrumb"><Link href={backHref}>Projects</Link><span aria-hidden="true">/</span><span aria-current="page">{project.title}</span></nav>
        <header className="case-hero">
          <div className="case-hero-copy"><div className="page-eyebrow"><span>CASE STUDY /</span> {project.eyebrow}</div><h1>{project.title}<span>.</span></h1><p className="case-hero-summary">{project.oneLiner}</p><div className="case-hero-status"><span className="status"><span className="status-indicator" />{getDevelopmentLabel(project.developmentStatus)}</span><span>Portfolio case study · Source-reviewed</span></div></div>
          <div className="case-hero-media"><ProjectArtwork project={project} large /><p className="case-hero-caption">Conceptual illustration — not an application screenshot.</p></div>
        </header>
        <div className="case-facts" aria-label="Project information">
          <div><span>PRODUCT TYPE</span><strong>{study.productType}</strong></div>
          <div><span>MY ROLE</span><strong>{project.ownerRole}</strong></div>
          <div><span>PLATFORMS</span><strong>{study.platforms.join(" · ")}</strong></div>
          <div><span>TECHNOLOGIES</span><strong>{project.technologies.join(" · ")}</strong></div>
        </div>
        <div className="case-body-layout">
          <aside className="case-sidebar" aria-label="On this page"><span>IN THIS CASE</span><a href="#context">Overview</a><a href="#built">What I built</a><a href="#technical">Technical approach</a><a href="#gallery">Visual walkthrough</a><a href="#tradeoffs">Trade-offs</a><a href="#status">Current state</a><Link href={backHref}>← All projects</Link></aside>
          <div className="case-story">
            <section className="case-section" id="context"><div className="case-section-label">01 / THE CONTEXT</div><h2>What problem<br/><em>does it address?</em></h2>{study.problem.map((paragraph, i) => <p key={i}>{paragraph}</p>)}<div className="case-audience"><span>DESIGNED FOR</span><p>{study.audience}</p></div></section>
            <section className="case-section" id="built"><div className="case-section-label">02 / THE EXPERIENCE</div><h2>What the product<br/><em>brings together.</em></h2><FeatureShowcase projectSlug={project.slug} features={study.features} /></section>
            <section className="case-section" id="technical"><div className="case-section-label">03 / ENGINEERING</div><h2>Behind the interfaces.</h2><p className="case-section-lead">Architectural decisions and constraints described in the checked project source.</p><div className="case-tech-grid">{study.technicalNotes.map(note => <article key={note.title}><span aria-hidden="true">⌁</span><h3>{note.title}</h3><p>{note.description}</p></article>)}</div></section>
            <ProjectGallery projectTitle={project.title} features={study.features} items={study.media}/>
            <section className="case-section" id="tradeoffs"><div className="case-section-label">05 / REFLECTIONS</div><h2>Decisions &amp; trade-offs.</h2><div className="case-tradeoffs">{study.tradeoffs.map(note => <article key={note.title}><h3>{note.title}</h3><p>{note.description}</p></article>)}</div></section>
            <section className="case-section" id="status"><div className="case-section-label">06 / PROJECT STATUS</div><h2>Where it stands.</h2><span className="status"><span className="status-indicator" />{getDevelopmentLabel(project.developmentStatus)}</span><p>{study.currentState}</p><h3 className="case-next-title">What's next</h3><ul className="case-next-list">{study.nextSteps.map(step => <li key={step}>{step}</li>)}</ul><p className="case-review-note">{study.sourceEvidence} Product maturity is separate from publication of this portfolio page.</p></section>
            <section className="case-links" aria-label="Project links"><div><h2>Explore the source.</h2><p>A public product demo has not been verified for this project.</p></div>{project.repoUrlVerified && project.repoUrl && <a className="button button-primary" href={project.repoUrl} target="_blank" rel="noopener noreferrer">Source code on GitHub <ArrowUpRightIcon /><span className="sr-only">(opens in a new tab)</span></a>}</section>
          </div>
        </div>
        <div className="case-contact-inline"><div><span className="page-eyebrow">HAVE A RELATED IDEA?</span><p>Interested in discussing the engineering behind this project?</p></div><Link href="/contact" className="button button-outline">Get in touch <ArrowRightIcon /></Link></div>
        <section className="case-related" aria-labelledby="related-heading"><div className="case-related-heading"><div><span className="page-eyebrow">MORE WORK</span><h2 id="related-heading">Keep exploring.</h2></div><Link href={backHref}>Back to all projects <ArrowRightIcon width="17" height="17" /></Link></div><div className="case-related-grid">{related.map(item => <Link className="case-related-card" key={item.slug} href={`/projects/${item.slug}${back ? `?back=${encodeURIComponent(back.slice(1))}` : ""}`}><span>{item.eyebrow}</span><strong>{item.title}<i>.</i></strong><p>{item.oneLiner}</p><span className="case-related-arrow">Read case study ↗</span></Link>)}</div></section>
      </div>
    </div>
  </main>;
}
