const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export async function startPrediction(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  return parseResponse(response);
}

export async function getStatus(jobId) {
  const response = await fetch(`${API_BASE_URL}/status/${jobId}`);
  return parseResponse(response);
}

export async function getResult(jobId) {
  const response = await fetch(`${API_BASE_URL}/result/${jobId}`);
  return parseResponse(response);
}

export function resolveFileUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail ?? 'Request failed');
  }
  return payload;
}
