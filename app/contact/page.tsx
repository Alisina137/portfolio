import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { EmailContact } from "@/components/email-contact";
import { getPublicIdentity } from "@/lib/public-identity";
import { contactConfig } from "@/lib/phase08-core.mjs";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = createPageMetadata({
  title: "Contact — Alisina Sarwari | Software Engineer",
  description: "Approved professional links and project contact information for software engineer and product builder Alisina Sarwari.",
  pathname: "/contact",
});

export const dynamic = "force-dynamic";
export default function ContactPage() {
  const identity = getPublicIdentity();
  const contact = contactConfig();
  return <main id="main" tabIndex={-1}>
    <section className="contact-hero section-pad" aria-labelledby="contact-title"><div className="container contact-hero-grid">
      <div><div className="page-eyebrow"><span>03 /</span> LET'S CONNECT</div><h1 id="contact-title">Have a project or<br/><em>opportunity in mind?</em></h1><p className="contact-intro">Engineering roles, practical product ideas, technical collaboration—or a thoughtful question about the work. I'd be glad to hear what you're building.</p>
        <div className="contact-context"><span className="contact-context-dot" aria-hidden="true" /><span>Based in {identity.location} · Working across web and mobile</span></div>
      </div>
      <div className="contact-orbit" aria-hidden="true"><span className="contact-orbit-large">✳</span><span className="contact-orbit-line" /><span className="contact-orbit-tag">IDEAS → CONVERSATIONS</span></div>
    </div></section>

    <section className="contact-methods section-pad" aria-labelledby="contact-methods-title"><div className="container">
      <div className="contact-method-header"><span className="page-eyebrow"><span>01 /</span> THE NEXT STEP</span><h2 id="contact-methods-title">Let's find a way<br/><em>to connect.</em></h2></div>
      <div className="contact-method-grid">
        {contact.enabled ? <ContactForm siteKey={contact.siteKey}/> : identity.email ? <EmailContact email={identity.email}/> : <section className="contact-pending-card" aria-labelledby="contact-pending-title">
          <div className="contact-card-icon" aria-hidden="true">↗</div>
          <span className="contact-card-eyebrow">PUBLIC PROFILE</span>
          <h3 id="contact-pending-title">Start with my work.</h3>
          <p>A direct email address hasn't been approved for publication yet. You can visit my public GitHub profile to explore the projects and any contact details I've chosen to share there.</p>
          {identity.github && <a href={identity.github} className="button button-primary" target="_blank" rel="noopener noreferrer">Visit GitHub profile <ArrowUpRightIcon /><span className="sr-only">(opens in a new tab)</span></a>}
          <p className="contact-pending-note">A direct email contact option will appear here only after its owner approves the address. This page does not accept messages.</p>
        </section>}
        <div className="contact-network" aria-label="Other public destinations"><span className="contact-card-eyebrow">AROUND THE WEB</span>
          <h3>More places to explore.</h3><p>The project work and engineering decisions are available for review without an account.</p>
          {identity.github && <a href={identity.github} target="_blank" rel="noopener noreferrer"><span className="network-symbol" aria-hidden="true">GH</span><span><strong>GitHub</strong><small>Public repositories &amp; source code</small></span><ArrowUpRightIcon width="18" height="18" /><span className="sr-only">(opens in a new tab)</span></a>}
          {identity.linkedIn && <a href={identity.linkedIn} target="_blank" rel="noopener noreferrer"><span className="network-symbol" aria-hidden="true">in</span><span><strong>LinkedIn</strong><small>Professional profile</small></span><ArrowUpRightIcon width="18" height="18" /><span className="sr-only">(opens in a new tab)</span></a>}
          <Link href="/projects"><span className="network-symbol" aria-hidden="true">↗</span><span><strong>Project case studies</strong><small>Explore the work in detail</small></span><ArrowRightIcon width="18" height="18" /></Link>
          {identity.resume && <a href={identity.resume} target="_blank" rel="noopener noreferrer"><span className="network-symbol" aria-hidden="true">PDF</span><span><strong>View résumé (PDF)</strong><small>Approved professional background</small></span><ArrowUpRightIcon width="18" height="18"/><span className="sr-only">(opens in a new tab)</span></a>}
        </div>
      </div>
      <p className="contact-privacy">{contact.enabled ? "Contact form submissions pass through spam verification, rate limiting and an email provider. No message history is saved on this site; do not send sensitive records." : "No personal contact information is collected by this website unless you choose to contact me through an external service or email."}</p>
    </div></section>
    <section className="contact-bottom section-pad"><div className="container contact-bottom-inner"><span className="page-eyebrow"><span>02 /</span> EXPLORE FIRST</span><h2>A closer look at<br/><em>the work.</em></h2><p>See the products, challenges and technical decisions behind the ideas.</p><Link href="/projects" className="button button-outline">Browse projects <ArrowRightIcon /></Link></div></section>
  </main>;
}
