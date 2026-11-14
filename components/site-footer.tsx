import Link from "next/link";
import { ArrowUpRightIcon } from "./icons";

export function SiteFooter({ github, linkedIn, email, resume }: { github?: string | null; linkedIn?: string | null; email?: string | null; resume?: string | null }) {
  return <footer className="site-footer">
    <div className="container footer-inner">
      <div className="footer-identity"><span className="footer-mark">AS<span>.</span></span>
        <div><strong>Alisina Sarwari</strong><span>Building with clarity and intention.</span></div>
      </div>
      <nav className="footer-links" aria-label="Footer navigation">
        <Link href="/">Home</Link><Link href="/projects">Projects</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link>
        {resume && <a href={resume} target="_blank" rel="noopener noreferrer">Résumé (PDF) <ArrowUpRightIcon width="14" height="14"/><span className="sr-only">(opens in a new tab)</span></a>}
      </nav>
      <div className="footer-social" aria-label="Public profile links">
        {github && <a href={github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRightIcon width="14" height="14" /><span className="sr-only">(opens in a new tab)</span></a>}
        {linkedIn && <a href={linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRightIcon width="14" height="14" /><span className="sr-only">(opens in a new tab)</span></a>}
        {email && <a href={`mailto:${email}`}>Email</a>}
      </div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Alisina Sarwari. Made with care.</span><a href="#top">Back to top ↑</a></div>
  </footer>;
}
