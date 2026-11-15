import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getStudioSession } from '@/lib/studio-auth';
import { studioConfig } from '@/lib/phase08-core.mjs';
export const metadata:Metadata={title:'Owner sign-in | Portfolio Studio',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
type Props={searchParams:Promise<{error?:string}>};
export default async function StudioLoginPage({searchParams}:Props){
  if(!studioConfig().enabled)notFound();
  if(await getStudioSession())redirect('/studio');
  const q=await searchParams;
  return <main id="main" className="studio-shell container" tabIndex={-1}>
    <section className="studio-login" aria-labelledby="studio-login-title"><div className="page-eyebrow">PRIVATE WORKSPACE / OWNER ONLY</div>
      <h1 id="studio-login-title">Portfolio <em>Studio.</em></h1>
      <p>Review your portfolio content and propose carefully checked updates. Publishing still requires GitHub pull-request review and passing checks.</p>
      {q.error&&<p className="studio-alert" role="alert">Sign-in was not completed. Only the approved GitHub account may access this workspace.</p>}
      <a className="button button-primary" href="/api/studio/auth/start">Sign in with GitHub →</a>
      <p className="studio-hint">No public registration, password storage or open editor access.</p>
      <Link href="/">← Return to portfolio</Link>
    </section>
  </main>;
}
