import { resolveFileUrl } from '../api/client.js';

export default function ComparisonSlider({ original, output }) {
  return (
    <section className="comparison-grid">
      <ImagePanel label="Cloudy input" src={original} />
      <ImagePanel label="Reconstructed output" src={output} />
    </section>
  );
}

function ImagePanel({ label, src }) {
  return (
    <article className="image-panel">
      <h3>{label}</h3>
      {src ? <img alt={label} src={resolveFileUrl(src)} /> : <div className="image-placeholder">No preview</div>}
    </article>
  );
}
