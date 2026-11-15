import { NextRequest,NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { studioConfig } from '@/lib/phase08-core.mjs';

export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
  const cfg=studioConfig();if(!cfg.enabled)return new Response('Not found',{status:404});
  const state=randomBytes(24).toString('base64url');
  const url=new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id',process.env.PORTFOLIO_GITHUB_CLIENT_ID!);
  url.searchParams.set('redirect_uri',`${cfg.origin}/api/studio/auth/callback`);
  url.searchParams.set('state',state);
  url.searchParams.set('scope','read:user');
  const res=NextResponse.redirect(url,{status:302});
  res.cookies.set('portfolio_studio_oauth_state',state,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:600,path:'/api/studio/auth/callback'});
  res.headers.set('Cache-Control','no-store');
  return res;
}
