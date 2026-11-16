import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SkillsSection } from "@/components/skills-section";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { getFeaturedProjects, siteProfile } from "@/lib/content";

const capabilities = [
  { number: "01", name: "Web applications", info: "Interfaces made for real workflows" },
  { number: "02", name: "Mobile experiences", info: "Useful tools that travel with people" },
  { number: "03", name: "End-to-end systems", info: "From product logic to reliable APIs" },
];
const method = [
  { number: "01", title: "Understand", desc: "Start with the people, their context and the problem worth solving." },
  { number: "02", title: "Structure", desc: "Shape the flows, data and decisions before adding complexity." },
  { number: "03", title: "Build", desc: "Connect thoughtful interfaces to practical, dependable systems." },
  { number: "04", title: "Improve", desc: "Test the real experience, find friction and make the next version better." },
];

export default function HomePage() {
  const featured = getFeaturedProjects();
  return <main id="main" tabIndex={-1}>
    <section className="hero section-pad" aria-labelledby="hero-title">
      <div className="hero-halo" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-content">
          <div className="hero-eyebrow"><span className="eyebrow-dash" /> SOFTWARE ENGINEER <span className="eyebrow-separator">/</span> PRODUCT BUILDER</div>
          <h1 id="hero-title">Alisina <span>Sarwari<span className="name-stop">.</span></span></h1>
          <p className="hero-headline">{siteProfile.headline}</p>
          <p className="hero-description">{siteProfile.intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/projects">Explore projects <ArrowRightIcon /></Link>
            <Link className="button button-outline" href="/contact">Get in touch <ArrowRightIcon /></Link>
          </div>
          <div className="hero-aside"><span className="hero-aside-line" /><span>BASED IN AFGHANISTAN <span aria-hidden="true">•</span> BUILDING FOR PEOPLE</span></div>
        </div>
        <div className="hero-art" aria-label="Typographic illustration describing software work, not a product screenshot" role="img">
          <div className="hero-art-badge"><span className="tiny-cross">✳</span><span>DESIGN <i>/</i> ENGINEER <i>/</i> BUILD</span></div>
          <div className="hero-art-main"><span className="hero-art-crystal" aria-hidden="true"/><div className="hero-art-index">ALISINA STUDIO <span>ISSUE / 001</span></div>
            <div className="hero-art-letter">A<span>S</span><span className="hero-art-spark">✳</span></div>
            <div className="hero-art-rail"><span>THINK IN SYSTEMS</span><span>BUILD WITH PURPOSE</span></div>
          </div>
          <div className="hero-art-floating floating-one"><span>01 / EXPLORE</span><strong>Ideas → Interfaces</strong><span className="floating-arrow">↗</span></div>
          <div className="hero-art-floating floating-two"><span>02 / CONNECT</span><strong>Design → Engineering</strong><span className="floating-dot" /></div>
          <div className="hero-art-bottom"><span>WEB / MOBILE / BACKEND</span><span>EST. IN CURIOSITY</span></div>
        </div>
      </div>
      <div className="container hero-supplement"><span className="scroll-cue"><span aria-hidden="true">↓</span> SCROLL TO EXPLORE</span><span>PORTFOLIO / 2026</span></div>
    </section>

    <section className="capabilities" aria-label="Areas of work"><div className="container capabilities-grid">
      {capabilities.map((c) => <div className="capability" key={c.number}><span className="capability-number">{c.number} /</span><div><strong>{c.name}</strong><span>{c.info}</span></div></div>)}
    </div></section>

    <section className="work-section section-pad" id="selected-work" aria-label="Selected work">
      <div className="container">
        <SectionHeading number="01" kicker="SELECTED WORK" title="Built with intention." copy="A collection of products exploring education, local commerce, community and the systems that connect them." />
        <div className="projects-grid">{featured.map((project, idx) => <ProjectCard project={project} index={idx} key={project.id} />)}</div>
        <div className="work-note"><span className="work-note-asterisk">✳</span><p>These are evolving development projects; source code and case studies are evidence, not a claim of public launch.</p></div>
        <div className="home-work-actions"><Link href="/projects" className="button button-outline">Explore all projects <ArrowRightIcon /></Link></div>
      </div>
    </section>

    <SkillsSection variant="home" />

    <ExperienceTimeline variant="home" />

    <section className="approach-section section-pad" id="approach">
      <div className="container"><SectionHeading number="04" kicker="MY APPROACH" title="From problem to product." copy="The most useful technology starts with a clear understanding of the problem." />
        <div className="method-grid">{method.map((step) => <div className="method-card" key={step.number}><div className="method-top"><span>{step.number}</span><span aria-hidden="true">↗</span></div><h3>{step.title}<span>.</span></h3><p>{step.desc}</p></div>)}</div>
      </div>
    </section>

    <section className="about-band section-pad" aria-labelledby="about-preview-title">
      <div className="container about-band-inner"><div className="about-band-aside"><span className="section-eyebrow"><span>05</span><span className="section-eyebrow-line" /> BEHIND THE BUILDS</span><div className="about-symbol" aria-hidden="true">A<span>S</span><i>✳</i></div></div>
        <div className="about-band-copy"><h2 id="about-preview-title">Curious by nature.<br/><span>Builder by practice.</span></h2><p>{siteProfile.shortBio}</p><Link href="/about" className="inline-direction">More about me <ArrowRightIcon width="18" height="18" /></Link><div className="about-band-signoff"><span className="signature-bar" /><span>ALISINA SARWARI <i>/</i> SOFTWARE ENGINEER</span></div></div>
      </div>
    </section>

    <section className="closing-section section-pad" aria-labelledby="closing-title">
      <div className="container closing-inner"><span className="section-eyebrow"><span>06</span><span className="section-eyebrow-line" /> KEEP EXPLORING</span>
        <h2 id="closing-title">Good ideas deserve<br/><em>thoughtful execution.</em></h2>
        <p>Explore the thinking and implementation behind each software project, from early ideas to evolving systems.</p>
        <Link className="button button-primary" href="/contact">Get in touch <ArrowRightIcon /></Link>
        <span className="closing-decoration" aria-hidden="true">✳</span>
      </div>
    </section>
  </main>;
}
