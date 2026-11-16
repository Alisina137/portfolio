import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { getPublicQualifications, getIndependentLearningProjects, getReviewedAcademicProjects, type QualificationLocale } from "@/lib/qualifications";
import { getTranslatedUi } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n-core.mjs";

type Props = { locale?: QualificationLocale; variant?: "home" | "about" };
const en = {
  qualEyebrow: "EDUCATION & CREDENTIALS",
  qualHeading: "A foundation for continuous learning.",
  qualIntro: "Academic qualifications and professional certificates are presented only when their details have been reviewed. Practical software work provides additional, project-based evidence.",
  qualEducation: "Education",
  qualEducationPending: "Academic degree details are awaiting review. No university, graduation date, or qualification is claimed here yet.",
  qualCertifications: "Certifications",
  qualCertificationsPending: "Certificates are listed once their issuer, credential details, and supporting evidence have been reviewed.",
  qualTraining: "Professional training",
  qualTrainingPending: "Completed professional courses will be added only after review.",
  qualReviewed: "DOCUMENT REVIEWED",
  qualIssued: "Issued",
  qualCompleted: "Completed",
  qualViewCredential: "View public credential",
  qualRelatedAcademic: "Reviewed academic project work",
  qualPracticeTitle: "Learning in practice",
  qualPracticeIntro: "Selected independent education-focused software projects. These are portfolio products, not a claim of university coursework.",
  qualEvidence: "Explore case study",
  qualFullSection: "View education & credentials",
  qualDisclaimer: "No credential or degree is presented as verified without review. Unapproved personal records and private diploma/certificate scans are not published.",
  qualYearSeparator: "–",
};
export function EducationSection({ locale = "en", variant = "about" }: Props) {
  const t = locale === "en" ? en : getTranslatedUi(locale);
  const { education, certifications, training, legacyEducation } = getPublicQualifications();
  const projectExamples = getIndependentLearningProjects(locale);
  const id = variant === "about" ? "education" : "education-preview";
  const moreHref = localizePath(locale, "/about") + "#education";
  return <section id={id} className={"qualification-section qualification-section--" + variant + " section-pad"} aria-labelledby={id + "-heading"}>
    <div className="container">
      <div className="qualification-heading">
        <span className="section-eyebrow"><span>04</span><span className="section-eyebrow-line" />{t.qualEyebrow}</span>
        <div className="qualification-heading-grid">
          <h2 id={id + "-heading"}>{t.qualHeading}</h2>
          <p>{t.qualIntro}</p>
        </div>
      </div>

      {variant === "about" && <div className="qualification-grid">
        <article className="qualification-card qualification-card--education">
          <div className="qualification-card-header"><span className="qualification-glyph" aria-hidden="true">✳</span><span className="qualification-card-index">01 / 03</span></div>
          <h3>{t.qualEducation}</h3>
          {education.length > 0 ? <ol className="qualification-records">{education.map(entry => <li key={entry.id} className="qualification-record">
            <span className="qualification-reviewed">{t.qualReviewed}</span>
            <h4>{entry.title}</h4>
            <p className="qualification-institution">{entry.institution}</p>
            {entry.field && <p>{entry.field}</p>}
            {(entry.startYear !== undefined || entry.endYear !== undefined) && <p className="qualification-dates" dir="ltr">{entry.startYear ?? ""} {t.qualYearSeparator} {entry.endYear ?? ""}</p>}
            {entry.description && <p>{entry.description}</p>}
            {getReviewedAcademicProjects(entry, locale).length > 0 && <div className="qualification-links"><span>{t.qualRelatedAcademic}</span>{getReviewedAcademicProjects(entry, locale).map(project => <Link href={localizePath(locale, "/projects/" + project.slug)} key={project.slug}>{project.title}<ArrowUpRightIcon width="15" height="15" /></Link>)}</div>}
          </li>)}</ol> :
          legacyEducation ? <p className="qualification-record-summary">{legacyEducation}</p> :
          <p className="qualification-empty">{t.qualEducationPending}</p>}
        </article>

        <article className="qualification-card qualification-card--certs">
          <div className="qualification-card-header"><span className="qualification-glyph" aria-hidden="true">⌘</span><span className="qualification-card-index">02 / 03</span></div>
          <h3>{t.qualCertifications}</h3>
          {certifications.length ? <ul className="qualification-records">{certifications.map(item => <li className="qualification-record" key={item.id}>
            <span className="qualification-reviewed">{t.qualReviewed}</span><h4>{item.title}</h4>
            <p className="qualification-institution">{item.issuer}</p>
            {item.issuedOn && <p className="qualification-dates">{t.qualIssued}: <span dir="ltr">{item.issuedOn}</span></p>}
            {item.description && <p>{item.description}</p>}
            {item.credentialUrl && <a className="qualification-credential-link" href={item.credentialUrl} target="_blank" rel="noopener noreferrer">{t.qualViewCredential}<ArrowUpRightIcon width="15" height="15" /></a>}
          </li>)}</ul> : <p className="qualification-empty">{t.qualCertificationsPending}</p>}
        </article>

        <article className="qualification-card qualification-card--training">
          <div className="qualification-card-header"><span className="qualification-glyph" aria-hidden="true">⌁</span><span className="qualification-card-index">03 / 03</span></div>
          <h3>{t.qualTraining}</h3>
          {training.length ? <ul className="qualification-records">{training.map(item => <li className="qualification-record" key={item.id}>
            <span className="qualification-reviewed">{t.qualReviewed}</span><h4>{item.title}</h4>
            <p className="qualification-institution">{item.provider}</p>
            {item.completedOn && <p className="qualification-dates">{t.qualCompleted}: <span dir="ltr">{item.completedOn}</span></p>}
            {item.description && <p>{item.description}</p>}
          </li>)}</ul> : <p className="qualification-empty">{t.qualTrainingPending}</p>}
        </article>
      </div>}

      <div className="qualification-practice">
        <div className="qualification-practice-heading"><span className="qualification-label">{t.qualPracticeTitle}</span><p>{t.qualPracticeIntro}</p></div>
        <div className="qualification-examples">{projectExamples.map(project => <Link className="qualification-project" href={localizePath(locale, "/projects/" + project.slug)} key={project.slug}>
          <span className="qualification-project-mark" aria-hidden="true">↗</span>
          <span className="qualification-project-copy"><strong>{project.title}</strong><small>{project.oneLiner}</small></span>
          <span className="qualification-project-action">{t.qualEvidence} <ArrowRightIcon width="16" height="16" /></span>
        </Link>)}</div>
      </div>
      {variant === "home" && <Link className="button button-outline qualification-more" href={moreHref}>{t.qualFullSection}<ArrowRightIcon width="17" height="17" /></Link>}
      {variant === "about" && <p className="qualification-disclaimer">{t.qualDisclaimer}</p>}
    </div>
  </section>;
}
