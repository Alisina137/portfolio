'use client';
import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProjectCard } from '@/components/project-card';
import { catalogHref, caseHref, listCatalog, normalizeCatalogQuery, optionsFor } from '@/lib/catalog';
import type { CatalogQuery } from '@/lib/catalog';
import type { Project } from '@/lib/content';
import { getUi } from '@/lib/i18n-client';
import { localizePath } from '@/lib/i18n-core.mjs';
export function LocaleCatalogExplorer({ projects, locale }: { projects: Project[]; locale: 'fa'|'ps' }) {
  const ui = getUi(locale);
  const path = usePathname();
  const router = useRouter();
  const urlParams = useSearchParams();
  const params = new URLSearchParams(urlParams.toString());
  const current = normalizeCatalogQuery(params, projects);
  const { categories, statuses } = optionsFor(projects);
  const result = listCatalog(projects, current);
  const [input, setInput] = useState(current.q);
  const [advanced, setAdvanced] = useState(Boolean(current.status || current.sort !== 'featured'));
  const [pending, startTransition] = useTransition();
  useEffect(() => setInput(current.q), [current.q]);
  function navigate(changes: Partial<CatalogQuery>, replace = false) {
    const target = localizePath(locale, catalogHref({ ...current, ...changes, page: changes.page ?? 1 }));
    startTransition(() => replace ? router.replace(target, { scroll: false }) : router.push(target, { scroll: false }));
  }
  useEffect(() => {
    if (input === current.q) return;
    const timer = window.setTimeout(() => navigate({q:input}, true), 250);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, current.q]);
  const reset = () => { setInput(''); startTransition(() => router.push(localizePath(locale, '/projects'), {scroll:false})); };
  const filtered = Boolean(current.q || current.category || current.status || current.sort !== 'featured');
  const label = (key: string) => key in ui ? ui[key as keyof typeof ui] : key;
  return <div className="catalog-shell" aria-busy={pending || undefined}>
    <div className="catalog-panel">
      <form className="catalog-search" role="search" onSubmit={event => { event.preventDefault(); navigate({q:input}); }}>
        <label htmlFor="locale-project-search">{ui.searchLabel}</label>
        <div className="catalog-search-row"><span aria-hidden="true">⌕</span><input id="locale-project-search" type="search" autoComplete="off" value={input} maxLength={100} dir="auto" placeholder={ui.searchPlaceholder} onChange={event => setInput(event.target.value)} /><button type="submit" className="catalog-search-submit">{ui.search}</button></div>
      </form>
      <div className="catalog-filter-label">{ui.categoryLabel}</div>
      <div className="catalog-chips" role="group" aria-label={ui.categoryLabel}>{['', ...categories].map(category => <button type="button" key={category || 'all'} aria-pressed={current.category === category} className={`catalog-chip ${current.category === category ? 'catalog-chip--active' : ''}`} onClick={() => navigate({category})}>{category ? label(category) : ui.allCategories}</button>)}</div>
      <button className="catalog-advanced-toggle" type="button" aria-expanded={advanced} aria-controls="locale-catalog-advanced" onClick={() => setAdvanced(!advanced)}>{ui.advanced} <span aria-hidden="true">{advanced ? '−' : '+'}</span></button>
      <div id="locale-catalog-advanced" className={`catalog-advanced ${advanced ? 'catalog-advanced--open' : ''}`}>
        <div className="catalog-select-group"><label htmlFor="locale-status">{ui.statusLabel}</label><select id="locale-status" value={current.status} onChange={event => navigate({status:event.target.value})}><option value="">{ui.allStatuses}</option>{statuses.map(status => <option value={status} key={status}>{label(status)}</option>)}</select></div>
        <div className="catalog-select-group"><label htmlFor="locale-sort">{ui.sortLabel}</label><select id="locale-sort" value={current.sort} onChange={event => navigate({sort:event.target.value as CatalogQuery['sort']})}><option value="featured">{ui.sortFeatured}</option><option value="newest">{ui.sortNewest}</option><option value="az">{ui.sortAZ}</option></select></div>
      </div>
    </div>
    <div className="catalog-results-bar"><p role="status" aria-live="polite">{ui.showing} <strong>{result.showing}</strong> {ui.of} <strong>{result.total}</strong> {ui.matching} <span className="catalog-unfiltered">({projects.length} {ui.published})</span></p>{filtered && <button type="button" className="text-action" onClick={reset}>{ui.clear} ×</button>}</div>
    {result.total > 0 ? <><div className="catalog-grid" aria-label={ui.matching}>{result.visible.map((project, i) => <ProjectCard key={project.slug} project={project} index={i} context="catalog" locale={locale} detailHref={localizePath(locale,caseHref(project.slug,current))}/>)}</div>{result.hasMore && <div className="catalog-load"><button className="button button-outline" type="button" onClick={() => navigate({page:result.page+1})}>{ui.loadMore} ↓</button><p>{result.total-result.showing} {ui.moreExplore}</p></div>}</> : <div className="catalog-empty"><span className="catalog-empty-symbol" aria-hidden="true">⌕</span><h2>{ui.emptyTitle}</h2><p>{ui.emptyBody}</p><button className="button button-primary" onClick={reset} type="button">{ui.clear}</button></div>}
    <div className="catalog-end"><span>{ui.moreComing}</span><p>{ui.moreComingBody}</p><a href="https://github.com/Alisina137" target="_blank" rel="noopener noreferrer">{ui.githubRepos} ↗</a></div>
  </div>;
}
