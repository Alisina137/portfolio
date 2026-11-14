import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { getPublishedProjects } from "@/lib/content";
import { getPublicIdentity } from "@/lib/public-identity";
import { canIndexPortfolio } from "@/lib/seo";
import { getPageUrl } from "@/lib/site-url.mjs";

export const metadata: Metadata = createPageMetadata({
  title: "About — Alisina Sarwari | Software Engineer & Product Builder",
  description: "The approach, selected technologies and product engineering experience behind Alisina Sarwari’s web and mobile projects.",
  pathname: "/about",
});

const focusAreas = [
  {
    number: "01", label: "Web applications", category: "FRONTEND & SYSTEMS",
    summary: "Interfaces for complex operations that stay approachable, structured and usable.",
    detail: "Administrative and public workflows, component systems, and responsive experiences.",
    projects: ["maktablink", "bazaarlink"],
  },
  {
    number: "02", label: "Mobile experiences", category: "PRODUCT INTERFACES",
    summary: "Mobile tools built around everyday decisions and real-world constraints.",
    detail: "Navigation, onboarding, localization and the full journey from action to result.",
    projects: ["futsal", "kankorprep"],
  },
  {
    number: "03", label: "Backend & APIs", category: "BUSINESS LOGIC",
    summary: "The rules and services that make product interactions behave consistently.",
    detail: "Data validation, permissions, APIs, and lifecycle transitions across connected views.",
    projects: ["maktablink", "amlaklink"],
  },
  {
    number: "04", label: "Data & product engineering", category: "SYSTEM THINKING",
    summary: "Organizing information and translating requirements into dependable workflows.",
    detail: "Structured data models, product state, and trade-offs between scope and utility.",
    projects: ["dandanlink", "bazaarlink"],
  },
] as const;

const approach = [
  { marker: "01", title: "Understand the context", copy: "Map the people involved, their constraints and the outcome they need before choosing components or services." },
  { marker: "02", title: "Design the entire journey", copy: "Sketch navigation, data relationships, expected states and recovery paths—not just individual screens." },
  { marker: "03", title: "Build connected features", copy: "Keep interfaces, permissions and data in agreement so that the user can complete a meaningful task." },
  { marker: "04", title: "Review and refine", copy: "Test assumptions, look for friction and improve clarity without adding features simply for decoration." },
];

export default function AboutPage() {
  const identity = getPublicIdentity();
  const bySlug = new Map(getPublishedProjects().map(project => [project.slug, project]));
  const technologies = Array.from(new Set(getPublishedProjects().flatMap(project => project.technologies)));
  const aboutUrl = getPageUrl("/about");
  const personSchema = canIndexPortfolio() && aboutUrl ? {
    "@context": "https://schema.org",
    "@type": "Person",
    name: identity.name,
    jobTitle: identity.title,
    url: aboutUrl,
    ...(identity.github && { sameAs: [identity.github, ...(identity.linkedIn ? [identity.linkedIn] : [])] }),
  } : null;
  return <main id="main" tabIndex={-1}>
    {personSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }} />}
    <section className="identity-hero section-pad" aria-labelledby="about-title">
      <div className="container identity-hero-grid">
        <div className="identity-intro">
          <div className="page-eyebrow"><span>02 /</span> A LITTLE ABOUT ME</div>
          <h1 id="about-title">Curiosity meets<br/><em>craft.</em></h1>
          <p className="identity-lead">I'm {identity.name}. I explore the space where product thinking, thoughtful interfaces and software engineering meet.</p>
          <p className="identity-supporting">{identity.shortBio}</p>
          <div className="identity-actions"><Link className="button button-primary" href="/projects">Explore my work <ArrowRightIcon /></Link><Link className="button button-outline" href="/contact">Get in touch <ArrowRightIcon /></Link></div>
        </div>
        <div className="identity-portrait" role="img" aria-label="Typographic AS monogram, not a photograph">
          <span className="identity-portrait-meta">PEOPLE • PROBLEMS • PRODUCTS</span>
          <div className="identity-portrait-mark" aria-hidden="true">A<span>S</span><i>✳</i></div>
          <div className="identity-portrait-foot"><span>THINK / DESIGN / BUILD</span><span>{identity.location.toUpperCase()}</span></div>
          <span className="identity-portrait-outline" aria-hidden="true" />
        </div>
      </div>
    </section>

    <section className="about-focus section-pad" aria-labelledby="focus-title">
      <div className="container">
        <div className="about-section-heading"><span className="page-eyebrow"><span>01 /</span> CAPABILITIES</span><h2 id="focus-title">Across the<br/><em>product stack.</em></h2><p>Different disciplines, connected by one goal: build things that people can actually use.</p></div>
        <div className="focus-grid">{focusAreas.map(area => {
          const links = area.projects.map(slug => bySlug.get(slug)).filter(project => project !== undefined);
          return <article className="focus-card" key={area.number}>
            <div className="focus-card-top"><span>{area.number}</span><span>{area.category}</span></div>
            <h3>{area.label}<span>.</span></h3><p className="focus-card-summary">{area.summary}</p><p className="focus-card-detail">{area.detail}</p>
            <div className="focus-card-links" aria-label={`Relevant ${area.label.toLowerCase()} examples`}>{links.map(project => <Link key={project.slug} href={`/projects/${project.slug}`}>{project.title}<span aria-hidden="true">↗</span></Link>)}</div>
          </article>;
        })}</div>
      </div>
    </section>

    <section className="about-tech section-pad" aria-labelledby="tech-title"><div className="container about-tech-grid">
      <div><span className="page-eyebrow"><span>02 /</span> TOOLS IN CONTEXT</span><h2 id="tech-title">The stack serves<br/><em>the product.</em></h2><p>These are technologies documented in the public project records. They're tools I work with—not a percentage score or a claim of mastery.</p><Link href="/projects" className="inline-direction">See the evidence in projects <ArrowRightIcon width="18" height="18" /></Link></div>
      <div className="about-tech-pills" aria-label="Technologies used in published project case studies">{technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
    </div></section>

    <section className="about-process section-pad" aria-labelledby="process-title"><div className="container">
      <div className="about-section-heading"><span className="page-eyebrow"><span>03 /</span> HOW I WORK</span><h2 id="process-title">From a question<br/><em>to a working system.</em></h2><p>A practical approach to exploring complex product ideas, not an invented employment timeline.</p></div>
      <div className="about-process-list">{approach.map(item => <article key={item.marker}><span>{item.marker}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
      {identity.education && <div className="about-education"><span className="page-eyebrow">EDUCATION</span><p>{identity.education}</p></div>}
    </div></section>

    <section className="about-close section-pad"><div className="container about-close-inner">
      <span className="page-eyebrow"><span>04 /</span> KEEP THE CONVERSATION GOING</span>
      <h2>Let's build something<br/><em>useful.</em></h2>
      <p>Interested in engineering work, a product idea, or exploring one of these projects? Here's where to find me.</p>
      <div className="about-close-actions"><Link href="/contact" className="button button-primary">Contact <ArrowRightIcon /></Link>{identity.resume && <a href={identity.resume} className="button button-outline" target="_blank" rel="noopener noreferrer">View résumé (PDF) <ArrowUpRightIcon /><span className="sr-only">(opens in a new tab)</span></a>}{identity.github && <a href={identity.github} className="button button-outline" target="_blank" rel="noopener noreferrer">GitHub profile <ArrowUpRightIcon /><span className="sr-only">(opens in a new tab)</span></a>}</div>
    </div></section>
  </main>;
}
