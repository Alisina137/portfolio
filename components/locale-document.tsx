'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { localeFromPath, localizePath } from '@/lib/i18n-core.mjs';
import type { Locale } from '@/lib/i18n-core.mjs';
/** Root layouts persist during client navigation: keep the document language and direction synchronized. */
export function LocaleDocument({ availableLocales }: { availableLocales: Locale[] }) {
  const pathname = usePathname();
  useEffect(() => {
    const locale = localeFromPath(pathname);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'en' ? 'ltr' : 'rtl';
  }, [pathname]);
  useEffect(() => {
    if (pathname !== '/') return;
    const selected = document.cookie.split(';').map(cookie => cookie.trim()).find(value => value.startsWith('portfolio-language='))?.split('=')[1];
    if ((selected === 'fa' || selected === 'ps') && availableLocales.includes(selected)) {
      window.location.replace(`${localizePath(selected, '/')}${window.location.search}${window.location.hash}`);
    }
  }, [pathname, availableLocales]);
  return null;
}
