import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { getPublicTestimonials, type TestimonialLocale } from "@/lib/testimonials";
import { getTranslatedUi } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n-core.mjs";
import { TestimonialsExplorer, type TestimonialWords } from "@/components/testimonials-explorer";

const en = {
  testimonials:"Testimonials",testimonialEyebrow:"THIRD-PARTY PERSPECTIVES",
  testimonialPreviewTitle:"Trust should be earned.",testimonialPreviewIntro:"A place for firsthand perspectives from people who have actually worked with me. No anonymous or invented endorsements.",
  testimonialViewAll:"Explore recommendations",testimonialEmptyTitle:"No public recommendations yet.",
  testimonialEmptyBody:"I will share feedback here only after confirming the person's identity, reviewing the context and receiving written permission to publish their words.",
  testimonialBrowseWork:"Review documented work",testimonialHeroEyebrow:"RECOMMENDATIONS / REFERENCES",
  testimonialHeroTitle:"The work, through other eyes.",testimonialHeroIntro:"Genuine feedback belongs to its author. This page will show recommendations only when they have been verified, approved and cleared for public sharing.",
  testimonialRecordTitle:"Firsthand perspectives.",testimonialRecordIntro:"Endorsements are shown with their original wording, contributor context and any available project connection—never as anonymous ratings.",
  testimonialStandardsTitle:"How feedback is published",testimonialStandardsIntro:"A recommendation is not an advertisement. These safeguards protect both the contributor and the reader.",
  testimonialStepOne:"Confirm the person",testimonialStepOneDesc:"Check the identity and working relationship of the person sharing feedback.",
  testimonialStepTwo:"Obtain permission",testimonialStepTwoDesc:"Ask for explicit written consent to publish their name, role and original words.",
  testimonialStepThree:"Review the context",testimonialStepThreeDesc:"Verify the work described and keep unapproved or confidential information private.",
  testimonialFooterTitle:"Want to judge the work directly?",testimonialFooterIntro:"Explore project case studies and public source repositories while independent recommendations are being collected.",
  testimonialAll:"All",testimonialClient:"Clients",testimonialCollaborator:"Collaborators",testimonialColleague:"Colleagues",testimonialMentor:"Mentors",
  testimonialFilter:"Filter recommendations by relationship",testimonialCount:"Showing {count} of {total} recommendations",
  testimonialReadCase:"Related project",testimonialProfile:"Public profile",testimonialPermission:"Published with the contributor's permission",
  testimonialNoMatches:"No recommendations match that filter.",testimonialClear:"Show all",
};
function words(locale: TestimonialLocale){return locale === "en" ? en : getTranslatedUi(locale);}
function explorerWords(locale: TestimonialLocale): TestimonialWords {
  const t=words(locale);
  return {testimonialAll:t.testimonialAll,testimonialClient:t.testimonialClient,
    testimonialCollaborator:t.testimonialCollaborator,testimonialColleague:t.testimonialColleague,
    testimonialMentor:t.testimonialMentor,testimonialFilter:t.testimonialFilter,
    testimonialCount:t.testimonialCount,testimonialReadCase:t.testimonialReadCase,
    testimonialProfile:t.testimonialProfile,testimonialPermission:t.testimonialPermission,
    testimonialNoMatches:t.testimonialNoMatches,testimonialClear:t.testimonialClear};
}
function HonestEmpty({locale}:{locale:TestimonialLocale}){
  const t=words(locale);
  return <div className="testimonial-empty"><div className="testimonial-empty-symbol" aria-hidden="true"><span>“</span><i>✳</i></div>
    <div><span className="testimonial-empty-overline">00 / {t.testimonials}</span><h3>{t.testimonialEmptyTitle}</h3><p>{t.testimonialEmptyBody}</p>
      <Link className="inline-direction" href={localizePath(locale, "/projects")}>{t.testimonialBrowseWork}<ArrowRightIcon width="17" height="17"/></Link></div>
  </div>;
}
export function TestimonialsPreview({locale="en"}:{locale?:TestimonialLocale}){
  const t=words(locale), records=getPublicTestimonials(locale);
  return <section className="testimonials-preview section-pad" id="testimonials" aria-labelledby="testimonial-preview-title"><div className="container">
    <div className="testimonial-heading"><span className="section-eyebrow"><span>09</span><span className="section-eyebrow-line"/>{t.testimonialEyebrow}</span>
      <div className="testimonial-heading-row"><h2 id="testimonial-preview-title">{t.testimonialPreviewTitle}</h2><p>{t.testimonialPreviewIntro}</p></div>
    </div>
    {records.length ? <TestimonialsExplorer records={records.slice(0,2)} locale={locale} words={explorerWords(locale)} /> : <HonestEmpty locale={locale}/>}
    <div className="testimonial-preview-actions"><Link className="button button-outline" href={localizePath(locale,"/testimonials")}>{t.testimonialViewAll}<ArrowRightIcon width="17" height="17"/></Link></div>
  </div></section>;
}
export function TestimonialsPageView({locale="en"}:{locale?:TestimonialLocale}){
  const t=words(locale),records=getPublicTestimonials(locale);
  const steps=[
    {title:t.testimonialStepOne,body:t.testimonialStepOneDesc},
    {title:t.testimonialStepTwo,body:t.testimonialStepTwoDesc},
    {title:t.testimonialStepThree,body:t.testimonialStepThreeDesc},
  ];
  return <main id="main" tabIndex={-1}>
    <section className="testimonial-hero section-pad" aria-labelledby="testimonial-hero-title"><div className="container testimonial-hero-inner">
      <div><span className="page-eyebrow"><span>08 /</span> {t.testimonialHeroEyebrow}</span><h1 id="testimonial-hero-title">{t.testimonialHeroTitle}</h1><p>{t.testimonialHeroIntro}</p>
        <a className="button button-primary" href="#recommendations">{t.testimonialViewAll}<ArrowRightIcon width="17" height="17"/></a></div>
      <div className="testimonial-hero-art" role="img" aria-label={t.testimonialHeroTitle}><span className="testimonial-hero-symbol" aria-hidden="true">“</span>
        <span className="testimonial-hero-art-line" aria-hidden="true"/><span className="testimonial-hero-art-tag">WORDS / WITH PERMISSION</span><span className="testimonial-hero-glow" aria-hidden="true"/></div>
    </div></section>
    <section className="testimonial-records section-pad" id="recommendations" aria-labelledby="testimonial-records-title"><div className="container">
      <div className="testimonial-heading"><span className="section-eyebrow"><span>01</span><span className="section-eyebrow-line"/>{t.testimonials}</span>
        <div className="testimonial-heading-row"><h2 id="testimonial-records-title">{t.testimonialRecordTitle}</h2><p>{t.testimonialRecordIntro}</p></div></div>
      {records.length ? <TestimonialsExplorer records={records} locale={locale} words={explorerWords(locale)}/> : <HonestEmpty locale={locale}/>}
    </div></section>
    <section className="testimonial-standards section-pad" aria-labelledby="testimonial-standards-title"><div className="container">
      <div className="testimonial-heading"><span className="section-eyebrow"><span>02</span><span className="section-eyebrow-line"/>{t.testimonialStandardsTitle}</span>
        <div className="testimonial-heading-row"><h2 id="testimonial-standards-title">{t.testimonialStandardsTitle}</h2><p>{t.testimonialStandardsIntro}</p></div></div>
      <div className="testimonial-steps">{steps.map((step,i)=><article key={step.title}><span className="testimonial-step-index">0{i+1} /</span><h3>{step.title}</h3><p>{step.body}</p></article>)}</div>
    </div></section>
    <section className="testimonial-close section-pad" aria-labelledby="testimonial-close-title"><div className="container"><h2 id="testimonial-close-title">{t.testimonialFooterTitle}</h2><p>{t.testimonialFooterIntro}</p>
      <Link href={localizePath(locale,"/projects")} className="button button-primary">{t.testimonialBrowseWork}<ArrowRightIcon width="17" height="17"/></Link>
    </div></section>
  </main>;
}
