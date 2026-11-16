'use client';
import { useRef,useState,useEffect,FormEvent } from 'react';
import Script from 'next/script';
import { getUi } from '@/lib/i18n-client';
export function ContactForm({siteKey,locale='en'}:{siteKey:string;locale?:'en'|'fa'|'ps'}){
  const ui=locale==='en'?null:getUi(locale);
  const formRef=useRef<HTMLFormElement>(null);const [busy,setBusy]=useState(false);const [success,setSuccess]=useState(false);const [message,setMessage]=useState('');
  // The inquiry planner only copies a client-side draft into this existing,
  // server-verified form. Never auto-send messages on the user's behalf.
  useEffect(()=>{
    function receiveDraft(event:Event){
      const values=(event as CustomEvent<{subject?:unknown;body?:unknown}>).detail;
      if(!values || typeof values.subject!=="string" || typeof values.body!=="string" ||
        values.subject.length<5 || values.subject.length>140 ||
        values.body.length<20 || values.body.length>4000)return;
      const subject=formRef.current?.elements.namedItem("subject");
      const messageField=formRef.current?.elements.namedItem("message");
      if(!(subject instanceof HTMLInputElement) || !(messageField instanceof HTMLTextAreaElement))return;
      subject.value=values.subject;messageField.value=values.body;
      setSuccess(false);
      setMessage(ui?.inquiryFormReady||"Draft added to the contact form. Review the fields and send explicitly.");
      formRef.current?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"center"});
      subject.focus({preventScroll:true});
    }
    window.addEventListener("portfolio:inquiry-draft",receiveDraft);
    return ()=>window.removeEventListener("portfolio:inquiry-draft",receiveDraft);
  },[ui?.inquiryFormReady]);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(busy)return;
    setBusy(true);setMessage('');setSuccess(false);
    try{
      const form=new FormData(event.currentTarget);
      const data={name:form.get('name'),email:form.get('email'),subject:form.get('subject'),message:form.get('message'),website:form.get('website'),turnstileToken:form.get('cf-turnstile-response')};
      const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result=await r.json();if(!r.ok)throw new Error(ui?.sendFail||result.error||'Could not send message');
      setMessage(ui?.sendSuccess||result.message||'Your message was sent.');setSuccess(true);formRef.current?.reset();
    }catch(e){setMessage(e instanceof Error?e.message:(ui?.sendFail||'Could not send message. Please retry.'));}
    finally{
      setBusy(false);
      // Ask Turnstile to issue a fresh single-use token after every submission.
      const win=window as Window & {turnstile?:{reset:()=>void}};
      win.turnstile?.reset();
    }
  }
  return <section className="contact-form-card" aria-labelledby="contact-form-title">
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive"/>
    <span className="contact-card-eyebrow">{ui?.formEyebrow ?? 'SEND A NOTE'}</span>
    <h3 id="contact-form-title">{ui?.formTitle ?? 'Tell me about your idea.'}</h3>
    <p>{ui?.formIntro ?? 'Messages are sent to my configured email provider. No message history is stored on this website.'}</p>
    <form ref={formRef} onSubmit={submit} className="contact-message-form">
      <label><span>{ui?.name ?? 'Your name'}</span><input name="name" required minLength={2} maxLength={90} autoComplete="name"/></label>
      <label><span>{ui?.email ?? 'Your email'}</span><input name="email" type="email" required maxLength={254} autoComplete="email"/></label>
      <label><span>{ui?.subject ?? 'Subject'}</span><input name="subject" required minLength={5} maxLength={140}/></label>
      <label><span>{ui?.message ?? 'Message'}</span><textarea name="message" required minLength={20} maxLength={4000} rows={6}/></label>
      <label className="sr-only" aria-hidden="true">{ui?.siteHoneypot ?? 'Website (leave blank)'}<input name="website" tabIndex={-1} autoComplete="off"/></label>
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="auto" aria-label={ui?.spam ?? "Spam protection verification"}/>
      <p className="contact-form-note">{ui?.sensitive ?? 'Please avoid sending passwords, account numbers, school/student data, medical information or other sensitive records. A third-party verification service and email provider process the request.'}</p>
      {message&&<p role="status" className={success?'studio-success':'studio-alert'}>{message}</p>}
      <button className="button button-primary" type="submit" disabled={busy}>{busy?(ui?.sending ?? 'Sending…'):(ui?.send ?? 'Send message →')}</button>
    </form>
  </section>;
}
