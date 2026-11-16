export type InquiryIntent="employment"|"contract"|"collaboration";
export type InquiryFocus="unsure"|"web"|"mobile"|"backend"|"data"|"fullstack"|"improvements";
export type InquiryTiming="flexible"|"soon"|"later";
export type InquiryInput={intent:InquiryIntent;focus:InquiryFocus;timing:InquiryTiming;goal:string;details:string};
export type InquiryLabels={
 intent:Record<InquiryIntent,string>;focus:Record<InquiryFocus,string>;timing:Record<InquiryTiming,string>;
 headings:{type:string;focus:string;timing:string;goal:string;details:string};subjectPrefix:string;
};
export declare const INQUIRY_INTENTS:readonly InquiryIntent[];
export declare const INQUIRY_FOCUSES:readonly InquiryFocus[];
export declare const INQUIRY_TIMINGS:readonly InquiryTiming[];
export declare function validateInquiry(value:unknown):InquiryInput|null;
export declare function formatInquiry(value:unknown,labels?:InquiryLabels):{subject:string;body:string}|null;
