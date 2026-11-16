import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { getServices } from "@/lib/services";
import { getPublicIdentity } from "@/lib/public-identity";
import { getPublicAvailability } from "@/lib/availability";
import { getTranslatedUi } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n-core.mjs";
import type { PublicAvailability, AvailabilityStatus, EmploymentType, WorkMode, WorkRegion, FocusArea } from "@/lib/availability-core.mjs";

type Locale="en"|"fa"|"ps";
const english={
  availability:"Availability",
  availabilityEyebrow:"PROFESSIONAL OPPORTUNITIES",
  availabilityPreviewTitle:"The right fit starts with the work.",
  availabilityPreviewIntro:"A clear view of the engineering areas represented in this portfolio, with professional availability stated only when it has been personally reviewed.",
  availabilityExplore:"Explore opportunity fit",
  availabilityHeroTitle:"Let's find the right fit.",
  availabilityHeroIntro:"Explore professional availability, preferred arrangements where approved, and the code-backed engineering work behind each focus area.",
  availabilityStatusLabel:"CURRENT PUBLIC STATUS",
  availabilityPending:"Availability not publicly confirmed",
  availabilityPendingBody:"A current, owner-approved availability statement has not been published. This is not a claim that I am accepting or declining offers.",
  availabilityOpen:"Open to opportunities",
  availabilitySelective:"Considering selected opportunities",
  availabilityUnavailable:"Not currently accepting new opportunities",
  availabilityApprovedNote:"This status was explicitly reviewed and is displayed only until its expiry date. It is not an appointment or response-time guarantee.",
  availabilityReviewed:"Reviewed",
  availabilityUntil:"Valid through",
  availabilityType:"Employment types",
  availabilityMode:"Work arrangements",
  availabilityRegion:"Location scope",
  availabilityFocus:"Technical areas",
  availabilityFullTime:"Full-time",
  availabilityPartTime:"Part-time",
  availabilityContract:"Contract / freelance",
  availabilityInternship:"Internship",
  availabilityRemote:"Remote",
  availabilityHybrid:"Hybrid",
  availabilityOnSite:"On-site",
  availabilityAfghanistan:"Across Afghanistan",
  availabilityInternational:"International remote",
  availabilityEvidenceEyebrow:"WHAT THE WORK SHOWS",
  availabilityEvidenceTitle:"Capabilities, with project evidence.",
  availabilityEvidenceIntro:"Each area below connects to documented portfolio projects, rather than unverified claims about past employers or commercial deliveries.",
  availabilityProject:"View case study",
  availabilityConversationTitle:"A useful next conversation.",
  availabilityConversationBody:"Discuss an engineering role, a practical product problem, or technical collaboration through the contact options that are actually available.",
  availabilityContact:"Start an inquiry",
  availabilityContactNote:"No scheduling system, hiring commitment, fixed turnaround or guaranteed reply is implied.",
  availabilityResume:"Approved résumé (PDF)",
  availabilityLinkedIn:"Verified LinkedIn",
  availabilityGitHub:"Public GitHub",
};
type Words=typeof english;
function words(locale:Locale):Words{return locale==="en"?english:getTranslatedUi(locale);}
const typeKeys:Record<EmploymentType,keyof Words>={
  full_time:"availabilityFullTime",part_time:"availabilityPartTime",
  contract:"availabilityContract",internship:"availabilityInternship"
};
const modeKeys:Record<WorkMode,keyof Words>={
  remote:"availabilityRemote",hybrid:"availabilityHybrid",on_site:"availabilityOnSite"
};
const regionKeys:Record<WorkRegion,keyof Words>={
  afghanistan:"availabilityAfghanistan",international_remote:"availabilityInternational"
};
function StatusCopy({record,locale}:{record:PublicAvailability|null;locale:Locale}){
  const t=words(locale);
  const title:Record<Exclude<AvailabilityStatus,"not_shared">,string>={
    open:t.availabilityOpen,selective:t.availabilitySelective,unavailable:t.availabilityUnavailable
  };
  const status=record?.status??"not_shared";
  return <div className={"availability-status availability-status--"+status} aria-labelledby="availability-status-title">
    <div className="availability-status-line"><span className="availability-state-dot" aria-hidden="true"/>
      <span className="availability-status-eyebrow">{t.availabilityStatusLabel}</span></div>
    <h2 id="availability-status-title">{record?title[record.status]:t.availabilityPending}</h2>
    <p>{record?t.availabilityApprovedNote:t.availabilityPendingBody}</p>
    {record && <div className="availability-dates">
      <span>{t.availabilityReviewed}: <time dateTime={record.reviewedAt}>{record.reviewedAt}</time></span>
      <span>{t.availabilityUntil}: <time dateTime={record.validUntil}>{record.validUntil}</time></span>
    </div>}
    {record?.note&&<p className="availability-note">{record.note}</p>}
  </div>;
}
function Tags({title,items}:{title:string;items:string[]}){
  if(!items.length)return null;
  return <div className="availability-preference"><h3>{title}</h3><div className="availability-tag-list">
    {items.map(label=><span key={label}>{label}</span>)}</div></div>;
}
function PublicPreferences({record,locale}:{record:PublicAvailability|null;locale:Locale}){
  if(!record||record.status==="unavailable")return null;
  const t=words(locale);
  const services=getServices(locale,"full");
  const focus=new Map(services.map(item=>[item.id,item.title]));
  const focusLabels=record.focus.map(id=>focus.get(id)).filter((x):x is string=>typeof x==="string");
  return <div className="availability-preferences" aria-label={t.availabilityFocus}>
    <Tags title={t.availabilityType} items={record.employmentTypes.map(id=>t[typeKeys[id]])}/>
    <Tags title={t.availabilityMode} items={record.workModes.map(id=>t[modeKeys[id]])}/>
    <Tags title={t.availabilityRegion} items={record.regions.map(id=>t[regionKeys[id]])}/>
    <Tags title={t.availabilityFocus} items={focusLabels}/>
  </div>;
}
export function AvailabilityPreview({locale="en"}:{locale?:Locale}){
  const t=words(locale),record=getPublicAvailability();
  return <section id="availability" className="availability-preview section-pad" aria-labelledby="availability-preview-title">
    <div className="container availability-preview-grid">
      <div className="availability-preview-copy">
        <span className="section-eyebrow"><span className="section-eyebrow-line"/>{t.availabilityEyebrow}</span>
        <h2 id="availability-preview-title">{t.availabilityPreviewTitle}</h2>
        <p>{t.availabilityPreviewIntro}</p>
        <Link className="button button-outline" href={localizePath(locale,"/availability")}>
          {t.availabilityExplore} <ArrowRightIcon width="17" height="17"/></Link>
      </div>
      <div className="availability-preview-card"><span className="availability-preview-watermark" aria-hidden="true">↗</span>
        <span className="availability-status-eyebrow">{t.availabilityStatusLabel}</span>
        <strong>{record?record.status==="open"?t.availabilityOpen:record.status==="selective"?t.availabilitySelective:t.availabilityUnavailable:t.availabilityPending}</strong>
        <p>{record?t.availabilityApprovedNote:t.availabilityPendingBody}</p>
      </div>
    </div>
  </section>;
}
export function AvailabilityPageView({locale="en"}:{locale?:Locale}){
  const t=words(locale),record=getPublicAvailability(),identity=getPublicIdentity();
  const services=getServices(locale,"preview");
  return <main id="main" tabIndex={-1}>
    <section className="availability-hero section-pad" aria-labelledby="availability-title">
      <div className="container availability-hero-grid">
        <div><span className="page-eyebrow"><span>09 /</span> {t.availabilityEyebrow}</span>
          <h1 id="availability-title">{t.availabilityHeroTitle}</h1>
          <p>{t.availabilityHeroIntro}</p>
          <Link className="button button-primary" href={localizePath(locale,"/contact")+"#inquiry-planner"}>
            {t.availabilityContact} <ArrowRightIcon width="17" height="17"/></Link>
        </div>
        <div className="availability-hero-art" aria-hidden="true"><span className="availability-art-star">✳</span>
          <div className="availability-art-line"/><strong>SKILL<br/><span>×</span> CONTEXT</strong><small>ENGINEERING / OPPORTUNITIES</small>
        </div>
      </div>
    </section>
    <section className="availability-detail section-pad" aria-label={t.availabilityStatusLabel}>
      <div className="container"><StatusCopy record={record} locale={locale}/><PublicPreferences record={record} locale={locale}/></div>
    </section>
    <section className="availability-proof section-pad" aria-labelledby="availability-proof-title"><div className="container">
      <div className="availability-heading"><span className="section-eyebrow"><span>01</span><span className="section-eyebrow-line"/>{t.availabilityEvidenceEyebrow}</span>
        <div><h2 id="availability-proof-title">{t.availabilityEvidenceTitle}</h2><p>{t.availabilityEvidenceIntro}</p></div>
      </div>
      <div className="availability-proof-grid">{services.map((item,i)=><article key={item.id} className="availability-proof-card">
        <div className="availability-proof-top"><span>{String(i+1).padStart(2,"0")}</span><span aria-hidden="true">↗</span></div>
        <h3>{item.title}</h3><p>{item.summary}</p>
        {item.examples.slice(0,2).map(project=><Link key={project.slug} href={localizePath(locale,"/projects/"+project.slug)}>
          {project.title} <ArrowUpRightIcon width="16" height="16"/><span className="sr-only"> {t.availabilityProject}</span></Link>)}
      </article>)}</div>
    </div></section>
    <section className="availability-close section-pad" aria-labelledby="availability-close-title"><div className="container availability-close-inner">
      <span className="section-eyebrow"><span>02</span><span className="section-eyebrow-line"/>{t.availabilityEyebrow}</span>
      <h2 id="availability-close-title">{t.availabilityConversationTitle}</h2><p>{t.availabilityConversationBody}</p>
      <div className="availability-actions">
        <Link className="button button-primary" href={localizePath(locale,"/contact")+"#inquiry-planner"}>{t.availabilityContact} <ArrowRightIcon width="17" height="17"/></Link>
        {identity.resume&&<a className="button button-outline" href={identity.resume} target="_blank" rel="noopener noreferrer">{t.availabilityResume} <ArrowUpRightIcon width="17" height="17"/></a>}
        {identity.linkedIn&&<a className="button button-outline" href={identity.linkedIn} target="_blank" rel="noopener noreferrer">{t.availabilityLinkedIn} <ArrowUpRightIcon width="17" height="17"/></a>}
        {identity.github&&<a className="button button-outline" href={identity.github} target="_blank" rel="noopener noreferrer">{t.availabilityGitHub} <ArrowUpRightIcon width="17" height="17"/></a>}
      </div>
      <p className="availability-disclaimer">{t.availabilityContactNote}</p>
    </div></section>
  </main>;
}
