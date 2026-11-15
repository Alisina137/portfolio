"use client";
import { usePathname } from "next/navigation";
import { getUi, localeFromPath, localizePath } from "@/lib/i18n-client";
import Link from "next/link";
import { ArrowUpRightIcon } from "./icons";

export function SiteFooter({ github, linkedIn, email, resume, showWriting = false }: { github?: string | null; linkedIn?: string | null; email?: string | null; resume?: string | null; showWriting?: boolean }) {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const ui = locale === 'en' ? null : getUi(locale);
  const path = (target: string) => localizePath(locale, target);
  return <footer className="site-footer">
    <div className="container footer-inner">
      <div className="footer-identity"><span className="footer-mark">AS<span>.</span></span>
        <div><strong>Alisina Sarwari</strong><span>{ui?.footerTag ?? "Building with clarity and intention."}</span></div>
      </div>
      <nav className="footer-links" aria-label={ui?.footerNav ?? "Footer navigation"}>
        <Link href={path("/")}>{ui?.home ?? "Home"}</Link><Link href={path("/projects")}>{ui?.projects ?? "Projects"}</Link>{showWriting && locale === "en" && <Link href={path("/writing")}>{ui?.writing ?? "Writing"}</Link>}<Link href={path("/about")}>{ui?.about ?? "About"}</Link><Link href={path("/contact")}>{ui?.contact ?? "Contact"}</Link>
        {resume && <a href={resume} target="_blank" rel="noopener noreferrer">{ui?.resume ?? "Résumé (PDF)"} <ArrowUpRightIcon width="14" height="14"/><span className="sr-only">({ui?.newTab ?? "opens in a new tab"})</span></a>}
      </nav>
      <div className="footer-social" aria-label="Public profile links">
        {github && <a href={github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRightIcon width="14" height="14" /><span className="sr-only">({ui?.newTab ?? "opens in a new tab"})</span></a>}
        {linkedIn && <a href={linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRightIcon width="14" height="14" /><span className="sr-only">({ui?.newTab ?? "opens in a new tab"})</span></a>}
        {email && <a href={`mailto:${email}`}>{ui?.email ?? "Email"}</a>}
      </div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Alisina Sarwari. {ui?.footerCare ?? "Made with care."}</span><a href="#top">{ui?.backTop ?? "Back to top ↑"}</a></div>
  </footer>;
}
