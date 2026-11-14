import { ArrowUpRightIcon } from "./icons";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="container footer-inner">
      <div className="footer-identity"><span className="footer-mark">AS<span>.</span></span>
        <div><strong>Alisina Sarwari</strong><span>Building with clarity and intention.</span></div>
      </div>
      <div className="footer-links">
        <a href="/">Home</a><a href="#selected-work">Work</a><a href="#approach">Approach</a>
        <a href="https://github.com/Alisina137" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRightIcon width="14" height="14" /><span className="sr-only">(opens in a new tab)</span></a>
      </div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Alisina Sarwari. Made with care.</span><a href="#top">Back to top ↑</a></div>
  </footer>;
}
