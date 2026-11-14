export type SiteEnvironment = { NEXT_PUBLIC_SITE_URL?: string; PORTFOLIO_LAUNCH_APPROVED?: string };
export function getSiteUrl(env?: SiteEnvironment): string | null;
export function isPublicIndexingEnabled(env?: SiteEnvironment): boolean;
export function getPageUrl(pathname: string, env?: SiteEnvironment): string | null;
