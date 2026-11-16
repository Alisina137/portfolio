import Link from "next/link";
import type { SVGProps } from "react";
import { ArrowUpRightIcon } from "@/components/icons";
import { getTranslatedUi } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n-core.mjs";
import { getSkillGroups, PORTFOLIO_SOURCE_URL, type SkillFamily } from "@/lib/skills";

type Locale = "en" | "fa" | "ps";
type Props = { locale?: Locale; variant?: "home" | "about" };

const english = {
  skillsSectionLabel: "SKILLS & TECHNOLOGIES",
  skillsHeadline: "The tools behind the work.",
  skillsIntro: "A practical stack, grouped by the problems it helps solve. Technologies connect to real project case studies—not self-rated skill bars.",
  skillsFrontend: "Frontend engineering",
  skillsFrontendDesc: "Structured interfaces for complex web experiences.",
  skillsMobile: "Mobile development",
  skillsMobileDesc: "Touch-first flows and cross-platform app journeys.",
  skillsBackend: "Backend & APIs",
  skillsBackendDesc: "Connecting application flows with service and business logic.",
  skillsDatabase: "Data & persistence",
  skillsDatabaseDesc: "Structured data and application persistence.",
  skillsLanguage: "Languages & foundations",
  skillsLanguageDesc: "Typed application code across mobile and web projects.",
  skillsDelivery: "Workflow & delivery",
  skillsDeliveryDesc: "The workflow used to version and deploy this portfolio.",
  skillsToolLabel: "TOOLS IN USE",
  skillsEvidence: "SEE IN PROJECTS",
  skillsPortfolioEvidence: "THIS PORTFOLIO'S DELIVERY",
  skillsPortfolioLink: "View portfolio source",
  skillsDisclaimer: "Project technologies come from published project records. Delivery tools describe this website; neither list is a proficiency rating or a professional certification.",
};

function SkillIcon({ kind, ...props }: { kind: SkillFamily } & SVGProps<SVGSVGElement>) {
  const shared = { fill: "none", stroke: "currentColor", strokeWidth: 1.65, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <svg width="29" height="29" viewBox="0 0 32 32" aria-hidden="true" {...shared} {...props}>
    {kind === "frontend" && <><rect x="4.5" y="6" width="23" height="19" rx="3"/><path d="M4.5 11.5h23M13 15l-3.5 3.5L13 22m6-7 3.5 3.5L19 22"/></>}
    {kind === "mobile" && <><rect x="10" y="3.5" width="12" height="25" rx="3"/><path d="M14 7h4M15.5 24.5h1"/><rect x="12.7" y="11.5" width="6.6" height="7" rx="1.3"/></>}
    {kind === "backend" && <><rect x="5.5" y="5" width="21" height="7" rx="2"/><rect x="5.5" y="14.5" width="21" height="7" rx="2"/><path d="M9.5 8.5h.1m3.4 0h.1m-3.6 9.5h.1m3.4 0h.1M16 21.5v4.5m-6 0h12"/></>}
    {kind === "database" && <><ellipse cx="16" cy="7.5" rx="10.5" ry="4"/><path d="M5.5 7.5v16c0 2.2 4.7 4 10.5 4s10.5-1.8 10.5-4v-16M5.5 15.5c0 2.2 4.7 4 10.5 4s10.5-1.8 10.5-4m-21 8c0 2.2 4.7 4 10.5 4s10.5-1.8 10.5-4"/></>}
    {kind === "language" && <><path d="M11 5C7 5 7 8 7 10v3.5c0 2-2 2.5-3.5 2.5C5 16 7 16.5 7 18.5V22c0 2 0 5 4 5m10-22c4 0 4 3 4 5v3.5c0 2 2 2.5 3.5 2.5-1.5 0-3.5.5-3.5 2.5V22c0 2 0 5-4 5M13.5 16h5"/></>}
    {kind === "delivery" && <><circle cx="9" cy="6.5" r="3"/><circle cx="9" cy="25.5" r="3"/><circle cx="23" cy="16" r="3"/><path d="M9 9.5v13M12 6.5h4.5A6.5 6.5 0 0 1 23 13"/></>}
  </svg>;
}

export function SkillsSection({ locale = "en", variant = "home" }: Props) {
  const t = locale === "en" ? english : getTranslatedUi(locale);
  const names: Record<SkillFamily, { title: string; description: string }> = {
    frontend: { title: t.skillsFrontend, description: t.skillsFrontendDesc },
    mobile: { title: t.skillsMobile, description: t.skillsMobileDesc },
    backend: { title: t.skillsBackend, description: t.skillsBackendDesc },
    database: { title: t.skillsDatabase, description: t.skillsDatabaseDesc },
    language: { title: t.skillsLanguage, description: t.skillsLanguageDesc },
    delivery: { title: t.skillsDelivery, description: t.skillsDeliveryDesc },
  };
  const id = variant === "home" ? "skills" : "skills-about";
  return <section id={id} className={"skills-section skills-section--" + variant + " section-pad"} aria-labelledby={id + "-title"}>
    <div className="container">
      <div className="skills-heading">
        <span className="section-eyebrow"><span>02</span><span className="section-eyebrow-line" />{t.skillsSectionLabel}</span>
        <div className="skills-heading-row">
          <h2 id={id + "-title"}>{t.skillsHeadline}</h2>
          <p>{t.skillsIntro}</p>
        </div>
      </div>
      <div className="skills-grid">
        {getSkillGroups().map(group => <article className={"skills-card skills-card--" + group.id} key={group.id}>
          <div className="skills-card-top">
            <span className="skills-icon"><SkillIcon kind={group.id}/></span>
            <span className="skills-card-index" aria-hidden="true">{group.number} / 06</span>
          </div>
          <h3>{names[group.id].title}</h3>
          <p className="skills-card-description">{names[group.id].description}</p>
          <div className="skills-card-tools">
            <span className="skills-card-label">{t.skillsToolLabel}</span>
            <ul className="skills-tags" aria-label={t.skillsToolLabel}>
              {group.technologies.map(tech => <li key={tech} dir="ltr">{tech}</li>)}
            </ul>
          </div>
          <div className="skills-card-evidence">
            <span className="skills-card-label">{group.evidence === "portfolio" ? t.skillsPortfolioEvidence : t.skillsEvidence}</span>
            <div className="skills-card-links">
              {group.evidence === "portfolio"
                ? <a href={PORTFOLIO_SOURCE_URL} target="_blank" rel="noopener noreferrer">{t.skillsPortfolioLink}<ArrowUpRightIcon width="16" height="16"/><span className="sr-only">({locale === "en" ? "opens in a new tab" : getTranslatedUi(locale).newTab})</span></a>
                : group.examples.map(project => <Link key={project.slug} href={localizePath(locale, "/projects/" + project.slug)}>{project.title}<ArrowUpRightIcon width="16" height="16" /></Link>)}
            </div>
          </div>
        </article>)}
      </div>
      <p className="skills-disclaimer">{t.skillsDisclaimer}</p>
    </div>
  </section>;
}
