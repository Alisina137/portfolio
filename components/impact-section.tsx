import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { ImpactCards, ImpactExplorer, type ImpactWords } from "@/components/impact-explorer";
import { getEvidenceTotals, getImpactHighlights, getReviewedOutcomes, type ImpactLocale } from "@/lib/impact";
import { getTranslatedUi } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n-core.mjs";

const en={
 impact:"Impact",impactEyebrow:"ENGINEERING EVIDENCE",impactTitle:"Proof over promises.",
 impactIntro:"Documented technical work, linked to its source. These are repository and case-study facts—not user growth, revenue, employment or measured business impact.",
 impactMetricCases:"Documented product case studies",impactMetricRepos:"Linked public project repositories",impactMetricDomains:"Product domains represented",
 impactMetricFoot:"Counts are computed from the currently published portfolio records and reviewed public GitHub links. They are not production releases, paying clients or adoption figures.",
 impactEvidence:"Explore supporting evidence",impactSource:"Source on GitHub",impactCase:"Read case study",impactExplore:"Explore evidence & outcomes",
 impactAll:"All focus areas",impactEngineering:"Engineering systems",impactProducts:"Product workflows",impactFilter:"Filter engineering evidence",
 impactCount:"Showing {count} of {total} evidence areas",impactNoMatches:"Nothing matches this filter.",impactClear:"Show all",
 impactPreviewFoot:"Highlights are supported by project documentation, not independently measured production results.",
 impactHeroEyebrow:"ACHIEVEMENTS / IMPACT",impactHeroTitle:"What the work actually demonstrates.",
 impactHeroIntro:"A transparent portfolio of technical explorations, documented project scope and links you can inspect—not invented performance statistics.",
 impactHeroKicker:"SOURCE REVIEWED / EVIDENCE LINKED",
 impactFullTitle:"The technical record.",impactFullIntro:"Every highlighted engineering pattern points to real project descriptions and code repositories.",
 impactResultsTitle:"Measurable results",impactResultsIntro:"Only owner-approved and independently reviewed outcomes are shown here with a clear period, method and source.",
 impactResultsEmpty:"No user adoption, revenue, time-savings or customer outcome metrics have been validated for public display yet.",
 impactResultsMethod:"Measurement method",impactResultsPeriod:"Measurement period",impactResultsSource:"View reviewed source",
 impactFooterTitle:"Explore the work behind the summary.",impactFooterIntro:"Read the full project case studies and decide what the available evidence shows.",impactFooterLink:"Browse all projects",
};
function getWords(locale:ImpactLocale){return locale==="en"?en:getTranslatedUi(locale);}
function totals(locale:ImpactLocale){
 const t=getWords(locale),numbers=getEvidenceTotals();
 return [
  {value:numbers.cases,label:t.impactMetricCases},
  {value:numbers.repositories,label:t.impactMetricRepos},
  {value:numbers.domains,label:t.impactMetricDomains}
 ];
}
function Snapshot({locale}:{locale:ImpactLocale}){
 return <div className="impact-metrics">{totals(locale).map(metric=><div className="impact-metric" key={metric.label}>
  <strong dir="ltr">{metric.value.toLocaleString(locale)}</strong><span>{metric.label}</span>
 </div>)}</div>;
}
function words(locale:ImpactLocale):ImpactWords{
 const t=getWords(locale);
 return {impactEvidence:t.impactEvidence,impactSource:t.impactSource,impactCase:t.impactCase,impactExplore:t.impactExplore,
   impactAll:t.impactAll,impactEngineering:t.impactEngineering,impactProducts:t.impactProducts,
   impactFilter:t.impactFilter,impactCount:t.impactCount,impactNoMatches:t.impactNoMatches,impactClear:t.impactClear};
}
export function ImpactPreview({locale="en"}:{locale?:ImpactLocale}){
 const t=getWords(locale),cards=getImpactHighlights(locale,"preview");
 return <section className="impact-preview section-pad" id="impact" aria-labelledby="impact-heading"><div className="container">
  <div className="impact-section-heading"><span className="section-eyebrow"><span>08</span><span className="section-eyebrow-line"/>{t.impactEyebrow}</span>
   <div className="impact-heading-row"><h2 id="impact-heading">{t.impactTitle}</h2><p>{t.impactIntro}</p></div>
  </div>
  <Snapshot locale={locale}/>
  <p className="impact-metric-note">{t.impactMetricFoot}</p>
  <ImpactCards records={cards} locale={locale} words={words(locale)}/>
  <div className="impact-preview-end"><p>{t.impactPreviewFoot}</p><Link href={localizePath(locale,"/impact")} className="button button-outline">{t.impactExplore}<ArrowRightIcon width="18" height="18"/></Link></div>
 </div></section>;
}
export function ImpactPageView({locale="en"}:{locale?:ImpactLocale}){
 const t=getWords(locale),cards=getImpactHighlights(locale),outcomes=getReviewedOutcomes();
 return <main id="main" tabIndex={-1}>
   <section className="impact-hero section-pad" aria-labelledby="impact-hero-heading"><div className="container impact-hero-grid">
    <div><span className="page-eyebrow"><span>07 /</span> {t.impactHeroEyebrow}</span><h1 id="impact-hero-heading">{t.impactHeroTitle}</h1><p>{t.impactHeroIntro}</p>
      <a href="#impact-record" className="button button-primary">{t.impactExplore}<ArrowRightIcon width="17" height="17"/></a>
    </div>
    <div className="impact-hero-visual" aria-label={t.impactHeroKicker} role="img"><span className="impact-visual-grid" aria-hidden="true"/>
      <span className="impact-visual-node impact-visual-node--one"/><span className="impact-visual-node impact-visual-node--two"/><span className="impact-visual-node impact-visual-node--three"/>
      <span className="impact-visual-line impact-visual-line--one"/><span className="impact-visual-line impact-visual-line--two"/>
      <div className="impact-visual-center"><span>CODE</span><strong>↗</strong><span>EVIDENCE</span></div>
      <span className="impact-visual-foot" dir="ltr">BUILD / REVIEW / LEARN</span>
    </div>
   </div></section>
   <section className="impact-report section-pad" id="impact-record" aria-labelledby="impact-record-heading"><div className="container">
    <div className="impact-section-heading"><span className="section-eyebrow"><span>01</span><span className="section-eyebrow-line"/>{t.impactEyebrow}</span>
      <div className="impact-heading-row"><h2 id="impact-record-heading">{t.impactFullTitle}</h2><p>{t.impactFullIntro}</p></div></div>
    <Snapshot locale={locale}/><p className="impact-metric-note">{t.impactMetricFoot}</p>
    <ImpactExplorer records={cards} locale={locale} words={words(locale)}/>
   </div></section>
   <section className="impact-results section-pad" aria-labelledby="impact-results-title"><div className="container impact-results-inner">
    <div><span className="section-eyebrow"><span>02</span><span className="section-eyebrow-line"/>{t.impactEyebrow}</span><h2 id="impact-results-title">{t.impactResultsTitle}</h2><p>{t.impactResultsIntro}</p></div>
    {outcomes.length? <div className="impact-results-grid">{outcomes.map(item=><article key={item.id} className="impact-result-card"><strong dir="ltr">{item.value.toLocaleString(locale)} {item.unit}</strong><h3>{item.title}</h3>
      <p>{t.impactResultsPeriod}: {item.timeframe}</p><details><summary>{t.impactResultsMethod}</summary><p>{item.methodology}</p></details>
      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{t.impactResultsSource}<ArrowUpRightIcon width="16" height="16"/></a></article>)}</div>
     :<div className="impact-results-empty"><span aria-hidden="true">∅</span><p>{t.impactResultsEmpty}</p></div>}
   </div></section>
   <section className="impact-close section-pad" aria-labelledby="impact-close-heading"><div className="container"><h2 id="impact-close-heading">{t.impactFooterTitle}</h2><p>{t.impactFooterIntro}</p>
    <Link href={localizePath(locale,"/projects")} className="button button-primary">{t.impactFooterLink}<ArrowRightIcon width="18" height="18"/></Link>
   </div></section>
 </main>;
}
