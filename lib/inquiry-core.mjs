/**
 * Phase 19: client-only, non-networking inquiry draft construction.
 * The completed brief is not a submission, appointment, or availability promise.
 */
export const INQUIRY_INTENTS=Object.freeze(["employment","contract","collaboration"]);
export const INQUIRY_FOCUSES=Object.freeze(["unsure","web","mobile","backend","data","fullstack","improvements"]);
export const INQUIRY_TIMINGS=Object.freeze(["flexible","soon","later"]);
const invalidControl=/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u;
const plain=(x,min,max,multiline=false)=>{
  if(typeof x!=="string"||invalidControl.test(x))return null;
  const text=x.trim().replace(/\r\n?/gu,"\n");
  if(text.length<min||text.length>max||(!multiline&&/[\r\n]/u.test(text)))return null;
  return text;
};
export function validateInquiry(input){
  if(!input||typeof input!=="object"||Array.isArray(input))return null;
  if(!INQUIRY_INTENTS.includes(input.intent)||!INQUIRY_FOCUSES.includes(input.focus)||!INQUIRY_TIMINGS.includes(input.timing))return null;
  const goal=plain(input.goal,6,120);
  const details=plain(input.details,20,1200,true);
  if(!goal||!details)return null;
  return {intent:input.intent,focus:input.focus,timing:input.timing,goal,details};
}
const defaults={
  intent:{employment:"Engineering role",contract:"Project or contract",collaboration:"Technical collaboration"},
  focus:{unsure:"Open to discussion",web:"Web applications",mobile:"Mobile applications",backend:"Backend APIs",data:"Database design",fullstack:"Full-stack development",improvements:"UI and workflow improvements"},
  timing:{flexible:"Flexible",soon:"Soon",later:"Later"},
  headings:{type:"Opportunity type",focus:"Focus area",timing:"Suggested timing",goal:"Role or goal",details:"Context"},
  subjectPrefix:"Portfolio inquiry"
};
export function formatInquiry(input,labels=defaults){
  const value=validateInquiry(input);
  if(!value)return null;
  const dictionary=labels||defaults;
  const subject=`${dictionary.subjectPrefix}: ${value.goal}`.slice(0,140);
  const body=[
    `${dictionary.headings.type}: ${dictionary.intent[value.intent]}`,
    `${dictionary.headings.focus}: ${dictionary.focus[value.focus]}`,
    `${dictionary.headings.timing}: ${dictionary.timing[value.timing]}`,
    `${dictionary.headings.goal}: ${value.goal}`,
    "",
    `${dictionary.headings.details}:\n${value.details}`
  ].join("\n");
  return {subject,body};
}
