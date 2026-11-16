import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { InquiryPlanner } from "@/components/inquiry-planner";
import { getServices } from "@/lib/services";
import { getTranslatedUi } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n-core.mjs";
import { getPublicIdentity } from "@/lib/public-identity";
import { contactConfig } from "@/lib/phase08-core.mjs";
import type { InquiryFocus, InquiryLabels } from "@/lib/inquiry-core.mjs";

type Locale="en"|"fa"|"ps";
const english={
  inquiryEyebrow:"START WITH A CLEAR BRIEF",inquiryTitle:"Turn an idea into a useful conversation.",
  inquiryIntro:"Whether it's a software role, a scoped product project or technical collaboration, outline what matters before choosing a contact method.",
  inquiryEmployment:"Engineering role",inquiryEmploymentDesc:"Discuss a role, team needs or a technical position.",
  inquiryContract:"Project or contract",inquiryContractDesc:"Talk through a product problem or defined implementation scope.",
  inquiryCollaboration:"Technical collaboration",inquiryCollaborationDesc:"Explore research, learning or a shared engineering direction.",
  inquiryFocus:"Technical focus",inquiryFocusUnsure:"Not sure yet",inquiryTiming:"Potential timing",
  inquiryFlexible:"Flexible",inquirySoon:"Soon",inquiryLater:"At a later stage",
  inquiryGoal:"Role or project goal",inquiryGoalHint:"For example: Frontend engineering position",
  inquiryDetails:"A little context",inquiryDetailsHint:"Describe the challenge, team or product goals, and the kind of help you want to discuss.",
  inquiryPreview:"Your draft inquiry",inquiryPreviewIntro:"A brief appears here after you complete the form. It stays on your device until you choose to copy or send it through an available channel.",
  inquiryGenerate:"Prepare the brief",inquiryCopy:"Copy brief",inquiryCopied:"Brief copied to clipboard.",
  inquiryCopyManual:"Automatic copying is unavailable. Select the draft above and copy it manually.",
  inquiryInvalid:"Add a clear goal (6+ characters) and context (20+ characters).",
  inquiryNotSent:"This is a local drafting tool, not a message submission. Do not include confidential, medical or student data.",
  inquiryOpenEmail:"Open email app",inquiryUseForm:"Use contact form",inquiryFormReady:"Brief added to the contact form below. Review it and send explicitly.",
  inquiryReady:"Draft ready. It has not been sent.",
  inquiryQuestionTitle:"A few practical details",inquiryQuestionIntro:"Useful context before reaching out. No invented prices, availability, turnaround times or promises.",
  inquiryFaq1:"Does this portfolio represent commercial client deliveries?",inquiryFaq1Body:"These case studies document independent projects and engineering exploration. They are not presented as commissioned client projects or verified production deployments.",
  inquiryFaq2:"Which kinds of engineering conversations make sense?",inquiryFaq2Body:"Web and mobile interfaces, backend APIs, database work, full-stack systems and product workflow improvements are represented by the linked portfolio examples.",
  inquiryFaq3:"Can I book a meeting or expect a fixed response time?",inquiryFaq3Body:"There is no scheduling or guaranteed response time on this website. Use an explicitly available contact channel if you would like to begin a conversation.",
  inquiryFaq4:"What happens to the details entered above?",inquiryFaq4Body:"The brief stays in this browser page, without a portfolio backend request. Copying uses your device's clipboard. Sending through an enabled contact form or your email app is a separate, explicit action.",
  inquiryProofTitle:"See the work behind each capability.",inquiryProofBody:"Six capability areas are linked to the existing project case studies. The examples are evidence of practice, not guarantees of a service outcome.",
  inquiryProofAction:"Browse capabilities",
};
type Words=typeof english;
const keys=["web","mobile","backend","data","fullstack","improvements"] as const;
function labels(t:Words,focusOptions:{id:InquiryFocus;title:string}[]):InquiryLabels{
  const focus=Object.fromEntries(focusOptions.map(v=>[v.id,v.title])) as InquiryLabels["focus"];
  return {intent:{employment:t.inquiryEmployment,contract:t.inquiryContract,collaboration:t.inquiryCollaboration},
    focus:{...focus,unsure:t.inquiryFocusUnsure},
    timing:{flexible:t.inquiryFlexible,soon:t.inquirySoon,later:t.inquiryLater},
    headings:{type:t.inquiryEyebrow,focus:t.inquiryFocus,timing:t.inquiryTiming,goal:t.inquiryGoal,details:t.inquiryDetails},
    subjectPrefix:t.inquiryEyebrow};
}
export function CollaborationSection({locale="en"}:{locale?:Locale}){
  const t:Words=locale==="en"?english:getTranslatedUi(locale);
  const services=getServices(locale,"full");
  const focusOptions=services.filter(s=>keys.includes(s.id as typeof keys[number]))
    .map(s=>({id:s.id as InquiryFocus,title:s.title}));
  const email=getPublicIdentity().email??null,formEnabled=contactConfig().enabled;
  const questions=[{title:t.inquiryFaq1,answer:t.inquiryFaq1Body},
    {title:t.inquiryFaq2,answer:t.inquiryFaq2Body},
    {title:t.inquiryFaq3,answer:t.inquiryFaq3Body},
    {title:t.inquiryFaq4,answer:t.inquiryFaq4Body}];
  return <section className="inquiry-section section-pad" id="inquiry-planner" aria-labelledby="inquiry-heading"><div className="container">
    <div className="inquiry-heading"><span className="section-eyebrow"><span>01</span><span className="section-eyebrow-line"/>{t.inquiryEyebrow}</span>
      <div className="inquiry-heading-grid"><h2 id="inquiry-heading">{t.inquiryTitle}</h2><p>{t.inquiryIntro}</p></div></div>
    <InquiryPlanner words={t} labels={labels(t,focusOptions)} focusOptions={focusOptions} email={email} formEnabled={formEnabled}/>
    <div className="inquiry-faq" aria-labelledby="inquiry-faq-title">
      <div><h2 id="inquiry-faq-title">{t.inquiryQuestionTitle}</h2><p>{t.inquiryQuestionIntro}</p>
        <Link href={localizePath(locale,"/services")} className="inline-direction">{t.inquiryProofAction} <ArrowRightIcon width="18" height="18"/></Link></div>
      <div className="inquiry-faq-list">{questions.map((item,i)=><details key={item.title} className="inquiry-faq-item">
        <summary><span>0{i+1}</span>{item.title}<span aria-hidden="true" className="inquiry-faq-plus">+</span></summary>
        <p>{item.answer}</p></details>)}</div>
    </div>
    <div className="inquiry-proof"><p><strong>{t.inquiryProofTitle}</strong> {t.inquiryProofBody}</p>
      <Link className="button button-outline" href={localizePath(locale,"/projects")}>{t.inquiryProofAction} <ArrowRightIcon width="17" height="17"/></Link></div>
  </div></section>;
}
