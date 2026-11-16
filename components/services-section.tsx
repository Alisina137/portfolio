
import Link from "next/link";
import type { SVGProps } from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { getPublicIdentity } from "@/lib/public-identity";
import { getServices, type ServiceCategory, type ServiceLocale } from "@/lib/services";
import { getTranslatedUi } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n-core.mjs";

type Props = { locale?: ServiceLocale; variant?: "preview" | "full" };

const english = {
  services: "Services",
  serviceEyebrow: "WHAT I CAN BUILD",
  serviceTitle: "Practical engineering, from idea to interface.",
  serviceIntro: "Six areas of software work, illustrated through real portfolio case studies. Explore the systems and product workflows behind each capability.",
  servicePreviewNote: "Examples reflect evolving independent products, not commissioned client work or verified public releases.",
  serviceScope: "AREAS OF WORK",
  serviceTools: "TOOLS IN THESE PROJECTS",
  serviceEvidence: "RELATED PROJECTS",
  serviceExample: "View case study",
  serviceAll: "Explore all six capabilities",
  serviceContact: "Discuss a project",
  serviceContactDetail: "Contact options are shown only when approved. You can still explore the work and GitHub profile.",
  serviceHeroEyebrow: "SERVICES / CAPABILITIES",
  serviceHeroTitle: "What I can help build.",
  serviceHeroIntro: "From web applications and mobile interfaces to backend systems and product improvements, these are the areas explored in my software projects.",
  serviceHeroTag: "ENGINEERING / PRODUCT THINKING / SYSTEMS",
  serviceClosingTitle: "Start with the problem. Build with purpose.",
  serviceClosingText: "Looking for an engineer, exploring a product direction, or interested in one of the projects? Explore the case studies or contact me through an approved channel.",
  serviceNoPromises: "These examples show areas of practice, not a guarantee of availability, delivery dates, agency services, product launches, or paid client engagements. Scope and collaboration arrangements must be discussed individually.",
};

function ServiceIcon({ category, ...props }: { category: ServiceCategory } & SVGProps<SVGSVGElement>) {
  const shared = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <svg width="29" height="29" viewBox="0 0 32 32" aria-hidden="true" {...shared} {...props}>
    {category === "web" && <><rect x="3.5" y="6" width="25" height="20" rx="3"/><path d="M3.5 11.5h25M13 16l-3 3 3 3m6-6 3 3-3 3"/></>}
    {category === "mobile" && <><rect x="10" y="3.5" width="12" height="25" rx="3"/><path d="M14.5 7h3M15 24.5h2M12.5 11h7v9h-7z"/></>}
    {category === "backend" && <><rect x="4.5" y="6" width="23" height="8" rx="2"/><rect x="4.5" y="18" width="23" height="8" rx="2"/><path d="M9 10h.2M9 22h.2m6-12h9m-9 12h9"/></>}
    {category === "data" && <><ellipse cx="16" cy="7" rx="10.5" ry="4"/><path d="M5.5 7v18c0 2.3 4.7 4.2 10.5 4.2S26.5 27.3 26.5 25V7M5.5 15.5c0 2.3 4.7 4.2 10.5 4.2s10.5-1.9 10.5-4.2"/></>}
    {category === "fullstack" && <><path d="m16 4 11 6-11 6-11-6 11-6Zm-11 11 11 6 11-6M5 20l11 6 11-6M16 16v10"/></>}
    {category === "improvements" && <><path d="M5 24.5 23 6.5l3 3-18 18H5v-3ZM19 10.5l3 3M5 7h8m-4-4v8M23.5 20.5v8m-4-4h8"/></>}
  </svg>;
}

export function ServicesSection({ locale = "en", variant = "preview" }: Props) {
  const t = locale === "en" ? english : getTranslatedUi(locale);
  const data = getServices(locale, variant);
  const id = variant === "preview" ? "services" : "services-list";
  return <section id={id} className={"services-section services-section--" + variant + " section-pad"} aria-labelledby={id + "-title"}>
    <div className="container">
      <div className="services-heading">
        <span className="section-eyebrow"><span>05</span><span className="section-eyebrow-line" />{t.serviceEyebrow}</span>
        <div className="services-heading-grid"><h2 id={id + "-title"}>{t.serviceTitle}</h2><p>{t.serviceIntro}</p></div>
      </div>
      <div className="services-grid">
        {data.map((item,i)=><article key={item.id} className={"services-card services-card--" + item.id}>
          <div className="services-card-top"><div className="services-icon"><ServiceIcon category={item.category}/></div><span className="services-card-num">{String(i+1).padStart(2,"0")} / {String(data.length).padStart(2,"0")}</span></div>
          <h3>{item.title}</h3>
          <p className="services-card-summary">{item.summary}</p>
          <div className="services-card-divider" />
          <div className="services-card-scope"><h4>{t.serviceScope}</h4><ul>{item.capabilities.map(line=><li key={line}>{line}</li>)}</ul></div>
          <div className="services-card-tools"><h4>{t.serviceTools}</h4><ul>{item.technologies.map(tech=><li key={tech} dir="ltr">{tech}</li>)}</ul></div>
          <div className="services-card-proof"><h4>{t.serviceEvidence}</h4><div>{item.examples.map(project=><Link key={project.slug} href={localizePath(locale,"/projects/"+project.slug)} aria-label={t.serviceExample + ": " + project.title}>{project.title}<ArrowUpRightIcon width="15" height="15" /></Link>)}</div></div>
        </article>)}
      </div>
      {variant === "preview" && <div className="services-preview-bottom"><p>{t.servicePreviewNote}</p><Link href={localizePath(locale,"/services")} className="button button-outline">{t.serviceAll}<ArrowRightIcon width="18" height="18" /></Link></div>}
      {variant === "full" && <div className="services-disclaimer">{t.serviceNoPromises}</div>}
    </div>
  </section>;
}

export function ServicesPageView({ locale = "en" }: { locale?: ServiceLocale }) {
  const t = locale === "en" ? english : getTranslatedUi(locale);
  const identity = getPublicIdentity();
  return <main id="main" tabIndex={-1}>
    <section className="services-hero section-pad" aria-labelledby="services-page-title"><div className="container services-hero-grid">
      <div><div className="page-eyebrow"><span>04 /</span> {t.serviceHeroEyebrow}</div>
        <h1 id="services-page-title">{t.serviceHeroTitle}</h1>
        <p>{t.serviceHeroIntro}</p>
        <div className="services-hero-actions"><a className="button button-primary" href="#services-list">{t.serviceAll}<ArrowRightIcon width="18" height="18" /></a>
          <Link className="button button-outline" href={localizePath(locale,"/contact")}>{t.serviceContact}<ArrowRightIcon width="18" height="18" /></Link>
        </div>
      </div>
      <div className="services-hero-art" role="img" aria-label={t.serviceHeroTag}><div className="services-art-ring services-art-ring--one"/><div className="services-art-ring services-art-ring--two"/>
        <span className="services-art-label">WEB / MOBILE / SYSTEMS</span><span className="services-art-mark" aria-hidden="true">AS</span><span className="services-art-foot">ENGINEER <i>→</i> REFINE</span></div>
    </div></section>
    <ServicesSection locale={locale} variant="full"/>
    <section className="services-closing section-pad" aria-labelledby="services-close-title"><div className="container services-close-inner"><div>
      <span className="section-eyebrow"><span>06</span><span className="section-eyebrow-line"/>{t.serviceEyebrow}</span>
      <h2 id="services-close-title">{t.serviceClosingTitle}</h2><p>{t.serviceClosingText}</p>
      {!identity.email && <p className="services-contact-hint">{t.serviceContactDetail}</p>}
      <div className="services-close-actions"><Link href={localizePath(locale,"/projects")} className="button button-outline">{locale==="en"?"View project case studies":getTranslatedUi(locale).projects}<ArrowRightIcon width="18" height="18"/></Link>
        <Link href={localizePath(locale,"/contact")} className="button button-primary">{t.serviceContact}<ArrowRightIcon width="18" height="18"/></Link></div></div>
    </div></section>
  </main>;
}
