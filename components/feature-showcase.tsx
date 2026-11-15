import Image from "next/image";
import type { StudyBlock } from "@/lib/content";

/**
 * Illustrations are decorative CONCEPTS, never represented as real application screenshots.
 * When the owner approves actual media, attach a screenshot object to a feature record.
 */
const visualModes: Record<string, string[]> = {
  maktablink: ["records", "calendar", "network", "dashboard"],
  futsal: ["calendar", "network", "dashboard", "records"],
  bazaarlink: ["commerce", "dashboard", "records", "network"],
  amlaklink: ["commerce", "records", "network", "dashboard"],
  dandanlink: ["calendar", "records", "network", "dashboard"],
  kankorprep: ["records", "dashboard", "calendar", "network"],
};
const fallbackModes = ["dashboard", "calendar", "network", "commerce"];

type Props = {
  projectSlug: string;
  features: StudyBlock[];
  conceptualLabel?: string;
  technicalLabel?: string;
  locale?: "en" | "fa" | "ps";
};

function Scene({ mode, index, label, title }: { mode: string; index: number; label: string; title: string }) {
  return <div className={`feature-scene feature-scene--${mode}`} role="img" aria-label={`${title}: ${label}`}>
    <span className="feature-scene-halo" aria-hidden="true" />
    <span className="feature-scene-orbit feature-scene-orbit--outer" aria-hidden="true" />
    <span className="feature-scene-orbit feature-scene-orbit--inner" aria-hidden="true" />
    <div className="feature-scene-glass" aria-hidden="true">
      <div className="feature-scene-windowbar"><div className="feature-scene-lights"><i/><i/><i/></div><span>PRODUCT SYSTEM / {String(index + 1).padStart(2, "0")}</span><span>↗</span></div>
      <div className="feature-scene-workspace">
        <div className="feature-scene-sidebar"><b/><b/><b/><b/></div>
        <div className="feature-scene-content">
          <span className="feature-scene-line feature-scene-line--title" />
          <span className="feature-scene-line feature-scene-line--subtitle" />
          <div className="feature-scene-canvas">
            {mode === "calendar" ? <div className="scene-calendar">{Array.from({length:21},(_,i)=><span className={i%7===2 || i===12 ? "selected" : ""} key={i}/>)}</div>
             : mode === "network" ? <div className="scene-network"><span/><span/><span/><span/><i/><i/><i/></div>
             : mode === "commerce" ? <div className="scene-commerce">{[0,1,2].map(i=><span key={i}><i/><b/><b/></span>)}</div>
             : mode === "records" ? <div className="scene-records">{[0,1,2,3].map(i=><span key={i}><i/><b/><em/></span>)}</div>
             : <div className="scene-chart"><span style={{height:"38%"}}/><span style={{height:"57%"}}/><span style={{height:"48%"}}/><span style={{height:"83%"}}/><span style={{height:"67%"}}/><span style={{height:"97%"}}/><span style={{height:"72%"}}/></div>}
          </div>
          <div className="feature-scene-bottom"><i/><i/><i/></div>
        </div>
      </div>
    </div>
    <div className="feature-scene-float" aria-hidden="true"><span className="feature-scene-float-glyph">✦</span><span><i/><i/></span></div>
    <span className="feature-scene-pill" aria-hidden="true"><i/> CONCEPT STUDY</span>
    <span className="feature-scene-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
  </div>;
}

export function FeatureShowcase({ projectSlug, features, conceptualLabel = "Concept visualization — not an app screenshot", technicalLabel = "Technical approach", locale = "en" }: Props) {
  return <div className="feature-showcase" aria-label={locale === "fa" ? "ویژگی‌های محصول" : locale === "ps" ? "د محصول ځانګړنې" : "Product features"}>
    {features.map((feature, index) => {
      const mode = (visualModes[projectSlug] || fallbackModes)[index % ((visualModes[projectSlug] || fallbackModes).length)];
      const approvedShot = locale === "en" ? feature.screenshot : undefined;
      return <article className={`feature-row ${index % 2 ? "feature-row--reverse" : ""}`} key={`${projectSlug}-${index}`}>
        <div className="feature-row-copy">
          <span className="feature-row-index" aria-label={`Feature ${index + 1}`}>{String(index + 1).padStart(2, "0")} <span aria-hidden="true">/</span> {features.length.toString().padStart(2,"0")}</span>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          <a className="feature-row-link" href="#technical">{technicalLabel}<span aria-hidden="true"> ↘</span></a>
        </div>
        <figure className="feature-row-figure">
          {approvedShot ? <Image className="feature-real-image" src={approvedShot.src} alt={approvedShot.alt} width={980} height={680} sizes="(max-width: 800px) 92vw, 44vw" /> : <Scene mode={mode} index={index} label={conceptualLabel} title={feature.title} />}
          <figcaption>{approvedShot ? approvedShot.caption : conceptualLabel}</figcaption>
        </figure>
        {index !== features.length-1 && <span className="feature-flow-connector" aria-hidden="true"><span>↘</span></span>}
      </article>;
    })}
  </div>;
}
