import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getResult } from '../api/client.js';
import ComparisonSlider from '../components/ComparisonSlider.jsx';
import DownloadPanel from '../components/DownloadPanel.jsx';
import MetricCard from '../components/MetricCard.jsx';

export default function Results() {
  const { jobId } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getResult(jobId).then(setResult).catch((err) => setError(err.message));
  }, [jobId]);

  if (error) return <p className="error-text">{error}</p>;
  if (!result) return <p className="muted">Loading result...</p>;

  const metrics = result.metrics ?? {};
  return (
    <section className="page-grid">
      <div>
        <p className="eyebrow">Job {jobId}</p>
        <h1>Reconstruction result</h1>
      </div>
      <ComparisonSlider original={result.previews?.original} output={result.previews?.output} />
      <section className="metric-grid">
        <MetricCard label="PSNR" value={metrics.psnr} />
        <MetricCard label="SSIM" value={metrics.ssim} />
        <MetricCard label="SAM" value={metrics.sam} />
        <MetricCard label="Time" value={`${metrics.inference_time_sec}s`} />
      </section>
      <DownloadPanel downloads={result.downloads} />
    </section>
  );
}
