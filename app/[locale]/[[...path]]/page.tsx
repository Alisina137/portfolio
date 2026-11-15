import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getPublicProject, getCaseStudy } from '@/lib/content';
import { localePubliclyVisible, translationsOwnerApproved, getTranslatedUi, getTranslatedProject } from '@/lib/i18n';
import { localizePath, parseLocale } from '@/lib/i18n-core.mjs';
import { createPageMetadata } from '@/lib/seo';
import { LocaleHome, LocaleProjects, LocaleCase, LocaleAbout, LocaleContact } from '@/components/locale-public-pages';

type Params = { locale: string; path?: string[] };
type Props = { params: Promise<Params>; searchParams: Promise<{ back?: string | string[] }> };
function routeData({ locale, path = [] }: Params) {
  const validatedLocale = parseLocale(locale);
  if (!validatedLocale) notFound();
  if (path.some(part => !/^[a-z0-9-]+$/.test(part))) notFound();
  const pathname = path.length ? `/${path.join('/')}` : '/';
  if (validatedLocale === 'en') return { locale: 'en' as const, pathname };
  if (!localePubliclyVisible(validatedLocale)) notFound();
  return { locale: validatedLocale, pathname };
}
function isAllowedPath(pathname: string) {
  return pathname === '/' || pathname === '/projects' || /^\/projects\/[a-z0-9-]+$/.test(pathname) || pathname === '/about' || pathname === '/contact';
}
export async function generateMetadata({ params }: Pick<Props,'params'>): Promise<Metadata> {
  const { locale, pathname } = routeData(await params);
  if (locale === 'en' || !isAllowedPath(pathname)) return { title: 'Page not found', robots: { index:false, follow:false } };
  const u = getTranslatedUi(locale);
  const project = pathname.startsWith('/projects/') ? getPublicProject(pathname.split('/')[2]) : null;
  if ((pathname.startsWith('/projects/') && (!project || !getCaseStudy(project.slug)))) return { title: 'Page not found', robots:{index:false,follow:false} };
  const title = project ? `${project.title} — ${u.caseEyebrow} | Alisina Sarwari` : ({'/':`Alisina Sarwari — ${u.heroEyebrow}`,'/projects':`${u.projects} | Alisina Sarwari`,'/about':`${u.about} | Alisina Sarwari`,'/contact':`${u.contact} | Alisina Sarwari`}[pathname] || 'Alisina Sarwari');
  const description = project ? getTranslatedProject(locale,project).oneLiner : ({'/':u.heroIntro,'/projects':u.catalogIntro,'/about':u.aboutBio,'/contact':u.contactIntro}[pathname] || u.heroIntro);
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
  if (pathname === '/about') return <LocaleAbout locale={locale}/>;
  if (pathname === '/contact') return <LocaleContact locale={locale}/>;
  if (/^\/projects\/[a-z0-9-]+$/.test(pathname)) {
    const paramsValue=await searchParams;
    return <LocaleCase locale={locale} slug={pathname.split('/')[2]} back={paramsValue.back}/>;
  }
  // Writing stays hidden until articles have owner-approved Dari/Pashto translations.
  notFound();
}
