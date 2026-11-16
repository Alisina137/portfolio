export type MeasuredOutcome={id:string;title:string;value:number;unit:string;timeframe:string;methodology:string;sourceUrl:string;projectSlug?:string;ownerApproved:true;evidenceReviewed:true;};
export function approvedMeasuredOutcomes(data: unknown): MeasuredOutcome[];
