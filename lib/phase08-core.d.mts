export function studioConfig(env?: NodeJS.ProcessEnv):{enabled:boolean;origin:string;repo:string|undefined;ownerId:string};
export function contactConfig(env?: NodeJS.ProcessEnv):{enabled:boolean;siteKey:string};
export function safeText(input:unknown,min:number,max:number,multiline?:boolean):string|null;
export function validateContact(input:unknown):null|{name:string;email:string;subject:string;message:string;turnstileToken:string};
export function hashLimiterKey(ip:string,secret:string):string;
export function validSameOrigin(request:{headers:Headers},configuredOrigin:string):boolean;
export function validateStudioChange(input:{kind:string;slug?:string;fields:Record<string,unknown>},baseline:Record<string,unknown>):Record<string,any>|{record:Record<string,any>;body:string|null}|null;
export function validMediaDetails(input:Record<string,unknown>):null|{slug:string;group:string;alt:string;caption:string};
