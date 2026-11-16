export type AvailabilityStatus="not_shared"|"open"|"selective"|"unavailable";
export type EmploymentType="full_time"|"part_time"|"contract"|"internship";
export type WorkMode="remote"|"hybrid"|"on_site";
export type WorkRegion="afghanistan"|"international_remote";
export type FocusArea="web"|"mobile"|"backend"|"data"|"fullstack"|"improvements";
export type AvailabilityInput={
 schemaVersion:1;ownerApproval:"owner_pending"|"owner_approved";
 status:AvailabilityStatus;employmentTypes:EmploymentType[];workModes:WorkMode[];
 regions:WorkRegion[];focus:FocusArea[];reviewedAt:string|null;validUntil:string|null;note:string|null;
};
export type PublicAvailability=Omit<AvailabilityInput,"schemaVersion"|"ownerApproval"> & {reviewedAt:string;validUntil:string;status:Exclude<AvailabilityStatus,"not_shared">};
export declare const AVAILABILITY_STATUSES:readonly AvailabilityStatus[];
export declare const EMPLOYMENT_TYPES:readonly EmploymentType[];
export declare const WORK_MODES:readonly WorkMode[];
export declare const WORK_REGIONS:readonly WorkRegion[];
export declare const FOCUS_AREAS:readonly FocusArea[];
export declare function validateAvailabilityRecord(value:unknown):value is AvailabilityInput;
export declare function isPublicAvailability(value:AvailabilityInput,today?:string):boolean;
export declare function projectPublicAvailability(value:AvailabilityInput,today?:string):PublicAvailability|null;
