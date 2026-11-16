import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { getIndependentWork, getApprovedEmployment, type ExperienceLocale } from "@/lib/experience";
import { getTranslatedUi } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n-core.mjs";
import { getDevelopmentLabel } from "@/lib/content";

const en = {
  experienceEyebrow: "PROJECT-BASED EXPERIENCE",
  experienceHeading: "Experience through building.",
  experienceIntro: "An honest view of independent product work. These are project case studies, not employer positions, and the order is curated rather than a claim about dates.",
  experienceBadge: "INDEPENDENT PROJECT",
  experienceSelected: "SELECTED PROJECT JOURNEY",
  experienceAll: "PROJECT WORK",
  experienceStatus: "CURRENT PROJECT STATUS",
  experienceTechnologies: "TECHNOLOGIES",
  experienceExplore: "Read project case study",
  experienceExpand: "Explore project scope & engineering",
  experienceFeatures: "PROJECT SCOPE",
  experienceEngineering: "TECHNICAL APPROACH",
  experienceFootnote: "Independent projects are not represented as paid work, client contracts or verified job positions. Employment dates, personal responsibilities and employers will be displayed only after review and approval.",
  experienceMore: "View complete project-based experience",
  experienceFormalEyebrow: "VERIFIED EMPLOYMENT",
  experienceFormalHeading: "Employment history",
  experienceFormalCurrent: "Present",
  experienceFormalResponsibilities: "RESPONSIBILITIES",
  experienceStage: "Curated project sequence, not a chronological employment history",
};

type Props = { locale?: ExperienceLocale; variant?: "home" | "about" };

export function ExperienceTimeline({ locale = "en", variant = "about" }: Props) {
  const t = locale === "en" ? en : getTranslatedUi(locale);
  const projects = getIndependentWork(locale, variant);
  const roles = getApprovedEmployment();
  const id = variant === "home" ? "experience" : "experience-about";
  return <section className={"experience-section experience-section--" + variant + " section-pad"} id={id} aria-labelledby={id + "-title"}>
    <div className="container">
      <div className="experience-heading">
        <span className="section-eyebrow"><span>{variant === "home" ? "03" : "03"}</span><span className="section-eyebrow-line" />{t.experienceEyebrow}</span>
        <div className="experience-heading-grid">
          <h2 id={id + "-title"}>{t.experienceHeading}</h2>
          <p>{t.experienceIntro}</p>
        </div>
      </div>
      {roles.length > 0 && <div className="experience-employment" aria-label={t.experienceFormalHeading}>
        <span className="experience-caption">{t.experienceFormalEyebrow}</span>
        <h3>{t.experienceFormalHeading}</h3>
        <ol className="experience-jobs">{roles.map(role => <li key={role.id} className="experience-job">
          <div className="experience-job-heading"><h4>{role.title}</h4><span>{role.startDate} — {role.endDate ?? t.experienceFormalCurrent}</span></div>
          <strong>{role.organization}</strong>
          <span className="experience-card-kicker">{t.experienceFormalResponsibilities}</span>
          <ul>{role.responsibilities.map(line=><li key={line}>{line}</li>)}</ul>
          <div className="experience-tech-list">{role.technologies.map(tech=><span key={tech} dir="ltr">{tech}</span>)}</div>
        </li>)}</ol>
      </div>}
      <div className="experience-intro-rail">
        <span className="experience-caption">{variant === "home" ? t.experienceSelected : t.experienceAll}</span>
        <span className="experience-order-note">{t.experienceStage}</span>
      </div>
      <ol className="experience-timeline" aria-label={t.experienceStage}>
        {projects.map(({ number, project, caseStudy }) => <li key={project.slug} className="experience-timeline-entry">
          <div className="experience-track" aria-hidden="true"><span className="experience-dot"/><span className="experience-sequence">{number}</span></div>
          <article className="experience-card">
            <div className="experience-card-header">
              <div><span className="experience-card-kicker">{t.experienceBadge} <span aria-hidden="true">/</span> {project.category}</span>
                <h3>{project.title}</h3></div>
              <span className="experience-card-status">{locale === "en" ? getDevelopmentLabel(project.developmentStatus) : getTranslatedUi(locale)[project.developmentStatus]}</span>
            </div>
            <p className="experience-card-summary">{project.oneLiner}</p>
            <div className="experience-card-tech"><span className="experience-card-kicker">{t.experienceTechnologies}</span><ul>{project.technologies.map(tech => <li key={tech} dir="ltr">{tech}</li>)}</ul></div>
            <details className="experience-details"><summary>{t.experienceExpand}<span className="experience-expand-icon" aria-hidden="true">+</span></summary>
              <div className="experience-details-content">
                <div><h4>{t.experienceFeatures}</h4><ul>{caseStudy.features.slice(0, 3).map(feature => <li key={feature.title}><strong>{feature.title}</strong><p>{feature.description}</p></li>)}</ul></div>
                <div><h4>{t.experienceEngineering}</h4><ul>{caseStudy.technicalNotes.slice(0, 2).map(note => <li key={note.title}><strong>{note.title}</strong><p>{note.description}</p></li>)}</ul></div>
              </div>
            </details>
            <Link className="experience-case-link" href={localizePath(locale, "/projects/" + project.slug)}>{t.experienceExplore}<ArrowRightIcon width="18" height="18" /></Link>
          </article>
        </li>)}
      </ol>
      {variant === "home" && <div className="experience-more"><Link className="button button-outline" href={localizePath(locale,"/about")+"#experience-about"}>{t.experienceMore}<ArrowRightIcon width="18" height="18" /></Link></div>}
      <p className="experience-footnote">{t.experienceFootnote}</p>
    </div>
  </section>;
}
