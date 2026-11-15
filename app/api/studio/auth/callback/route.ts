import { NextRequest,NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { studioConfig } from '@/lib/phase08-core.mjs';
import { createStudioSession,studioCookieName,studioCookieOptions } from '@/lib/studio-auth';

export const runtime='nodejs';export const dynamic='force-dynamic';
function equal(a:string,b:string){const aa=Buffer.from(a),bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb);}
export async function GET(req:NextRequest){
  const cfg=studioConfig(); if(!cfg.enabled)return new Response('Not found',{status:404});
  const url=req.nextUrl;
  const state=url.searchParams.get('state')||'',original=req.cookies.get('portfolio_studio_oauth_state')?.value||'';
  const failed=()=>NextResponse.redirect(`${cfg.origin}/studio/login?error=authentication`,{status:303});
  let res:NextResponse;
  if(!state || !original || !equal(state,original) || !url.searchParams.get('code') || url.searchParams.has('error'))res=failed();
  else{
    try{
      const exchanged=await fetch('https://github.com/login/oauth/access_token',{
        method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},cache:'no-store',
        body:JSON.stringify({client_id:process.env.PORTFOLIO_GITHUB_CLIENT_ID,client_secret:process.env.PORTFOLIO_GITHUB_CLIENT_SECRET,code:url.searchParams.get('code'),redirect_uri:`${cfg.origin}/api/studio/auth/callback`,state})
      });
      const token=await exchanged.json();
      if(!exchanged.ok || typeof token.access_token!=='string')throw new Error('exchange failed');
      const profile=await fetch('https://api.github.com/user',{headers:{'Authorization':`Bearer ${token.access_token}`,'Accept':'application/vnd.github+json'},cache:'no-store'});
      const user=await profile.json();
      if(!profile.ok || String(user.id)!==cfg.ownerId || typeof user.login!=='string')throw new Error('not authorized');
      res=NextResponse.redirect(`${cfg.origin}/studio`,{status:303});
      res.cookies.set(studioCookieName,createStudioSession(String(user.id),user.login),studioCookieOptions);
    }catch{res=failed();}
  }
  res.cookies.set('portfolio_studio_oauth_state','',{maxAge:0,path:'/api/studio/auth/callback'});
  res.headers.set('Cache-Control','no-store');return res;
}
