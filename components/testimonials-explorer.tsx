"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { localizePath } from "@/lib/i18n-core.mjs";
import type { PublicTestimonial, TestimonialLocale } from "@/lib/testimonials";

export type TestimonialWords = {
  testimonialAll: string; testimonialClient: string; testimonialCollaborator: string;
  testimonialColleague: string; testimonialMentor: string; testimonialFilter: string;
  testimonialCount: string; testimonialReadCase: string; testimonialProfile: string;
  testimonialPermission: string; testimonialNoMatches: string; testimonialClear: string;
};
const filters = ["all", "client", "collaborator", "colleague", "mentor"] as const;
type Filter = typeof filters[number];
export function TestimonialsExplorer({ records, locale, words }: { records: PublicTestimonial[]; locale: TestimonialLocale; words: TestimonialWords }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(() => records.filter(item => filter === "all" || item.relationship === filter), [records, filter]);
  const labels: Record<Filter,string> = {
    all:words.testimonialAll, client:words.testimonialClient,
    collaborator:words.testimonialCollaborator, colleague:words.testimonialColleague, mentor:words.testimonialMentor
  };
  const activeFilters = filters.filter(value => value === "all" || records.some(item => item.relationship === value));
  return <div className="testimonial-explorer">
    <div className="testimonial-toolbar">
      <div className="testimonial-filters" role="group" aria-label={words.testimonialFilter}>
        {activeFilters.map(value => <button key={value} type="button" className={filter === value ? "testimonial-filter testimonial-filter--active" : "testimonial-filter"}
          aria-pressed={filter === value} onClick={() => setFilter(value)}>{labels[value]}</button>)}
      </div>
      <p className="testimonial-count" role="status" aria-live="polite">{words.testimonialCount.replace("{count}", String(visible.length)).replace("{total}", String(records.length))}</p>
    </div>
    {visible.length > 0 ? <div className="testimonial-grid">{visible.map(item => <figure key={item.id} className="testimonial-card">
      <div className="testimonial-card-top"><span className="testimonial-quote-mark" aria-hidden="true">“</span><span className="testimonial-relationship">{labels[item.relationship]}</span></div>
      <blockquote lang={item.language} dir="auto"><p>{item.quote}</p></blockquote>
      <figcaption><span className="testimonial-avatar" aria-hidden="true">{item.name.trim().split(/\s+/u).slice(0,2).map(x=>x.charAt(0)).join("").toUpperCase()}</span>
        <span className="testimonial-person"><strong>{item.name}</strong><span>{item.role}{item.organization ? ` · ${item.organization}` : ""}</span></span></figcaption>
      <div className="testimonial-card-context"><p>{item.context}</p>
        <div className="testimonial-card-links">{item.projectSlug && item.projectTitle && <Link href={localizePath(locale, "/projects/"+item.projectSlug)}>{words.testimonialReadCase}: {item.projectTitle} <ArrowUpRightIcon width="15" height="15"/></Link>}
          {item.profileUrl && <a href={item.profileUrl} target="_blank" rel="noopener noreferrer">{words.testimonialProfile}<ArrowUpRightIcon width="15" height="15"/><span className="sr-only">({locale === "en" ? "opens in a new tab" : "↗"})</span></a>}</div>
      </div>
      <span className="testimonial-consent">{words.testimonialPermission}</span>
    </figure>)}</div> :
      <div className="testimonial-no-matches"><p>{words.testimonialNoMatches}</p><button type="button" onClick={() => setFilter("all")}>{words.testimonialClear}</button></div>}
  </div>;
}
