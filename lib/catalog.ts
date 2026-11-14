/** Pure catalog rules; no React or network access. URL state is the source of truth. */
export type CatalogSort = "featured" | "newest" | "az";
export type CatalogQuery = {
  q: string;
  category: string;
  status: string;
  sort: CatalogSort;
  page: number;
};

export type SearchableProject = {
  slug: string;
  title: string;
  oneLiner: string;
  category: string;
  developmentStatus: string;
  technologies: string[];
  featuredOrder?: number;
  projectDate?: string; // Owner-verified project date, never repository modification time.
};
export const PAGE_SIZE = 9;

function paramValue(value: string | null | undefined): string { return typeof value === "string" ? value : ""; }
export function fold(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("en").replace(/\s+/gu, " ").trim();
}
export function optionsFor(projects: SearchableProject[]) {
  return {
    categories: [...new Set(projects.map(p => p.category))].sort((a, b) => a.localeCompare(b)),
    statuses: [...new Set(projects.map(p => p.developmentStatus))].sort(),
  };
}
export function normalizeCatalogQuery(search: URLSearchParams, projects: SearchableProject[]): CatalogQuery {
  const { categories, statuses } = optionsFor(projects);
  const requestedCategory = paramValue(search.get("category"));
  const requestedStatus = paramValue(search.get("status"));
  const requestedSort = search.get("sort");
  const rawPage = search.get("page") ?? "1";
  return {
    q: paramValue(search.get("q")).normalize("NFKC").replace(/\s+/gu, " ").trim().slice(0, 100),
    category: categories.find(v => fold(v) === fold(requestedCategory)) ?? "",
    status: statuses.find(v => fold(v) === fold(requestedStatus)) ?? "",
    sort: requestedSort === "newest" || requestedSort === "az" ? requestedSort : "featured",
    page: /^\d{1,3}$/.test(rawPage) && Number(rawPage) >= 1 ? Number(rawPage) : 1,
  };
}
export function listCatalog<T extends SearchableProject>(projects: T[], input: CatalogQuery) {
  const normalizedNeedle = fold(input.q);
  const filtered = projects.filter(p => {
    if (input.category && input.category !== p.category) return false;
    if (input.status && input.status !== p.developmentStatus) return false;
    if (!normalizedNeedle) return true;
    return fold([p.title, p.oneLiner, p.category, ...p.technologies].join(" ")).includes(normalizedNeedle);
  });
  const ordered = filtered.slice().sort((a, b) => {
    const byTitle = a.title.localeCompare(b.title);
    if (input.sort === "az") return byTitle;
    if (input.sort === "newest") {
      const dateA = /^\d{4}-\d{2}-\d{2}$/.test(a.projectDate ?? "") ? a.projectDate! : "";
      const dateB = /^\d{4}-\d{2}-\d{2}$/.test(b.projectDate ?? "") ? b.projectDate! : "";
      if (dateA !== dateB) return dateB.localeCompare(dateA);
      return byTitle;
    }
    return (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER) || byTitle;
  });
  const totalPages = Math.max(1, Math.ceil(ordered.length / PAGE_SIZE));
  const page = Math.max(1, Math.min(input.page, totalPages));
  return {
    matches: ordered,
    visible: ordered.slice(0, page * PAGE_SIZE),
    showing: Math.min(ordered.length, page * PAGE_SIZE),
    page,
    totalPages,
    total: ordered.length,
    hasMore: page < totalPages,
  };
}
export function catalogHref(state: Partial<CatalogQuery>): string {
  const search = new URLSearchParams();
  if (state.q) search.set("q", state.q.slice(0, 100));
  if (state.category) search.set("category", state.category);
  if (state.status) search.set("status", state.status);
  if (state.sort && state.sort !== "featured") search.set("sort", state.sort);
  if (state.page && state.page > 1) search.set("page", String(Math.min(999, Math.trunc(state.page))));
  const suffix = search.toString();
  return suffix ? `/projects?${suffix}` : "/projects";
}
export function caseHref(slug: string, state: Partial<CatalogQuery>): string {
  const path = `/projects/${encodeURIComponent(slug)}`;
  const filters = catalogHref(state).split("?")[1];
  return filters ? `${path}?back=${encodeURIComponent(filters)}` : path;
}
export function returnToCatalog(backValue: string | string[] | undefined, projects: SearchableProject[]): string {
  if (!backValue || typeof backValue !== "string" || backValue.length > 600 || backValue.includes("#")) return "/projects";
  const params = new URLSearchParams(backValue);
  const state = normalizeCatalogQuery(params, projects);
  return catalogHref(state);
}
export function relatedProjects<T extends SearchableProject>(current: T, published: T[]): T[] {
  return published.filter(p => p.slug !== current.slug).map(p => ({
    project: p,
    score: (p.category === current.category ? 10 : 0) +
      p.technologies.filter(t => current.technologies.includes(t)).length,
  })).sort((a, b) => b.score - a.score || a.project.title.localeCompare(b.project.title))
    .slice(0, 2).map(({ project }) => project);
}
