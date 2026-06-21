import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero">
      <p className="eyebrow">ISRO Team SIRIus · BAH 2026</p>
      <h1>Generative AI cloud removal for LISS-IV satellite imagery.</h1>
      <p className="hero-copy">
        Upload cloudy satellite images, run an MVP reconstruction pipeline, and compare the
        original with the generated cloud-free output.
      </p>
      <div className="button-row">
        <Link className="primary-button" to="/upload">Start reconstruction</Link>
        <Link className="secondary-button" to="/about">View methodology</Link>
      </div>
      <div className="feature-grid">
        <Feature title="LISS-IV focused" text="Designed around ISRO Resourcesat LISS-IV bands and use cases." />
        <Feature title="MVP pipeline" text="FastAPI backend, React frontend, and replaceable model service." />
        <Feature title="Judge-ready demo" text="Before/after viewer, metrics, and result downloads." />
      </div>
    </section>
  );
}

function Feature({ title, text }) {
  return (
    <article className="feature-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
