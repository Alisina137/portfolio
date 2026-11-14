/** Origin configuration is public information, not a secret. */
export function getSiteUrl(env = process.env) {
  const value = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/") return null;
    const isLocal = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.protocol !== "https:" && !isLocal) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** An explicit launch switch and a real HTTPS origin are both required. */
export function isPublicIndexingEnabled(env = process.env) {
  const url = getSiteUrl(env);
  return env.PORTFOLIO_LAUNCH_APPROVED === "true" && Boolean(url?.startsWith("https://"));
}

export function getPageUrl(pathname, env = process.env) {
  const origin = getSiteUrl(env);
  if (!origin || !/^\/(?!\/)[a-zA-Z0-9/_-]*$/.test(pathname)) return null;
  return `${origin}${pathname === "/" ? "" : pathname}`;
}
