import { NextRequest } from 'next/server';
import { contactConfig,validSameOrigin,validateContact,hashLimiterKey } from '@/lib/phase08-core.mjs';
import { readLimitedJson } from '@/lib/request-json';
export const runtime='nodejs';export const dynamic='force-dynamic';
const json=(payload:object,status:number)=>Response.json(payload,{status,headers:{'Cache-Control':'no-store'}});
function getAddress(req:NextRequest){
  // These must be set by a trusted hosting proxy, not by user-provided form values.
  const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||'unknown';
  return /^[0-9a-f:.]{3,45}$/i.test(ip)?ip:'unknown';
}
async function rateLimit(id:string,limit:number){
  const key=`portfolio:contact:v1:${id}`;
  const script="local n=redis.call('INCR',KEYS[1]);if n==1 then redis.call('EXPIRE',KEYS[1],3600) end;return n";
  const endpoint=process.env.PORTFOLIO_UPSTASH_REDIS_REST_URL!;
  const res=await fetch(endpoint,{method:'POST',cache:'no-store',headers:{'Authorization':`Bearer ${process.env.PORTFOLIO_UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',script,'1',key]),signal:AbortSignal.timeout(6000)});
  if(!res.ok)throw new Error('rate backend unavailable');const data=await res.json();
  if(!Number.isInteger(Number(data.result)))throw new Error('bad rate backend response');
  return Number(data.result)<=limit;
}
async function verifyChallenge(token:string,remoteip:string){
  const body=new URLSearchParams({secret:process.env.PORTFOLIO_TURNSTILE_SECRET!,response:token});
  if(remoteip!=='unknown')body.set('remoteip',remoteip);
  const res=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body,signal:AbortSignal.timeout(6000),cache:'no-store'});
  if(!res.ok)return false;
  const data=await res.json();return data.success===true && (!data.hostname || data.hostname===new URL(process.env.NEXT_PUBLIC_SITE_URL!).hostname);
}
export async function POST(req:NextRequest){
  if(!contactConfig().enabled)return new Response('Not found',{status:404});
  if(!validSameOrigin(req,process.env.NEXT_PUBLIC_SITE_URL!))return json({error:'Invalid request origin'},403);
  if(Number(req.headers.get('content-length')||0)>13000)return json({error:'Message too large'},413);
  let input;
  try{input=validateContact(await readLimitedJson(req,13000));}catch{return json({error:'Invalid message'},400);}
  if(!input)return json({error:'Please check the fields and complete verification'},422);
  const address=getAddress(req);
  try{
    const salt=process.env.PORTFOLIO_STUDIO_SESSION_SECRET||process.env.PORTFOLIO_UPSTASH_REDIS_REST_TOKEN!;
    const [perVisitor,overall]=await Promise.all([rateLimit(hashLimiterKey(address,salt),3),rateLimit('global',80)]);
    if(!perVisitor || !overall)return json({error:'Too many requests. Please try again later.'},429);
    const verified=await verifyChallenge(input.turnstileToken,address);
    if(!verified)return json({error:'Verification expired or failed. Please try again.'},422);
    const payload={from:process.env.PORTFOLIO_CONTACT_FROM!,to:[process.env.PORTFOLIO_CONTACT_TO!],
      reply_to:input.email,subject:`Portfolio message: ${input.subject}`,text:`From: ${input.name}\nReply-to: ${input.email}\n\n${input.message}`};
    const mail=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':`Bearer ${process.env.PORTFOLIO_RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(8000),cache:'no-store'});
    if(!mail.ok)return json({error:'Message could not be delivered. Please use another contact option.'},503);
    return json({ok:true,message:'Message sent. Thank you for getting in touch.'},200);
  }catch{return json({error:'Messaging is temporarily unavailable. Please try again later.'},503);}
}
