import type { Metadata } from 'next';
import { notFound,redirect } from 'next/navigation';
import { getStudioSession } from '@/lib/studio-auth';
import { studioConfig } from '@/lib/phase08-core.mjs';
import { StudioEditor } from '@/components/studio-editor';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Portfolio Studio — Owner workspace',robots:{index:false,follow:false}};
export default async function StudioPage(){
  if(!studioConfig().enabled)notFound();
  const session=await getStudioSession();if(!session)redirect('/studio/login');
  return <main id="main" className="studio-shell container" tabIndex={-1}>
    <div className="studio-topline"><div><div className="page-eyebrow">CONTENT OPERATIONS / PRIVATE</div><h1>Portfolio <em>Studio.</em></h1><p>Signed in as @{session.login}. All changes become draft pull requests for review, not immediate updates.</p></div>
      <form method="post" action="/api/studio/auth/logout"><button type="submit" className="button button-outline">Sign out</button></form></div>
    <StudioEditor/>
  </main>;
}
