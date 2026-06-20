import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getStatus, startPrediction } from '../api/client.js';
import StepTracker from '../components/StepTracker.jsx';
import UploadZone from '../components/UploadZone.jsx';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);
  const [jobId, setJobId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!jobId) return undefined;

    const timer = window.setInterval(async () => {
      try {
        const nextStatus = await getStatus(jobId);
        setStatus(nextStatus);
        if (nextStatus.status === 'completed') {
          window.clearInterval(timer);
          navigate(`/results/${jobId}`);
        }
        if (nextStatus.status === 'failed') {
          window.clearInterval(timer);
          setError(nextStatus.error ?? 'Processing failed');
        }
      } catch (err) {
        window.clearInterval(timer);
        setError(err.message);
      }
    }, 900);

    return () => window.clearInterval(timer);
  }, [jobId, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      setError('Please select a satellite image first.');
      return;
    }

    setError('');
    try {
      const response = await startPrediction(file);
      setJobId(response.job_id);
      setStatus({ progress: 5, current_step: 'Upload received', status: response.status });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page-grid">
      <div>
        <p className="eyebrow">MVP upload flow</p>
        <h1>Upload a cloudy satellite image</h1>
        <p className="muted">For the first demo, PNG/JPG works best. GeoTIFF support is planned through Rasterio.</p>
      </div>
      <form className="panel" onSubmit={handleSubmit}>
        <UploadZone file={file} onFileChange={setFile} />
        {error && <p className="error-text">{error}</p>}
        <button className="primary-button" type="submit">Run cloud removal</button>
      </form>
      {status && <StepTracker currentStep={status.current_step} progress={status.progress} />}
    </section>
  );
}
