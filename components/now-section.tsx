import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { NowExplorer, type ExplorerWords } from "@/components/now-explorer";
import { getNowFocus, getNowProjects, getFeaturedNowProjects, getPublicLearningGoals, type NowLocale } from "@/lib/now";
import { getTranslatedUi } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n-core.mjs";

type Props = { locale?: NowLocale };
const english = {
 now: "Now",
 nowEyebrow: "WORK IN PROGRESS",
 nowPreviewTitle: "What the projects are exploring.",
 nowPreviewIntro: "A snapshot of ongoing portfolio development, grounded in case studies and their reviewed source records.",
 nowPreviewAction: "Explore the full project snapshot",
 nowPreviewDisclaimer: "Source-reviewed project status, not a real-time activity feed or a claim that each project is being worked on today.",
 nowStatus: "PROJECT STATUS",
 nowSourceReviewed: "Source reviewed",
 nowProjectLink: "Open case study",
 nowHeroEyebrow: "CURRENT WORK / SOURCE SNAPSHOT",
 nowHeroTitle: "Projects in progress.",
 nowHeroIntro: "An overview of evolving software projects and technical themes, with next checks quoted from their case studies—not a live sprint board.",
 nowHeroNote: "The page reflects the latest review dates saved in project records, rather than GitHub commits or live development activity.",
 nowOverviewLabel: "DEVELOPMENT SNAPSHOT",
 nowOverviewCount: "Projects with an ongoing development status",
 nowOverviewReviewed: "Each project carries its own source-review date",
 nowSearchLabel: "Find a project",
 nowSearchPlaceholder: "Search projects and technologies",
 nowAll: "All areas",
 nowCount: "Showing {count} of {total} projects",
 nowCleared: "Filters cleared",
 nowNoResults: "No projects match these filters.",
 nowClear: "Clear filters",
 nowNextCheck: "NEXT VERIFICATION / REVIEW STEP",
 nowNoPercentage: "Progress percentages, deadlines and current sprint claims are intentionally omitted until verified. Source checks are not promises of release.",
 nowFocusEyebrow: "TECHNICAL THREADS",
 nowFocusTitle: "Patterns across the projects.",
 nowFocusIntro: "These are technologies and engineering topics already represented in the reviewed project sources—not unverified personal learning claims.",
 nowFocusEvidence: "EXPLORE IN PROJECTS",
 nowLearningEyebrow: "OWNER-APPROVED LEARNING",
 nowLearningTitle: "Learning goals",
 nowClosingTitle: "Explore the decisions behind each build.",
 nowClosingIntro: "Open any case study to see the problem, feature scope and engineering context without assuming that a public launch has happened.",
 nowClosingAction: "View all case studies",
};
function words(locale: NowLocale) { return locale==="en" ? english : getTranslatedUi(locale); }

export function NowPreview({ locale = "en" }: Props) {
  const t=words(locale);
  const projects=getFeaturedNowProjects(locale);
  if(!projects.length) return null;
  return <section className="now-preview section-pad" id="now" aria-labelledby="now-preview-title">
    <div className="container">
      <div className="now-preview-heading">
        <span className="section-eyebrow"><span>06</span><span className="section-eyebrow-line"/>{t.nowEyebrow}</span>
        <div className="now-preview-heading-grid"><h2 id="now-preview-title">{t.nowPreviewTitle}</h2><p>{t.nowPreviewIntro}</p></div>
      </div>
      <div className="now-preview-grid">{projects.map((project,i)=><article className="now-preview-card" key={project.slug}>
        <div className="now-preview-card-top"><span>{String(i+1).padStart(2,"0")} / 03</span><span className="now-preview-indicator">{project.status}</span></div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="now-preview-card-bottom">
          <span>{t.nowSourceReviewed}: <time dateTime={project.sourceReviewedAt} dir="ltr">{project.sourceReviewedAt}</time></span>
          <Link href={localizePath(locale,"/projects/"+project.slug)} aria-label={t.nowProjectLink+": "+project.title}><ArrowUpRightIcon width="20" height="20"/></Link>
        </div>
      </article>)}</div>
      <div className="now-preview-bottom"><p>{t.nowPreviewDisclaimer}</p><Link className="button button-outline" href={localizePath(locale,"/now")}>{t.nowPreviewAction}<ArrowRightIcon width="18" height="18"/></Link></div>
    </div>
  </section>;
}

export function NowPageView({ locale = "en" }: Props) {
  const t=words(locale);
  const projects=getNowProjects(locale),focus=getNowFocus(locale),goals=getPublicLearningGoals();
  const explorerWords: ExplorerWords = {
    searchLabel:t.nowSearchLabel,searchPlaceholder:t.nowSearchPlaceholder,
    all:t.nowAll,showCount:t.nowCount,cleared:t.nowCleared,noResults:t.nowNoResults,clear:t.nowClear,
    sourceReviewed:t.nowSourceReviewed,nextCheck:t.nowNextCheck,caseStudy:t.nowProjectLink,noPercentage:t.nowNoPercentage,
  };
  return <main id="main" tabIndex={-1}>
    <section className="now-hero section-pad" aria-labelledby="now-page-title"><div className="container now-hero-layout">
      <div><div className="page-eyebrow"><span>05 /</span> {t.nowHeroEyebrow}</div>
        <h1 id="now-page-title">{t.nowHeroTitle}</h1><p className="now-hero-lead">{t.nowHeroIntro}</p>
        <a href="#now-projects" className="button button-primary">{t.nowOverviewLabel}<ArrowRightIcon width="18" height="18"/></a></div>
      <div className="now-hero-aside">
        <span className="now-hero-symbol" aria-hidden="true">✳</span>
        <span className="now-hero-number" aria-label={String(projects.length)+" "+t.nowOverviewCount}>{String(projects.length).padStart(2,"0")}</span>
        <span className="now-hero-aside-title">{t.nowOverviewCount}</span>
        <p>{t.nowHeroNote}</p>
      </div>
    </div></section>
    <section className="now-projects section-pad" id="now-projects" aria-labelledby="now-projects-title"><div className="container">
      <div className="now-section-heading"><span className="section-eyebrow"><span>01</span><span className="section-eyebrow-line"/>{t.nowOverviewLabel}</span>
        <div className="now-section-heading-grid"><h2 id="now-projects-title">{t.nowPreviewTitle}</h2><p>{t.nowOverviewReviewed}</p></div>
      </div>
      <NowExplorer projects={projects} locale={locale} words={explorerWords}/>
    </div></section>
    {focus.length>0 && <section className="now-focus section-pad" aria-labelledby="now-focus-title"><div className="container">
      <div className="now-section-heading"><span className="section-eyebrow"><span>02</span><span className="section-eyebrow-line"/>{t.nowFocusEyebrow}</span>
      <div className="now-section-heading-grid"><h2 id="now-focus-title">{t.nowFocusTitle}</h2><p>{t.nowFocusIntro}</p></div></div>
      <div className="now-focus-grid">{focus.map((item,i)=><article key={item.id} className="now-focus-card">
        <div className="now-focus-head"><span>{String(i+1).padStart(2,"0")}</span><span aria-hidden="true">↗</span></div>
        <h3>{item.title}</h3><p>{item.description}</p>
        <div className="now-focus-tech">{item.technologies.map(tech=><span key={tech} dir="ltr">{tech}</span>)}</div>
        <div className="now-focus-evidence"><strong>{t.nowFocusEvidence}</strong>{item.projects.map(project=><Link href={localizePath(locale,"/projects/"+project.slug)} key={project.slug}>{project.title}<ArrowUpRightIcon width="15" height="15"/></Link>)}</div>
      </article>)}</div>
    </div></section>}
    {goals.length>0 && <section className="now-learning section-pad" aria-labelledby="now-learning-title"><div className="container">
      <span className="section-eyebrow"><span>03</span><span className="section-eyebrow-line"/>{t.nowLearningEyebrow}</span>
      <h2 id="now-learning-title">{t.nowLearningTitle}</h2>
      <ul>{goals.map(goal=><li key={goal.id}><h3>{goal.title}</h3><p>{goal.note}</p></li>)}</ul>
    </div></section>}
    <section className="now-close section-pad" aria-labelledby="now-close-title"><div className="container">
      <h2 id="now-close-title">{t.nowClosingTitle}</h2><p>{t.nowClosingIntro}</p>
      <Link href={localizePath(locale,"/projects")} className="button button-primary">{t.nowClosingAction}<ArrowRightIcon width="18" height="18"/></Link>
    </div></section>
  </main>;
}
