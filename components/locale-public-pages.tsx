import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProjectCard } from '@/components/project-card';
import { ProjectArtwork } from '@/components/project-artwork';
import { FeatureShowcase } from '@/components/feature-showcase';
import { ProjectGallery } from '@/components/project-gallery';
import { SectionHeading } from '@/components/section-heading';
import { SkillsSection } from '@/components/skills-section';
import { ExperienceTimeline } from '@/components/experience-timeline';
import { EducationSection } from '@/components/education-section';
import { ServicesSection } from '@/components/services-section';
import { NowPreview } from '@/components/now-section';
import { RepositoriesPreview } from '@/components/repositories-section';
import { ImpactPreview } from '@/components/impact-section';
import { TestimonialsPreview } from '@/components/testimonials-section';
import { AvailabilityPreview } from '@/components/availability-section';
import { CollaborationSection } from '@/components/collaboration-section';
import { ArrowRightIcon, ArrowUpRightIcon } from '@/components/icons';
import { LocaleCatalogExplorer } from '@/components/locale-catalog-explorer';
import { EmailContact } from '@/components/email-contact';
import { ContactForm } from '@/components/contact-form';
import { getFeaturedProjects, getPublishedProjects, getCaseStudy, getPublicProject, getRelatedProjects } from '@/lib/content';
import { getPublicIdentity } from '@/lib/public-identity';
import { contactConfig } from '@/lib/phase08-core.mjs';
import { getTranslatedUi, getTranslatedProject, getTranslatedCase } from '@/lib/i18n';
import { localizePath } from '@/lib/i18n-core.mjs';
import { returnToCatalog } from '@/lib/catalog';

type Locale = 'fa' | 'ps';
const projectHref = (locale: Locale, route: string) => localizePath(locale, route);
const methodIds = [1, 2, 3, 4] as const;
const focusSlugs = [ ['maktablink','bazaarlink'], ['futsal','kankorprep'], ['maktablink','amlaklink'], ['dandanlink','bazaarlink'] ];

export function LocaleHome({locale}:{locale:Locale}) {
  const u = getTranslatedUi(locale);
  const featured = getFeaturedProjects().map(p => getTranslatedProject(locale,p));
  return <main id="main" tabIndex={-1}>
    <section className="hero section-pad" aria-labelledby="hero-title"><div className="hero-halo" aria-hidden="true"/>
      <div className="container hero-inner"><div className="hero-content">
        <div className="hero-eyebrow"><span className="eyebrow-dash"/>{u.heroEyebrow}</div>
        <h1 id="hero-title">Alisina <span>Sarwari<span className="name-stop">.</span></span></h1>
        <p className="hero-headline">{u.heroHeadline}</p><p className="hero-description">{u.heroIntro}</p>
        <div className="hero-actions"><Link className="button button-primary" href={projectHref(locale,'/projects')}>{u.workCTA} <ArrowRightIcon/></Link><Link className="button button-outline" href={projectHref(locale,'/contact')}>{u.contactCTA} <ArrowRightIcon/></Link></div>
        <div className="hero-aside"><span className="hero-aside-line"/><span>{u.heroLocation}</span></div>
      </div><div className="hero-art" role="img" aria-label={u.heroAlt}>
        <div className="hero-art-badge"><span className="tiny-cross">✳</span><span>{u.artBadge}</span></div>
        <div className="hero-art-main"><span className="hero-art-crystal" aria-hidden="true"/><div className="hero-art-index">ALISINA STUDIO <span>001</span></div><div className="hero-art-letter" dir="ltr">A<span>S</span><span className="hero-art-spark">✳</span></div><div className="hero-art-rail"><span>{u.artThink}</span><span>{u.artBuild}</span></div></div>
        <div className="hero-art-floating floating-one"><span>01</span><strong>{u.artIdeas}</strong><span className="floating-arrow">↗</span></div>
        <div className="hero-art-floating floating-two"><span>02</span><strong>{u.artSystems}</strong><span className="floating-dot"/></div><div className="hero-art-bottom"><span>{u.artWork}</span><span>AS / 2026</span></div>
      </div></div><div className="container hero-supplement"><span className="scroll-cue"><span aria-hidden="true">↓</span> {u.heroScroll}</span><span>PORTFOLIO / 2026</span></div>
    </section>
    <section className="capabilities" aria-label={u.aboutFocusLabel}><div className="container capabilities-grid">{([['capWeb','capWebInfo'],['capMobile','capMobileInfo'],['capSystems','capSystemsInfo']] as const).map(([label,detail],i) => <div className="capability" key={label}><span className="capability-number">0{i+1} /</span><div><strong>{u[label]}</strong><span>{u[detail]}</span></div></div>)}</div></section>
    <section className="work-section section-pad" id="selected-work" aria-label={u.selectedLabel}><div className="container"><SectionHeading number="01" kicker={u.selectedLabel} title={u.selectedTitle} copy={u.selectedCopy}/><div className="projects-grid">{featured.map((p,i) => <ProjectCard project={p} locale={locale} index={i} key={p.slug} detailHref={projectHref(locale,`/projects/${p.slug}`)}/>)}</div><div className="work-note"><span className="work-note-asterisk">✳</span><p>{u.sourceNote}</p></div><div className="home-work-actions"><Link href={projectHref(locale,'/projects')} className="button button-outline">{u.allProjects} <ArrowRightIcon/></Link></div></div></section>
    <SkillsSection locale={locale} variant="home" />
    <ExperienceTimeline locale={locale} variant="home" />
    <EducationSection locale={locale} variant="home" />
    <ServicesSection locale={locale} variant="preview" />
    <NowPreview locale={locale} />
    <RepositoriesPreview locale={locale} />
    <ImpactPreview locale={locale} />
    <TestimonialsPreview locale={locale} />
    <AvailabilityPreview locale={locale} />
    <section className="approach-section section-pad" id="approach"><div className="container"><SectionHeading number="10" kicker={u.approachLabel} title={u.approachTitle} copy={u.approachCopy}/><div className="method-grid">{methodIds.map(i => <div className="method-card" key={i}><div className="method-top"><span>0{i}</span><span aria-hidden="true">↗</span></div><h3>{u[`method${i}`]}<span>.</span></h3><p>{u[`method${i}Desc`]}</p></div>)}</div></div></section>
    <section className="about-band section-pad" aria-labelledby="about-preview-title"><div className="container about-band-inner"><div className="about-band-aside"><span className="section-eyebrow"><span>11</span><span className="section-eyebrow-line"/>{u.aboutPreviewLabel}</span><div className="about-symbol" aria-hidden="true">A<span>S</span><i>✳</i></div></div><div className="about-band-copy"><h2 id="about-preview-title">{u.aboutPreviewTitle}</h2><p>{u.aboutPreviewBody}</p><Link className="inline-direction" href={projectHref(locale,'/about')}>{u.moreAbout} <ArrowRightIcon width="18" height="18"/></Link><div className="about-band-signoff"><span className="signature-bar"/><span>ALISINA SARWARI</span></div></div></div></section>
    <section className="closing-section section-pad" aria-labelledby="closing-title"><div className="container closing-inner"><span className="section-eyebrow"><span>12</span><span className="section-eyebrow-line"/>{u.closingLabel}</span><h2 id="closing-title">{u.closingTitle}</h2><p>{u.closingCopy}</p><Link href={projectHref(locale,'/contact')} className="button button-primary">{u.contactCTA} <ArrowRightIcon/></Link><span className="closing-decoration" aria-hidden="true">✳</span></div></section>
  </main>;
}

export function LocaleProjects({locale}:{locale:Locale}) {
  const u = getTranslatedUi(locale);
  const projects = getPublishedProjects().map(p => getTranslatedProject(locale,p));
  return <main id="main" tabIndex={-1}><section className="projects-page section-pad" aria-labelledby="projects-heading"><div className="container">
    <div className="page-eyebrow"><span>01 /</span> {u.catalogEyebrow}</div>
    <div className="projects-intro"><div><h1 id="projects-heading">{u.catalogTitle}</h1><p>{u.catalogIntro}</p></div><div className="projects-intro-aside"><strong>{String(projects.length).padStart(2,'0')}</strong><span>{u.publicCases}</span></div></div>
    <Suspense fallback={<div className="catalog-loading" role="status">{u.loading}</div>}><LocaleCatalogExplorer projects={projects} locale={locale}/></Suspense>
  </div></section></main>;
}

export async function LocaleCase({ locale, slug, back }: {locale:Locale;slug:string;back?:string|string[]}) {
  const u = getTranslatedUi(locale);
  const rawProject = getPublicProject(slug);
  const rawStudy = getCaseStudy(slug);
  if (!rawProject || !rawStudy) notFound();
  const project = getTranslatedProject(locale, rawProject);
  const study = getTranslatedCase(locale, rawStudy);
  const backPlain = returnToCatalog(back, getPublishedProjects());
  const backHref = projectHref(locale,backPlain);
  const backQuery = backPlain.includes('?') ? backPlain.split('?')[1] : '';
  const related = getRelatedProjects(rawProject).map(p=>getTranslatedProject(locale,p));
  const label = u[project.developmentStatus];
  return <main id="main" tabIndex={-1}><div className={`case-layout project-card--${project.motif}`}><div className="container">
    <nav aria-label={u.overview} className="case-breadcrumb"><Link href={backHref}>{u.projects}</Link><span aria-hidden="true">/</span><span aria-current="page" dir="auto">{project.title}</span></nav>
    <header className="case-hero"><div className="case-hero-copy"><div className="page-eyebrow"><span>{u.caseEyebrow} /</span> {project.eyebrow}</div><h1 dir="auto">{project.title}<span>.</span></h1><p className="case-hero-summary">{project.oneLiner}</p><div className="case-hero-status"><span className="status"><span className="status-indicator"/>{label}</span><span>{u.sourceReviewed}</span></div></div>
    <div className="case-hero-media"><ProjectArtwork project={project} large labels={{alt:u.heroAlt,top:u.artTop,visual:u.artVisual}}/><p className="case-hero-caption">{u.notScreenshot}</p></div></header>
    <div className="case-facts" aria-label={u.caseEyebrow}><div><span>{u.caseType}</span><strong>{study.productType}</strong></div><div><span>{u.caseRole}</span><strong>{project.ownerRole}</strong></div><div><span>{u.casePlatforms}</span><strong>{study.platforms.join(' · ')}</strong></div><div><span>{u.caseTech}</span><strong dir="ltr">{project.technologies.join(' · ')}</strong></div></div>
    <div className="case-body-layout"><aside className="case-sidebar" aria-label={u.onThisPage}><span>{u.onThisPage}</span><a href="#context">{u.overview}</a><a href="#built">{u.whatBuilt}</a><a href="#technical">{u.technical}</a><a href="#gallery">{u.gallery}</a><a href="#tradeoffs">{u.tradeoffs}</a><a href="#status">{u.currentState}</a><Link href={backHref}>← {u.allProjectsBack}</Link></aside>
      <div className="case-story">
        <section className="case-section" id="context"><div className="case-section-label">01 / {u.contextLabel}</div><h2>{u.contextTitle}</h2>{study.problem.map((paragraph,i)=><p key={i}>{paragraph}</p>)}<div className="case-audience"><span>{u.audienceLabel}</span><p>{study.audience}</p></div></section>
        <section className="case-section" id="built"><div className="case-section-label">02 / {u.experienceLabel}</div><h2>{u.experienceTitle}</h2><FeatureShowcase projectSlug={project.slug} features={study.features} locale={locale} conceptualLabel={u.notScreenshot} technicalLabel={u.technical}/></section>
        <section className="case-section" id="technical"><div className="case-section-label">03 / {u.engineeringLabel}</div><h2>{u.engineeringTitle}</h2><p className="case-section-lead">{u.engineeringLead}</p><div className="case-tech-grid">{study.technicalNotes.map(f=><article key={f.title}><span aria-hidden="true">⌁</span><h3>{f.title}</h3><p>{f.description}</p></article>)}</div></section>
        <ProjectGallery projectTitle={project.title} features={study.features} items={study.media} locale={locale}/>
        <section className="case-section" id="tradeoffs"><div className="case-section-label">05 / {u.reflectionLabel}</div><h2>{u.reflectionTitle}</h2><div className="case-tradeoffs">{study.tradeoffs.map(f=><article key={f.title}><h3>{f.title}</h3><p>{f.description}</p></article>)}</div></section>
        <section className="case-section" id="status"><div className="case-section-label">06 / {u.projectStatusLabel}</div><h2>{u.projectStatusTitle}</h2><span className="status"><span className="status-indicator"/>{label}</span><p>{study.currentState}</p><h3 className="case-next-title">{u.nextSteps}</h3><ul className="case-next-list">{study.nextSteps.map(step=><li key={step}>{step}</li>)}</ul><p className="case-review-note">{study.sourceEvidence} {u.sourceDisclaimer}</p></section>
        <section className="case-links" aria-label={u.sourceTitle}><div><h2>{u.sourceTitle}</h2><p>{u.sourceDemoNote}</p></div>{project.repoUrlVerified && project.repoUrl && <a className="button button-primary" href={project.repoUrl} target="_blank" rel="noopener noreferrer">{u.codeGitHub} <ArrowUpRightIcon/><span className="sr-only">({u.newTab})</span></a>}</section>
      </div></div>
    <div className="case-contact-inline"><div><span className="page-eyebrow">{u.relatedIdea}</span><p>{u.relatedIdeaBody}</p></div><Link href={projectHref(locale,'/contact')} className="button button-outline">{u.contactCTA} <ArrowRightIcon/></Link></div>
    <section className="case-related" aria-labelledby="related-heading"><div className="case-related-heading"><div><span className="page-eyebrow">{u.moreWork}</span><h2 id="related-heading">{u.keepExploring}</h2></div><Link href={backHref}>{u.backCatalog} <ArrowRightIcon width="17" height="17"/></Link></div><div className="case-related-grid">{related.map(p=><Link className="case-related-card" key={p.slug} href={`${projectHref(locale,`/projects/${p.slug}`)}${backQuery ? `?back=${encodeURIComponent(backQuery)}` : ''}`}><span>{p.eyebrow}</span><strong>{p.title}<i>.</i></strong><p>{p.oneLiner}</p><span className="case-related-arrow">{u.caseRead} ↗</span></Link>)}</div></section>
  </div></div></main>;
}

export function LocaleAbout({locale}:{locale:Locale}) {
  const u=getTranslatedUi(locale);
  const identity=getPublicIdentity();
  const bySlug=new Map(getPublishedProjects().map(p=>[p.slug,p]));
  return <main id="main" tabIndex={-1}>
    <section className="identity-hero section-pad" aria-labelledby="about-title"><div className="container identity-hero-grid"><div className="identity-intro"><div className="page-eyebrow"><span>02 /</span> {u.aboutEyebrow}</div><h1 id="about-title">{u.aboutTitle}</h1><p className="identity-lead">{u.aboutLead.replace('{name}',identity.name)}</p><p className="identity-supporting">{u.aboutBio}</p><div className="identity-actions"><Link className="button button-primary" href={projectHref(locale,'/projects')}>{u.workCTA} <ArrowRightIcon/></Link><Link className="button button-outline" href={projectHref(locale,'/contact')}>{u.contactCTA} <ArrowRightIcon/></Link></div></div><div className="identity-portrait" role="img" aria-label={u.heroAlt}><span className="identity-portrait-meta">{u.artBadge}</span><div className="identity-portrait-mark" dir="ltr" aria-hidden="true">A<span>S</span><i>✳</i></div><div className="identity-portrait-foot"><span>{u.artBadge}</span><span>AFGHANISTAN</span></div><span className="identity-portrait-outline" aria-hidden="true"/></div></div></section>
    <section className="about-focus section-pad" aria-labelledby="focus-title"><div className="container"><div className="about-section-heading"><span className="page-eyebrow"><span>01 /</span> {u.aboutFocusLabel}</span><h2 id="focus-title">{u.aboutFocusTitle}</h2><p>{u.aboutFocusIntro}</p></div><div className="focus-grid">{methodIds.map(i=><article className="focus-card" key={i}><div className="focus-card-top"><span>0{i}</span><span>{u[`focus${i}Cat`]}</span></div><h3>{u[`focus${i}`]}<span>.</span></h3><p className="focus-card-summary">{u[`focus${i}Sum`]}</p><p className="focus-card-detail">{u[`focus${i}Detail`]}</p><div className="focus-card-links" aria-label={u.projectCases}>{focusSlugs[i-1].map(slug=>bySlug.get(slug)).filter(p=>p!==undefined).map(p=><Link href={projectHref(locale,`/projects/${p.slug}`)} key={p.slug}>{p.title}<span aria-hidden="true">↗</span></Link>)}</div></article>)}</div><div className="services-about-link"><Link className="button button-outline" href={projectHref(locale,"/services")}>{u.serviceAll} <ArrowRightIcon width="17" height="17" /></Link><Link className="button button-outline" href={projectHref(locale,"/now")}>{u.nowPreviewAction} <ArrowRightIcon width="17" height="17" /></Link><Link className="button button-outline" href={projectHref(locale,"/repositories")}>{u.repoPreviewAction} <ArrowRightIcon width="17" height="17" /></Link><Link className="button button-outline" href={projectHref(locale,"/impact")}>{u.impactExplore} <ArrowRightIcon width="17" height="17" /></Link><Link className="button button-outline" href={projectHref(locale,"/testimonials")}>{u.testimonialViewAll} <ArrowRightIcon width="17" height="17" /></Link><Link className="button button-outline" href={projectHref(locale,"/availability")}>{u.availabilityExplore} <ArrowRightIcon width="17" height="17" /></Link></div></div></section>
    <SkillsSection locale={locale} variant="about" />
    <ExperienceTimeline locale={locale} variant="about" />
    <EducationSection locale={locale} variant="about" />
    <section className="about-process section-pad" aria-labelledby="process-title"><div className="container"><div className="about-section-heading"><span className="page-eyebrow"><span>05 /</span> {u.aboutProcessLabel}</span><h2 id="process-title">{u.aboutProcessTitle}</h2><p>{u.aboutProcessIntro}</p></div><div className="about-process-list">{methodIds.map(i=><article key={i}><span>0{i}</span><h3>{u[`process${i}`]}</h3><p>{u[`process${i}Copy`]}</p></article>)}</div></div></section>
    <section className="about-close section-pad"><div className="container about-close-inner"><span className="page-eyebrow"><span>06 /</span> {u.aboutCloseLabel}</span><h2>{u.aboutCloseTitle}</h2><p>{u.aboutCloseCopy}</p><div className="about-close-actions"><Link className="button button-primary" href={projectHref(locale,'/contact')}>{u.contact} <ArrowRightIcon/></Link>{identity.resume && <a className="button button-outline" href={identity.resume} target="_blank" rel="noopener noreferrer">{u.viewResume} <ArrowUpRightIcon/></a>}{identity.github && <a className="button button-outline" href={identity.github} target="_blank" rel="noopener noreferrer">{u.githubProfile} <ArrowUpRightIcon/></a>}</div></div></section>
  </main>;
}

export function LocaleContact({locale}:{locale:Locale}) {
  const u=getTranslatedUi(locale);
  const identity=getPublicIdentity();
  const contact=contactConfig();
  return <main id="main" tabIndex={-1}>
    <section className="contact-hero section-pad" aria-labelledby="contact-title"><div className="container contact-hero-grid"><div><div className="page-eyebrow"><span>03 /</span> {u.contactEyebrow}</div><h1 id="contact-title">{u.contactTitle}</h1><p className="contact-intro">{u.contactIntro}</p><div className="contact-context"><span className="contact-context-dot" aria-hidden="true"/><span>{u.basedIn.replace('{place}',locale==='fa'?'افغانستان':'افغانستان')}</span></div><Link className="contact-availability-link" href={projectHref(locale,"/availability")}>{u.availabilityExplore} <ArrowRightIcon width="17" height="17"/></Link></div><div className="contact-orbit" aria-hidden="true"><span className="contact-orbit-large">✳</span><span className="contact-orbit-line"/><span className="contact-orbit-tag">{u.contactIdeas}</span></div></div></section>
    <CollaborationSection locale={locale}/>
    <section className="contact-methods section-pad" id="contact-methods" aria-labelledby="contact-methods-title"><div className="container"><div className="contact-method-header"><span className="page-eyebrow"><span>01 /</span> {u.contactStep}</span><h2 id="contact-methods-title">{u.contactMethodTitle}</h2></div><div className="contact-method-grid">
      {contact.enabled ? <ContactForm siteKey={contact.siteKey} locale={locale}/> : identity.email ? <EmailContact email={identity.email} locale={locale}/> : <section className="contact-pending-card" aria-labelledby="contact-pending-title"><div className="contact-card-icon" aria-hidden="true">↗</div><span className="contact-card-eyebrow">{u.contactPendingTag}</span><h3 id="contact-pending-title">{u.contactPendingTitle}</h3><p>{u.contactPendingBody}</p>{identity.github && <a className="button button-primary" href={identity.github} target="_blank" rel="noopener noreferrer">{u.visitGitHub} <ArrowUpRightIcon/></a>}<p className="contact-pending-note">{u.contactPendingNote}</p></section>}
      <div className="contact-network" aria-label={u.aroundWeb}><span className="contact-card-eyebrow">{u.aroundWeb}</span><h3>{u.morePlaces}</h3><p>{u.morePlacesCopy}</p>{identity.github && <a href={identity.github} target="_blank" rel="noopener noreferrer"><span className="network-symbol" aria-hidden="true">GH</span><span><strong>GitHub</strong><small>{u.reposSource}</small></span><ArrowUpRightIcon width="18" height="18"/></a>}{identity.linkedIn && <a href={identity.linkedIn} target="_blank" rel="noopener noreferrer"><span className="network-symbol" aria-hidden="true">in</span><span><strong>LinkedIn</strong><small>{u.professionalProfile}</small></span><ArrowUpRightIcon width="18" height="18"/></a>}<Link href={projectHref(locale,'/projects')}><span className="network-symbol" aria-hidden="true">↗</span><span><strong>{u.projectCases}</strong><small>{u.projectCasesDesc}</small></span><ArrowRightIcon width="18" height="18"/></Link>{identity.resume && <a href={identity.resume} target="_blank" rel="noopener noreferrer"><span className="network-symbol" aria-hidden="true">PDF</span><span><strong>{u.viewResume}</strong><small>{u.approvedBackground}</small></span><ArrowUpRightIcon width="18" height="18"/></a>}</div>
    </div><p className="contact-privacy">{contact.enabled?u.contactPrivacyForm:u.contactPrivacy}</p></div></section>
    <section className="contact-bottom section-pad"><div className="container contact-bottom-inner"><span className="page-eyebrow"><span>02 /</span> {u.contactExplore}</span><h2>{u.contactCloser}</h2><p>{u.contactCloserBody}</p><Link href={projectHref(locale,'/projects')} className="button button-outline">{u.browseProjects} <ArrowRightIcon/></Link></div></section>
  </main>;
}
