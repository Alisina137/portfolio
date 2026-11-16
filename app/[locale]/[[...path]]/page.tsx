import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getPublicProject, getCaseStudy } from '@/lib/content';
import { localePubliclyVisible, translationsOwnerApproved, getTranslatedUi, getTranslatedProject } from '@/lib/i18n';
import { localizePath, parseLocale } from '@/lib/i18n-core.mjs';
import { createPageMetadata } from '@/lib/seo';
import { LocaleHome, LocaleProjects, LocaleCase, LocaleAbout, LocaleContact } from '@/components/locale-public-pages';
import { ServicesPageView } from '@/components/services-section';
import { NowPageView } from '@/components/now-section';
import { RepositoriesPageView } from '@/components/repositories-section';
import { ImpactPageView } from '@/components/impact-section';
import { TestimonialsPageView } from '@/components/testimonials-section';
import { AvailabilityPageView } from '@/components/availability-section';

type Params = { locale: string; path?: string[] };
type Props = { params: Promise<Params>; searchParams: Promise<{ back?: string | string[] }> };
function routeData({ locale: rawLocale, path = [] }: Params) {
  const locale = parseLocale(rawLocale);
  if (!locale) notFound();
  if (path.some(part => !/^[a-z0-9-]+$/.test(part))) notFound();
  const pathname = path.length ? `/${path.join('/')}` : '/';
  if (locale === 'en') return { locale: 'en' as const, pathname };
  if (!localePubliclyVisible(locale)) notFound();
  return { locale, pathname };
}
function isAllowedPath(pathname: string) {
  return pathname === '/' || pathname === '/projects' || /^\/projects\/[a-z0-9-]+$/.test(pathname) || pathname === '/about' || pathname === '/contact' || pathname === '/services' || pathname === '/now' || pathname === '/repositories' || pathname === '/impact' || pathname === '/testimonials' || pathname === '/availability';
}
export async function generateMetadata({ params }: Pick<Props,'params'>): Promise<Metadata> {
  const { locale, pathname } = routeData(await params);
  if (locale === 'en' || !isAllowedPath(pathname)) return { title: 'Page not found', robots: { index:false, follow:false } };
  const u = getTranslatedUi(locale);
  const project = pathname.startsWith('/projects/') ? getPublicProject(pathname.split('/')[2]) : null;
  if ((pathname.startsWith('/projects/') && (!project || !getCaseStudy(project.slug)))) return { title: 'Page not found', robots:{index:false,follow:false} };
  const title = project ? `${project.title} — ${u.caseEyebrow} | Alisina Sarwari` : ({'/':`Alisina Sarwari — ${u.heroEyebrow}`,'/projects':`${u.projects} | Alisina Sarwari`,'/about':`${u.about} | Alisina Sarwari`,'/contact':`${u.contact} | Alisina Sarwari`,'/services':`${u.services} | Alisina Sarwari`,'/now':`${u.now} | Alisina Sarwari`,'/repositories':`${u.repositories} | Alisina Sarwari`,'/impact':`${u.impact} | Alisina Sarwari`,'/testimonials':`${u.testimonials} | Alisina Sarwari`,'/availability':`${u.availability} | Alisina Sarwari`}[pathname] || 'Alisina Sarwari');
  const description = project ? getTranslatedProject(locale,project).oneLiner : ({'/':u.heroIntro,'/projects':u.catalogIntro,'/about':u.aboutBio,'/contact':u.contactIntro,'/services':u.serviceHeroIntro,'/now':u.nowHeroIntro,'/repositories':u.repoHeroIntro,'/impact':u.impactHeroIntro,'/testimonials':u.testimonialHeroIntro,'/availability':u.availabilityHeroIntro}[pathname] || u.heroIntro);
  const metadata = createPageMetadata({ title, description, pathname: localizePath(locale,pathname) });
  // A complete verified translation requires its own canonical and hreflang; drafts never advertise locales.
  return {
    ...metadata,
    robots: { index:translationsOwnerApproved(locale) && Boolean(metadata.robots && (metadata.robots as {index?:boolean}).index), follow:translationsOwnerApproved(locale) && Boolean(metadata.robots && (metadata.robots as {follow?:boolean}).follow) },
    openGraph: { ...metadata.openGraph, locale: locale === 'fa' ? 'fa_AF':'ps_AF', images: [{url:'/opengraph-image',width:1200,height:630,alt:description}] },
  };
}
export default async function LocalizedPublicRoute({params,searchParams}:Props) {
  const {locale,pathname} = routeData(await params);
  if (locale === 'en') {
    if (!isAllowedPath(pathname) || (pathname.startsWith('/projects/') && !getPublicProject(pathname.split('/')[2]))) notFound();
    redirect(pathname);
  }
  if (pathname === '/') return <LocaleHome locale={locale}/>;
  if (pathname === '/projects') return <LocaleProjects locale={locale}/>;
  if (pathname === '/services') return <ServicesPageView locale={locale}/>;
  if (pathname === '/now') return <NowPageView locale={locale}/>;
  if (pathname === '/repositories') return <RepositoriesPageView locale={locale}/>;
  if (pathname === '/impact') return <ImpactPageView locale={locale}/>;
  if (pathname === '/testimonials') return <TestimonialsPageView locale={locale}/>;
  if (pathname === '/availability') return <AvailabilityPageView locale={locale}/>;
  if (pathname === '/about') return <LocaleAbout locale={locale}/>;
  if (pathname === '/contact') return <LocaleContact locale={locale}/>;
  if (/^\/projects\/[a-z0-9-]+$/.test(pathname)) {
    const paramsValue=await searchParams;
    return <LocaleCase locale={locale} slug={pathname.split('/')[2]} back={paramsValue.back}/>;
  }
  // Writing stays hidden until articles have owner-approved Dari/Pashto translations.
  notFound();
}
