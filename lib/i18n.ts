import 'server-only';
import { createHash } from 'node:crypto';
import englishProfile from '@/content/profile.json';
import englishProjects from '@/content/projects.json';
import englishCases from '@/content/case-studies.json';
import englishExperience from '@/content/experience.json';
import englishQualifications from '@/content/qualifications.json';
import writing from '@/content/writing/articles.json';
import faUi from '@/content/locales/fa-ui.json';
import psUi from '@/content/locales/ps-ui.json';
import faCases from '@/content/locales/fa-projects.json';
import psCases from '@/content/locales/ps-projects.json';
import approval from '@/content/locales/approval.json';
import { writingIsLive } from '@/lib/writing';
import { localeVisible, localeApproved } from '@/lib/i18n-core.mjs';
import type { Locale } from '@/lib/i18n-core.mjs';
import type { Project, CaseStudy } from '@/lib/content';

export type { Locale };
const ui = { fa: faUi, ps: psUi } as const;
const cases = { fa: faCases, ps: psCases } as const;
export type UiKey = keyof typeof faUi;
export function languageName(locale: Locale) { return { en: 'English', fa: 'دری', ps: 'پښتو' }[locale]; }
export function getTranslatedUi(locale: 'fa' | 'ps') { return ui[locale]; }
export function t(locale: 'fa' | 'ps', key: UiKey) { return ui[locale][key]; }
export function getTranslatedProject(locale: 'fa' | 'ps', project: Project): Project {
  const record = cases[locale][project.slug as keyof typeof faCases];
  if (!record) throw new Error(`Missing ${locale} project translation: ${project.slug}`);
  return { ...project, oneLiner: record.oneLiner, eyebrow: record.eyebrow, coverTitle: record.coverTitle, ownerRole: record.ownerRole };
}
export function getTranslatedCase(locale: 'fa' | 'ps', study: CaseStudy): CaseStudy {
  const record = cases[locale][study.slug as keyof typeof faCases];
  if (!record) throw new Error(`Missing ${locale} case translation: ${study.slug}`);
  // Future screenshots require translated alt/caption in the translation record before publishing the locale.
  if (study.media.length) throw new Error(`Untranslated approved gallery for ${locale}/${study.slug}`);
  return { ...study, ...record, slug: study.slug, media: [] };
}
export function localeContentFingerprint() {
  return createHash('sha256').update(JSON.stringify([englishProfile, englishProjects, englishCases, writing, englishExperience, englishQualifications])).digest('hex');
}
export function translationsOwnerApproved(locale: 'fa' | 'ps') {
  return localeApproved(locale, approval, localeContentFingerprint(), writingIsLive(), false);
}
export function localePubliclyVisible(locale: Locale) {
  return locale === 'en' || localeVisible(locale, approval, localeContentFingerprint(), {
    writingLive: writingIsLive(), translatedWritingComplete: false,
    dev: process.env.NODE_ENV !== 'production', preview: process.env.PORTFOLIO_LOCALE_PREVIEW === 'true',
  });
}
export function showLanguageSelector() { return (['fa', 'ps'] as const).some(localePubliclyVisible); }
export function visibleLanguages(): Locale[] { return (['en', 'fa', 'ps'] as const).filter(localePubliclyVisible); }
export function availableTranslatedPaths(pathname: string) {
  return (['fa', 'ps'] as const).filter(translationsOwnerApproved);
}
