export type Relationship = "client" | "collaborator" | "colleague" | "mentor";
export type ApprovedTestimonial = {
  id: string; name: string; role: string; organization?: string;
  relationship: Relationship; quote: string; context: string;
  projectSlug?: string; profileUrl?: string; language: "en" | "fa" | "ps";
};
export declare const RELATIONSHIP_TYPES: readonly Relationship[];
export declare function isApprovedTestimonial(row: unknown): boolean;
export declare function approvedTestimonials(data: { entries?: unknown[] } | null | undefined): ApprovedTestimonial[];
