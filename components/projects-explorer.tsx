"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Project } from "@/lib/content";
import { getDevelopmentLabel } from "@/lib/status";
import { ProjectCard } from "@/components/project-card";
import { caseHref, catalogHref, listCatalog, normalizeCatalogQuery, optionsFor } from "@/lib/catalog";
import type { CatalogQuery } from "@/lib/catalog";

type Props = { projects: Project[] };

export function ProjectsExplorer({ projects }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const filtersRef = useRef<HTMLDivElement>(null);
  const current = normalizeCatalogQuery(new URLSearchParams(searchParams.toString()), projects);
  const [searchText, setSearchText] = useState(current.q);
  const [advanced, setAdvanced] = useState(Boolean(current.status || current.sort !== "featured"));
  const { categories, statuses } = optionsFor(projects);
  const result = listCatalog(projects, current);
  const hasFilters = Boolean(current.q || current.category || current.status || current.sort !== "featured");

  useEffect(() => { setSearchText(current.q); }, [current.q]);

  function navigate(changes: Partial<CatalogQuery>, replace = false) {
    const destination = catalogHref({ ...current, ...changes, page: changes.page ?? 1 });
    if (`${pathname}${searchParams.toString() ? `?${searchParams}` : ""}` === destination) return;
    startTransition(() => replace ? router.replace(destination, { scroll: false }) : router.push(destination, { scroll: false }));
  }

  useEffect(() => {
    // Debounce typing; Enter uses an immediate submit instead.
    if (searchText === current.q) return;
    const timer = window.setTimeout(() => navigate({ q: searchText }, true), 220);
    return () => window.clearTimeout(timer);
    // Only text changes schedule a search; URL state changes are synchronized above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, current.q]);

  function clearFilters() {
    setSearchText("");
    startTransition(() => router.push("/projects", { scroll: false }));
  }

  return <div className="catalog-shell" aria-busy={pending || undefined}>
    <div className="catalog-panel" ref={filtersRef}>
      <form className="catalog-search" role="search" onSubmit={event => { event.preventDefault(); navigate({ q: searchText }); }}>
        <label htmlFor="project-search">Search projects</label>
        <div className="catalog-search-row"><span aria-hidden="true">⌕</span><input id="project-search" name="q" type="search" autoComplete="off" maxLength={100} value={searchText} placeholder="Search projects…" onChange={event => setSearchText(event.target.value)} /><button type="submit" className="catalog-search-submit">Search</button></div>
      </form>
      <div className="catalog-filter-label">Browse by category</div>
      <div className="catalog-chips" role="group" aria-label="Project categories">
        {["", ...categories].map(cat => <button type="button" key={cat || "all"} className={`catalog-chip ${current.category === cat ? "catalog-chip--active" : ""}`} aria-pressed={current.category === cat} onClick={() => navigate({ category: cat })}>{cat || "All projects"}</button>)}
      </div>
      <button type="button" className="catalog-advanced-toggle" aria-expanded={advanced} aria-controls="catalog-advanced" onClick={() => setAdvanced(!advanced)}>Status & sorting <span aria-hidden="true">{advanced ? "−" : "+"}</span></button>
      <div id="catalog-advanced" className={`catalog-advanced ${advanced ? "catalog-advanced--open" : ""}`}>
        <div className="catalog-select-group"><label htmlFor="catalog-status">Development status</label><select id="catalog-status" value={current.status} onChange={event => navigate({ status: event.target.value })}><option value="">All statuses</option>{statuses.map(status => <option key={status} value={status}>{getDevelopmentLabel(status as Project["developmentStatus"])}</option>)}</select></div>
        <div className="catalog-select-group"><label htmlFor="catalog-sort">Sort projects</label><select id="catalog-sort" value={current.sort} onChange={event => navigate({ sort: event.target.value as CatalogQuery["sort"] })}><option value="featured">Featured</option><option value="newest">Newest verified date</option><option value="az">Name A–Z</option></select></div>
      </div>
    </div>
    <div className="catalog-results-bar"><p role="status" aria-live="polite">Showing <strong>{result.showing}</strong> of <strong>{result.total}</strong> matching {result.total === 1 ? "project" : "projects"} <span className="catalog-unfiltered">({projects.length} published)</span></p>{hasFilters && <button type="button" className="text-action" onClick={clearFilters}>Clear filters ×</button>}</div>
    {result.total > 0 ? <>
      <div className="catalog-grid" aria-label="Project results">{result.visible.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} context="catalog" detailHref={caseHref(project.slug, current)} />)}</div>
      {result.hasMore && <div className="catalog-load"><button className="button button-outline" type="button" onClick={() => navigate({ page: result.page + 1 })}>Load more projects <span aria-hidden="true">↓</span></button><p>{result.total - result.showing} more to explore</p></div>}
    </> : <div className="catalog-empty"><span className="catalog-empty-symbol" aria-hidden="true">⌕</span><h2>No projects match these filters.</h2><p>Try another keyword, category, or development status.</p><button type="button" className="button button-primary" onClick={clearFilters}>Clear filters</button></div>}
    <div className="catalog-end"><span>MORE TO COME</span><p>Some projects are still being reviewed for public portfolio publication. Browse the current source repositories for additional work.</p><a href="https://github.com/Alisina137" target="_blank" rel="noopener noreferrer">Explore GitHub repositories ↗</a></div>
  </div>;
}
