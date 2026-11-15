"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUi, localeFromPath, localizePath } from '@/lib/i18n-client';
export default function LocaleNotFound() {
  const locale=localeFromPath(usePathname());
  const ui=locale==='en'?null:getUi(locale);
  return <main id="main" className="recovery-page section-pad"><div className="container recovery-layout"><span className="recovery-code">404 /</span><div className="recovery-copy"><h1>{locale==='fa'?'صفحه پیدا نشد.':locale==='ps'?'پاڼه ونه موندل شوه.':'Page not found.'}</h1><p>{locale==='fa'?'این نشانی وجود ندارد یا هنوز برای نشر تأیید نشده است.':locale==='ps'?'دا پته نشته یا لا د خپرېدو لپاره نه ده تایید شوې.':'This route is not available.'}</p><div className="recovery-actions"><Link className="button button-primary" href={localizePath(locale,'/')}>{ui?.home??'Home'}</Link><Link className="button button-outline" href={localizePath(locale,'/projects')}>{ui?.projects??'Projects'}</Link></div></div></div></main>;
}
