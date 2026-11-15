import { type NextRequest, NextResponse } from 'next/server';
import { localeFromPath } from '@/lib/i18n-core.mjs';
/** Propagate the URL locale for first-render lang/dir. Never use an untrusted request header. */
export function proxy(request: NextRequest) {
  const locale = localeFromPath(request.nextUrl.pathname);
  const forwarded = new Headers(request.headers);
  forwarded.set('x-portfolio-locale', locale);
  const response = NextResponse.next({ request: { headers: forwarded } });
  // Language preference is a convenience only; the URL always wins.
  if (/^\/(fa|ps)(\/|$)/.test(request.nextUrl.pathname)) {
    response.cookies.set('portfolio-language', locale, { path: '/', sameSite: 'lax', secure: request.nextUrl.protocol === 'https:', maxAge: 60 * 60 * 24 * 365 });
  }
  return response;
}
export const config = { matcher: ['/((?!api/|_next/|studio/|favicon.ico|robots.txt|sitemap.xml|.*\\.[a-z0-9]+$).*)'] };
