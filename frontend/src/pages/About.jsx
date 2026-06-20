export default function About() {
  return (
    <section className="page-grid">
      <p className="eyebrow">Methodology</p>
      <h1>How Team SIRIus is approaching cloud removal</h1>
      <div className="panel prose">
        <h2>Problem</h2>
        <p>
          Clouds and cloud shadows reduce the usefulness of optical LISS-IV imagery for mapping,
          monitoring, disaster analysis, and environmental assessment.
        </p>
        <h2>MVP model strategy</h2>
        <p>
          Start with a lightweight GAN-style reconstruction pipeline, then replace the demo service
          with real preprocessing, patch inference, stitching, and spectral metrics.
        </p>
        <h2>Team</h2>
        <ul>
          <li>Rockie: backend, coordination, integration.</li>
          <li>Venkyy: research, model explanation, preprocessing support.</li>
          <li>Laksha: frontend pages and upload flow.</li>
          <li>Mru: results UI, animations, and visual polish.</li>
        </ul>
      </div>
    </section>
  );
}
