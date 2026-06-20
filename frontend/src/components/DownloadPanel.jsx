import { resolveFileUrl } from '../api/client.js';

export default function DownloadPanel({ downloads }) {
  return (
    <section className="panel download-panel">
      <h3>Downloads</h3>
      <div className="button-row">
        {Object.entries(downloads ?? {}).map(([name, path]) => (
          <a className="secondary-button" href={resolveFileUrl(path)} key={name}>
            Download {name.toUpperCase()}
          </a>
        ))}
      </div>
    </section>
  );
}
