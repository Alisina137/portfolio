"use client";
import { useRef, useState } from "react";
import { formatInquiry, validateInquiry, type InquiryInput, type InquiryIntent, type InquiryFocus, type InquiryTiming, type InquiryLabels } from "@/lib/inquiry-core.mjs";

type Words={
  inquiryEmployment:string;inquiryEmploymentDesc:string;inquiryContract:string;inquiryContractDesc:string;
  inquiryCollaboration:string;inquiryCollaborationDesc:string;inquiryFocus:string;inquiryFocusUnsure:string;
  inquiryTiming:string;inquiryFlexible:string;inquirySoon:string;inquiryLater:string;
  inquiryGoal:string;inquiryGoalHint:string;inquiryDetails:string;inquiryDetailsHint:string;
  inquiryPreview:string;inquiryPreviewIntro:string;inquiryGenerate:string;inquiryCopy:string;
  inquiryCopied:string;inquiryCopyManual:string;inquiryInvalid:string;inquiryNotSent:string;
  inquiryOpenEmail:string;inquiryUseForm:string;inquiryFormReady:string;inquiryReady:string;
};
type Option={id:InquiryFocus;title:string};
type Props={words:Words;labels:InquiryLabels;focusOptions:Option[];email:string|null;formEnabled:boolean};
const empty:InquiryInput={intent:"employment",focus:"unsure",timing:"flexible",goal:"",details:""};

export function InquiryPlanner({words,labels,focusOptions,email,formEnabled}:Props){
  const [draft,setDraft]=useState<InquiryInput>(empty);
  const [generated,setGenerated]=useState<{subject:string;body:string}|null>(null);
  const [status,setStatus]=useState("");
  const [manual,setManual]=useState(false);
  const preview=useRef<HTMLTextAreaElement>(null);
  const update=<K extends keyof InquiryInput>(key:K,value:InquiryInput[K])=>{
    setDraft(old=>({...old,[key]:value}));setGenerated(null);setStatus("");setManual(false);
  };
  const intents=[
    {id:"employment" as InquiryIntent,title:words.inquiryEmployment,desc:words.inquiryEmploymentDesc},
    {id:"contract" as InquiryIntent,title:words.inquiryContract,desc:words.inquiryContractDesc},
    {id:"collaboration" as InquiryIntent,title:words.inquiryCollaboration,desc:words.inquiryCollaborationDesc}
  ];
  const timeOptions=[
    {id:"flexible" as InquiryTiming,label:words.inquiryFlexible},
    {id:"soon" as InquiryTiming,label:words.inquirySoon},
    {id:"later" as InquiryTiming,label:words.inquiryLater}
  ];
  const build=()=>{const result=formatInquiry(draft,labels);if(!result){setStatus(words.inquiryInvalid);return null;}
    setGenerated(result);setStatus(words.inquiryReady);setManual(false);return result;};
  const copy=async()=>{
    const value=generated||build();if(!value)return;
    const message=`${value.subject}\n\n${value.body}`;
    try{if(!navigator.clipboard?.writeText)throw Error("Unsupported");await navigator.clipboard.writeText(message);
      setManual(false);setStatus(words.inquiryCopied);
    }catch{setManual(true);setStatus(words.inquiryCopyManual);
      requestAnimationFrame(()=>{preview.current?.focus();preview.current?.select();});
    }
  };
  const fillForm=()=>{
    const value=generated||build();if(!value)return;
    window.dispatchEvent(new CustomEvent("portfolio:inquiry-draft",{detail:{subject:value.subject,body:value.body}}));
    setStatus(words.inquiryFormReady);
  };
  const result=generated;
  return <div className="inquiry-planner">
    <div className="inquiry-choice" role="group" aria-label={labels.headings.type}>{intents.map(item=><button key={item.id} type="button"
      className={draft.intent===item.id?"inquiry-choice-card inquiry-choice-card--active":"inquiry-choice-card"}
      aria-pressed={draft.intent===item.id} onClick={()=>update("intent",item.id)}>
      <span className="inquiry-choice-indicator" aria-hidden="true">{draft.intent===item.id?"●":"○"}</span>
      <strong>{item.title}</strong><small>{item.desc}</small>
    </button>)}</div>
    <div className="inquiry-workspace">
      <div className="inquiry-fields">
        <div className="inquiry-field-row">
          <label className="inquiry-field"><span>{words.inquiryFocus}</span><select value={draft.focus} onChange={e=>update("focus",e.target.value as InquiryFocus)}>
            <option value="unsure">{words.inquiryFocusUnsure}</option>{focusOptions.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}
          </select></label>
          <label className="inquiry-field"><span>{words.inquiryTiming}</span><select value={draft.timing} onChange={e=>update("timing",e.target.value as InquiryTiming)}>
            {timeOptions.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}
          </select></label>
        </div>
        <label className="inquiry-field"><span>{words.inquiryGoal}</span><input maxLength={120} minLength={6} required
          placeholder={words.inquiryGoalHint} value={draft.goal} onChange={e=>update("goal",e.target.value)}/></label>
        <label className="inquiry-field"><span>{words.inquiryDetails}</span><textarea maxLength={1200} minLength={20} required
          placeholder={words.inquiryDetailsHint} rows={6} value={draft.details} onChange={e=>update("details",e.target.value)}/></label>
        <p className="inquiry-field-note">{words.inquiryNotSent}</p>
        <button type="button" className="button button-primary" onClick={build} disabled={!validateInquiry(draft)}>{words.inquiryGenerate} ↗</button>
      </div>
      <div className="inquiry-preview" aria-labelledby="inquiry-preview-title">
        <span className="inquiry-preview-kicker">01 / 02 / 03</span>
        <h3 id="inquiry-preview-title">{words.inquiryPreview}</h3>
        <p>{words.inquiryPreviewIntro}</p>
        <textarea ref={preview} readOnly rows={9} value={result?`${result.subject}\n\n${result.body}`:""} aria-label={words.inquiryPreview}
          placeholder={words.inquiryPreviewIntro} className="inquiry-preview-output"/>
        <div className="inquiry-preview-actions">
          <button type="button" className="button button-outline" disabled={!result} onClick={copy}>{words.inquiryCopy}</button>
          {formEnabled&&<button type="button" className="button button-outline" disabled={!result} onClick={fillForm}>{words.inquiryUseForm}</button>}
          {!formEnabled && email && result && <a className="button button-outline" href={`mailto:${email}?subject=${encodeURIComponent(result.subject)}&body=${encodeURIComponent(result.body)}`}>{words.inquiryOpenEmail} ↗</a>}
        </div>
        <p className="inquiry-state" aria-live="polite" role="status">{status}{manual&&" ↑"}</p>
      </div>
    </div>
  </div>;
}
