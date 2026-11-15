/** Safe public labels only; no editorial queue, owner approval tokens or server configuration. */
import fa from '@/content/locales/fa-ui.json';
import ps from '@/content/locales/ps-ui.json';
import { localeFromPath, localizePath } from '@/lib/i18n-core.mjs';
import type { Locale } from '@/lib/i18n-core.mjs';
export { localeFromPath, localizePath };
export type { Locale };
export type PublicUi = typeof fa;
export function getUi(locale: 'fa' | 'ps'): PublicUi { return locale === 'fa' ? fa : ps; }
