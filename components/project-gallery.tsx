"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import type { CaseMedia, StudyBlock } from "@/lib/content";

type Locale = "en" | "fa" | "ps";
type Props = { projectTitle: string; features: StudyBlock[]; items: CaseMedia[]; locale?: Locale };
const labels = {
 en: {
  eyebrow:"04 / VISUAL WALKTHROUGH", title:"Explore the interface ideas.",
  intro:"Browse the concept screens behind this project. Original screenshots and captioned demos will appear only after they are reviewed and approved.",
  concepts:"Concept mockups",captures:"Approved captures",real:"REAL PROJECT MEDIA",
  conceptBadge:"CONCEPT MOCKUP — NOT A REAL SCREENSHOT",
  conceptNote:"These shapes illustrate interface structure. They do not depict a running application, completed feature, or captured screen.",
  noCaptures:"No verified application screenshots or videos are published for this project yet.",
  next:"Next view",previous:"Previous view",open:"Open full-size viewer",
  close:"Close viewer",counter:"View {current} of {total}",thumb:"Select view",
  modalTitle:"Verified project media viewer",captioned:"Captioned demonstration video",video:"Video",
  all:"All media",group:"Filter media by type",desktop:"Desktop concept",mobile:"Mobile concept",
  tablet:"Tablet concept",screen:"Interface concept",evidence:"Authentic screenshot",
 },
 fa: {
  eyebrow:"۰۴ / نمایش تصویری",title:"ایده‌های رابط کاربری را بررسی کنید.",
  intro:"طرح‌های مفهومی این پروژه را مرور کنید. تصاویر واقعی و ویدیوهای زیرنویس‌دار تنها پس از بررسی و تأیید نمایش داده می‌شوند.",
  concepts:"طرح‌های مفهومی",captures:"تصاویر و ویدیوهای تأییدشده",real:"رسانهٔ واقعی پروژه",
  conceptBadge:"طرح مفهومی — عکس واقعی از برنامه نیست",
  conceptNote:"این شکل‌ها ساختار رابط را توضیح می‌دهند؛ نه یک برنامهٔ فعال، قابلیت تکمیل‌شده یا تصویر ضبط‌شده.",
  noCaptures:"برای این پروژه هنوز تصویر یا ویدیوی واقعی تأییدشده نشر نشده است.",
  next:"نمای بعدی",previous:"نمای قبلی",open:"بازکردن نمایش کامل",close:"بستن نمایشگر",
  counter:"نمای {current} از {total}",thumb:"انتخاب نما",modalTitle:"نمایش رسانهٔ واقعی تأییدشده",
  captioned:"ویدیوی نمایشی با زیرنویس",video:"ویدیو",all:"همهٔ رسانه‌ها",
  group:"فیلتر نوع رسانه",desktop:"طرح دسکتاپ",mobile:"طرح موبایل",tablet:"طرح تبلت",
  screen:"طرح رابط",evidence:"تصویر واقعی",
 },
 ps: {
  eyebrow:"۰۴ / انځوریزه کتنه",title:"د کارن‌مخ مفکورې وپلټئ.",
  intro:"د دې پروژې مفهومي بڼې وګورئ. اصلي سکرین‌شاټونه او له لیکلي متن سره ویډیوګانې یوازې له بیاکتنې او تایید وروسته ښکاره کېږي.",
  concepts:"مفهومي طرحې",captures:"تایید شوي انځورونه او ویډیوګانې",real:"د پروژې اصلي رسنۍ",
  conceptBadge:"مفهومي بڼه — اصلي سکرین‌شاټ نه دی",
  conceptNote:"دا شکلونه یوازې د کارن‌مخ جوړښت ښيي؛ د چلېدونکي اپ یا بشپړې شوې ځانګړنې اصلي انځور نه دي.",
  noCaptures:"د دې پروژې لپاره لا تایید شوي اصلي انځورونه یا ویډیوګانې نه دي خپرې شوي.",
  next:"راتلونکی انځور",previous:"مخکینی انځور",open:"لوی انځور پرانیزئ",close:"لوی انځور وتړئ",
  counter:"{current} له {total} انځورونو",thumb:"انځور وټاکئ",modalTitle:"د تایید شويو رسنیو کتونکی",
  captioned:"له لیکلي متن سره ښودنیزه ویډیو",video:"ویډیو",all:"ټولې رسنۍ",
  group:"د رسنیو ډول وټاکئ",desktop:"د کمپیوټر مفکوره",mobile:"د موبایل مفکوره",tablet:"د ټابلیټ مفکوره",
  screen:"د کارن‌مخ مفکوره",evidence:"اصلي انځور",
 }
} as const;
const deviceFor = (index: number) => ["desktop","mobile","tablet"][index % 3] as "desktop"|"mobile"|"tablet";
function ConceptVisual({ index, title, locale }: {index:number;title:string;locale:Locale}) {
 const t=labels[locale],device=deviceFor(index);
 return <div className={"visual-concept visual-concept--"+device} role="img" aria-label={title+". "+t.conceptBadge}>
   <div className="visual-concept-orbit" aria-hidden="true"/><div className="visual-concept-orbit visual-concept-orbit--two" aria-hidden="true"/>
   <div className={"visual-device visual-device--"+device} aria-hidden="true">
     <div className="visual-device-chrome"><span/><span/><span/></div>
     <div className="visual-device-body"><div className="visual-device-nav"><i/><i/><i/></div>
       <div className="visual-device-hero"><i/><span/><span/></div>
       <div className="visual-device-widgets"><div><i/><span/><span/></div><div><i/><span/><span/></div><div><i/><span/><span/></div></div>
       <div className="visual-device-lines"><i/><i/><i/></div>
     </div>
     {device==="mobile"&&<span className="visual-device-home-indicator"/>}
   </div>
   <span className="visual-concept-shape visual-concept-shape--one" aria-hidden="true"/>
   <span className="visual-concept-shape visual-concept-shape--two" aria-hidden="true"/>
   <div className="visual-concept-chip">{t.conceptBadge}</div>
 </div>;
}
function MediaVisual({item,locale,modal=false}:{item:CaseMedia;locale:Locale;modal?:boolean}) {
 const t=labels[locale];
 if(item.kind==="video"){
  return <video key={item.src} className={"visual-media"+(modal?" visual-media--modal":"")} controls playsInline preload="metadata" poster={item.poster} aria-label={item.alt}>
    <source src={item.src} type={item.src.toLowerCase().endsWith(".webm")?"video/webm":"video/mp4"}/>
    <track kind="captions" src={item.captions} srcLang="en" label={t.captioned} default/>
    {t.captioned}
  </video>;
 }
 return <Image key={item.src} src={item.src} alt={item.alt} className={"visual-media"+(modal?" visual-media--modal":"")} width={1440} height={900} sizes={modal?"90vw":"(max-width:800px) 95vw, 750px"} priority={false}/>;
}
export function ProjectGallery({projectTitle,features,items,locale="en"}:Props){
 const t=labels[locale];
 const [mode,setMode]=useState<"concept"|"real">(items.length?"real":"concept");
 const [category,setCategory]=useState("all");
 const [index,setIndex]=useState(0);
 const [modalIndex,setModalIndex]=useState<number|null>(null);
 const [mobileStart,setMobileStart]=useState<number|null>(null);
 const opener=useRef<HTMLButtonElement|null>(null),dialog=useRef<HTMLDialogElement|null>(null);
 const concepts=useMemo(()=>features.slice(0,4),[features]);
 const groups=useMemo(()=>Array.from(new Set(items.map(item=>item.group))),[items]);
 const shown=useMemo(()=>category==="all"?items:items.filter(item=>item.group===category),[items,category]);
 const total=mode==="real"?shown.length:concepts.length;
 const chosen=mode==="real"?shown[index]:null;
 const currentConcept=mode==="concept"?concepts[index]:null;
 const currentModal=modalIndex===null?null:shown[modalIndex];
 const switchMode=(next:"concept"|"real")=>{setMode(next);setCategory("all");setIndex(0);setModalIndex(null);};
 const selectCategory=(next:string)=>{setCategory(next);setIndex(0);};
 const move=(delta:number)=>setIndex(old=>(old+delta+total)%total);
 const close=useCallback(()=>{setModalIndex(null);opener.current?.focus();},[]);
 useEffect(()=>{
   const node=dialog.current;if(!node)return;
   if(modalIndex!==null && !node.open){node.showModal();node.querySelector<HTMLButtonElement>(".visual-modal-close")?.focus();}
   if(modalIndex===null && node.open)node.close();
 },[modalIndex]);
 function keys(event:KeyboardEvent<HTMLElement>){
   if(event.key==="ArrowRight"||event.key==="ArrowLeft"){if(event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement)return;
     event.preventDefault();const dir=locale==="en"?1:-1;move(event.key==="ArrowRight"?dir:-dir);}
 }
 function modalKeys(event:KeyboardEvent<HTMLDialogElement>){
   if(event.key==="Escape"){event.preventDefault();close();}
   if((event.key==="ArrowRight"||event.key==="ArrowLeft") && !(event.target instanceof HTMLVideoElement)){event.preventDefault();const delta=event.key==="ArrowRight"?1:-1;setModalIndex(current=>current===null?null:(current+delta+shown.length)%shown.length);}
 }
 const count=t.counter.replace("{current}",String(index+1)).replace("{total}",String(total));
 if(!concepts.length && !items.length)return null;
 return <section className="case-section visual-tour" id="gallery" aria-labelledby="gallery-heading">
   <div className="case-section-label">{t.eyebrow}</div><h2 id="gallery-heading">{t.title}</h2>
   <p className="case-section-lead">{t.intro}</p>
   {items.length>0&&<div className="visual-tour-modes" role="group" aria-label={t.group}>
     <button type="button" aria-pressed={mode==="real"} className={mode==="real"?"visual-mode visual-mode--active":"visual-mode"} onClick={()=>switchMode("real")}>{t.captures} <span>{items.length}</span></button>
     {concepts.length>0&&<button type="button" aria-pressed={mode==="concept"} className={mode==="concept"?"visual-mode visual-mode--active":"visual-mode"} onClick={()=>switchMode("concept")}>{t.concepts} <span>{concepts.length}</span></button>}
   </div>}
   {mode==="real"&&groups.length>1&&<div className="visual-filter" role="group" aria-label={t.group}>
     {[{id:"all",name:t.all},...groups.map(group=>({id:group,name:group}))].map(item=><button type="button" key={item.id} aria-pressed={category===item.id} onClick={()=>selectCategory(item.id)}>{item.name}</button>)}
   </div>}
   <div className="visual-tour-card">
     <div className="visual-tour-top"><span>{mode==="real"?t.real:t.concepts}</span><span role="status" aria-live="polite">{count}</span></div>
     <div className="visual-stage" onTouchStart={(e:TouchEvent<HTMLDivElement>)=>{if(mode==="concept")setMobileStart(e.changedTouches[0]?.clientX??null)}} onTouchEnd={(e:TouchEvent<HTMLDivElement>)=>{if(mode!=="concept"||mobileStart===null)return;const delta=(e.changedTouches[0]?.clientX??mobileStart)-mobileStart;setMobileStart(null);if(Math.abs(delta)>55)move(delta<0?1:-1);}}>
       {mode==="concept"&&currentConcept?<ConceptVisual index={index} title={currentConcept.title} locale={locale}/>:
        chosen?<div className={"visual-approved visual-approved--"+(chosen.device??"desktop")}>
          <MediaVisual item={chosen} locale={locale}/>
          <span className="visual-approved-badge">{chosen.kind==="video"?t.video:t.evidence}</span>
        </div>:null}
     </div>
     <div className="visual-stage-caption">
       <div><strong>{mode==="concept"?(currentConcept?.title??projectTitle):chosen?.caption}</strong>
         <p>{mode==="concept"?t.conceptNote:chosen?.alt}</p>
       </div>
       {mode==="real"&&chosen&&<button ref={node=>{if(node && !opener.current)opener.current=node}} type="button" className="visual-open" onClick={event=>{opener.current=event.currentTarget;setModalIndex(index);}}>{t.open} <span aria-hidden="true">↗</span></button>}
     </div>
     <div className="visual-tour-controls" onKeyDown={keys}>
       <button type="button" aria-label={t.previous} onClick={()=>move(-1)} disabled={total<=1}><span aria-hidden="true">←</span> {t.previous}</button>
       <div className="visual-thumb-list" role="group" aria-label={t.thumb}>
         {Array.from({length:total},(_,i)=><button type="button" className={i===index?"visual-thumb visual-thumb--current":"visual-thumb"} aria-pressed={i===index} key={mode==="concept"?"concept-"+i:shown[i]?.src}
           onClick={()=>setIndex(i)} aria-label={t.thumb+" "+(i+1)+": "+(mode==="concept"?concepts[i].title:shown[i].caption)}>{String(i+1).padStart(2,"0")}</button>)}
       </div>
       <button type="button" aria-label={t.next} onClick={()=>move(1)} disabled={total<=1}>{t.next} <span aria-hidden="true">→</span></button>
     </div>
   </div>
   {mode==="concept"&&<p className="visual-awaiting">{t.noCaptures}</p>}
   <dialog ref={dialog} className="visual-lightbox" aria-label={t.modalTitle}
     onCancel={event=>{event.preventDefault();close();}} onClose={()=>{setModalIndex(null);opener.current?.focus();}}
     onKeyDown={modalKeys} onClick={event=>{if(event.target===event.currentTarget)close();}}>
     <div className="visual-modal-shell">
       <div className="visual-modal-bar"><span>{t.modalTitle} · {modalIndex===null?"":t.counter.replace("{current}",String(modalIndex+1)).replace("{total}",String(shown.length))}</span>
         <button type="button" className="visual-modal-close" onClick={close}>{t.close} ×</button></div>
       {currentModal&&<><div className="visual-modal-stage"><MediaVisual item={currentModal} locale={locale} modal/></div>
         <div className="visual-modal-caption"><span>{currentModal.caption}</span><div>
           <button type="button" disabled={shown.length<2} aria-label={t.previous} onClick={()=>setModalIndex(x=>x===null?x:(x-1+shown.length)%shown.length)}>←</button>
           <button type="button" disabled={shown.length<2} aria-label={t.next} onClick={()=>setModalIndex(x=>x===null?x:(x+1)%shown.length)}>→</button>
         </div></div></>}
     </div>
   </dialog>
 </section>;
}
