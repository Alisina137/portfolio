type Props = { number: string; kicker: string; title: string; copy?: string };

export function SectionHeading({ number, kicker, title, copy }: Props) {
  return <div className="section-heading">
    <span className="section-eyebrow"><span>{number}</span><span className="section-eyebrow-line" />{kicker}</span>
    <div className="section-title-row"><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
  </div>;
}
