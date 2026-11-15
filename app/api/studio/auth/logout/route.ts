import { NextRequest,NextResponse } from 'next/server';
import { studioConfig,validSameOrigin } from '@/lib/phase08-core.mjs';
import { studioCookieName } from '@/lib/studio-auth';
export const runtime='nodejs';
export async function POST(req:NextRequest){
  const cfg=studioConfig();if(!cfg.enabled || !validSameOrigin(req,cfg.origin))return new Response('Forbidden',{status:403});
  const res=NextResponse.redirect(`${cfg.origin}/studio/login`,{status:303});
  res.cookies.set(studioCookieName,'',{maxAge:0,path:'/',httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production'});
  res.headers.set('Cache-Control','no-store');return res;
}
