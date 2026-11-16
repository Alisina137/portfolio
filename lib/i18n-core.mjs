/** Public locale route and publication guards. No translation approval can be inferred. */
export const LOCALES = ['en', 'fa', 'ps'];
export const RTL_LOCALES = ['fa', 'ps'];
export function parseLocale(value) {
  return value === 'fa' || value === 'ps' || value === 'en' ? value : null;
}
export function localeFromPath(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segment = path.split('/')[1];
  return segment === 'fa' || segment === 'ps' ? segment : 'en';
}
export function stripLocale(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return path.replace(/^\/(fa|ps)(?=\/|$)/, '') || '/';
}
export function localizePath(locale, pathname) {
  const target = stripLocale(pathname);
  return locale === 'en' ? target : `/${locale}${target === '/' ? '' : target}`;
}
export function supportedPublicPath(path) {
  return path === '/' || path === '/projects' || /^\/projects\/[a-z0-9-]+$/.test(path) || path === '/about' || path === '/contact' || path === '/services' || path === '/now' || path === '/repositories' || path === '/writing' || /^\/writing\/[a-z0-9-]+$/.test(path);
}
export function localeApproved(locale, approvals, fingerprint, writingLive = false, translatedWritingComplete = false) {
  if (locale === 'en') return true;
  const record = approvals?.[locale];
  return Boolean(record?.ownerApproved && record?.rtlQaPassed && record?.sourceFingerprint && record.sourceFingerprint === fingerprint && (!writingLive || translatedWritingComplete));
}
export function localeVisible(locale, approvals, fingerprint, options = {}) {
  if (locale === 'en') return true;
  if (localeApproved(locale, approvals, fingerprint, options.writingLive, options.translatedWritingComplete)) return true;
  // Development-only preview is deliberately not a public release or a production toggle.
  return options.dev === true && options.preview === true;
}
export function localeSwitchHref(pathname, locale, search = '') {
  const base = localizePath(locale, pathname);
  return `${base}${search && search.startsWith('?') ? search : ''}`;
}
