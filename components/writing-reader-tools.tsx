"use client";
import { useEffect,useState } from "react";

type Heading={id:string;text:string;level:number};

/** Sticky reading percentage and active table of contents. No analytics or tracking. */
export function WritingReaderTools({headings}:{headings:Heading[]}){
  const [percent,setPercent]=useState(0);
  const [active,setActive]=useState("");
  useEffect(()=>{
    let frame=0;
    const update=()=>{
      const region=document.getElementById("writing-reading-content");
      if(!region)return;
      const rect=region.getBoundingClientRect(),start=window.scrollY+rect.top;
      const end=start+Math.max(1,rect.height)-Math.min(window.innerHeight*.55,450);
      const position=window.scrollY+Math.min(window.innerHeight*.25,200);
      setPercent(Math.round(Math.max(0,Math.min(100,(position-start)/Math.max(1,end-start)*100))));
      const items=headings.map(h=>document.getElementById(h.id)).filter((item):item is HTMLElement=>Boolean(item));
      const visible=items.filter(item=>item.getBoundingClientRect().top<=180);
      setActive(visible.length?visible[visible.length-1].id:"");
    };
    const onScroll=()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;update();});};
    update();window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",onScroll);};
  },[headings]);
  return <>
    <div className="writing-reading-progress" role="progressbar" aria-label="Article reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <span style={{transform:`scaleX(${percent/100})`}}/>
    </div>
    <nav aria-label="Article sections" className="writing-reader-toc">
      {headings.filter(heading=>heading.level===2).map(heading=><a key={heading.id} href={`#${heading.id}`} aria-current={active===heading.id?"location":undefined}>{heading.text}</a>)}
    </nav>
  </>;
}

/** Native share where supported, otherwise clipboard with a meaningful error state. */
export function WritingShare({title}:{title:string}){
  const [message,setMessage]=useState("");
  async function share(){
    const url=window.location.href.split("#")[0];
    try{
      if(navigator.share){
        await navigator.share({title,url});
        setMessage("Share sheet opened.");
      }else if(navigator.clipboard?.writeText){
        await navigator.clipboard.writeText(url);setMessage("Article link copied.");
      }else setMessage("Copy the article address from your browser.");
    }catch(error){
      if((error as Error)?.name==="AbortError")return;
      setMessage("Sharing is unavailable. Copy the URL from your browser.");
    }
  }
  return <div className="writing-share-actions">
    <button type="button" onClick={share} className="button button-outline">Share article ↗</button>
    <a href="#top" className="button button-outline">Back to top ↑</a>
    <span role="status" aria-live="polite" className="writing-share-feedback">{message}</span>
  </div>;
}
