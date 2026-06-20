# Backend Development Plan — ISRO Team SIRIus

## Purpose

The backend powers the cloud-removal application. It receives uploaded satellite images, validates them, preprocesses them, runs AI inference, generates reconstructed outputs, calculates metrics, and serves results back to the frontend.

## Recommended Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| API Server | FastAPI | REST endpoints |
| Server Runner | Uvicorn | ASGI server |
| AI Framework | PyTorch 2.x | Model inference/training |
| Geospatial I/O | Rasterio + GDAL | GeoTIFF handling, CRS metadata |
| Image Processing | OpenCV, scikit-image, NumPy | Preprocessing and transforms |
| Metrics | torchmetrics, kornia | PSNR, SSIM, SAM |
| Async Jobs | Celery | Background inference tasks |
| Queue/Broker | Redis | Job queue and status storage |
| Config | YAML / Pydantic Settings | Model and system configuration |
| Deployment | Docker + docker-compose | Containerized app |

## Backend Responsibilities

- Accept GeoTIFF, PNG, and JPG uploads.
- Validate file type, size, and readability.
- Store uploaded files safely.
- Create a unique job ID for each request.
- Preprocess satellite images for the model.
- Run the GAN or diffusion model on image patches.
- Stitch output patches into a final image.
- Preserve geospatial metadata where possible.
- Calculate output metrics.
- Return status, preview images, metrics, and downloads.

## Main API Endpoints

### `GET /health`

Checks whether backend, Redis, and model are available.

Response:

```json
{
  "status": "ok",
  "model_loaded": true
}
```

### `POST /predict`

Uploads image and starts cloud-removal job.

Input:

- file: GeoTIFF, PNG, JPG,
- optional location,
- optional date,
- optional source/satellite.

Response:

```json
{
  "job_id": "abc123",
  "status": "queued",
  "message": "Cloud removal job started"
}
```

### `GET /status/{job_id}`

Returns processing progress.

Response:

```json
{
  "job_id": "abc123",
  "status": "processing",
  "progress": 65,
  "current_step": "Running AI model"
}
```

### `GET /result/{job_id}`

Returns final result data.

Response:

```json
{
  "job_id": "abc123",
  "status": "completed",
  "original_preview_url": "/files/abc123/original.png",
  "output_preview_url": "/files/abc123/output.png",
  "metrics": {
    "psnr": 32.4,
    "ssim": 0.94,
    "sam": 3.2,
    "inference_time": 18.7
  },
  "downloads": {
    "png": "/download/abc123/png",
    "geotiff": "/download/abc123/geotiff"
  }
}
```

### `GET /download/{job_id}/{format}`

Downloads the reconstructed image as PNG or GeoTIFF.

## Processing Pipeline

```text
1. Receive uploaded image
2. Validate file type and file size
3. Save file in storage/uploads
4. Create job ID
5. Start Celery background task
6. Read image using Rasterio/GDAL or OpenCV
7. Stack required bands if LISS-IV GeoTIFF
8. Normalize image values
9. Split image into 256×256 patches
10. Run model inference on each patch
11. Stitch reconstructed patches
12. Save output preview and GeoTIFF
13. Calculate metrics
14. Mark job as completed
15. Serve result to frontend
```

## Preprocessing Details

For LISS-IV imagery:

- Use B2 Green, B3 Red, and B4 NIR bands.
- Convert DN to TOA reflectance if metadata is available.
- Co-register cloudy and reference scenes during training.
- Generate 256×256 patches.
- Normalize values to model input range.
- Apply augmentations during training, not inference.

For user-uploaded inference:

- Validate image readability.
- Resize or patch based on model requirements.
- Keep original dimensions for final reconstruction.
- Preserve CRS and transform metadata for GeoTIFF output when possible.

## AI Model Strategy

### MVP Inference

Use Hybrid GAN:

- U-Net generator with Cloud Attention Module.
- PatchGAN discriminator used during training only.
- Inference uses the trained generator checkpoint.

### Advanced Inference

Use diffusion model:

- EMRDM or DB-CR style model.
- Optionally include Sentinel-1 SAR or Sentinel-2 reference inputs.
- Better quality but slower and more compute-heavy.

## Suggested Backend File Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── routes_health.py
│   │   ├── routes_predict.py
│   │   ├── routes_status.py
│   │   ├── routes_result.py
│   │   └── routes_download.py
│   ├── core/
│   │   ├── config.py
│   │   └── logging.py
│   ├── schemas/
│   │   ├── job.py
│   │   └── metrics.py
│   ├── services/
│   │   ├── validation.py
│   │   ├── storage.py
│   │   ├── preprocessing.py
│   │   ├── inference.py
│   │   ├── postprocessing.py
│   │   └── metrics.py
│   ├── workers/
│   │   ├── celery_app.py
│   │   └── tasks.py
│   └── utils/
├── checkpoints/
│   └── best_model.pth
├── storage/
│   ├── uploads/
│   ├── outputs/
│   ├── previews/
│   └── temp/
├── configs/
│   └── default.yaml
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## Storage Plan

```text
storage/
├── uploads/{job_id}/original_file
├── temp/{job_id}/patches
├── outputs/{job_id}/reconstructed.tif
├── previews/{job_id}/original.png
└── previews/{job_id}/reconstructed.png
```

## Metrics

Calculate these when ground truth/reference is available:

- PSNR: reconstruction quality.
- SSIM: structural similarity.
- SAM: spectral consistency.
- LPIPS: perceptual similarity.
- UIQI: overall image quality.

If no ground truth is available, return available metrics such as inference time, cloud-mask percentage, and confidence score if the model supports it.

## Security and Reliability

- Allow only known image extensions.
- Validate MIME type and actual file readability.
- Set upload size limits.
- Use safe randomized filenames.
- Never execute uploaded files.
- Log every job and error.
- Clean temporary patches after completion.
- Return clear error messages to frontend.
- Use rate limiting if hosted publicly.

## Deployment Plan

For demo:

- Run FastAPI locally with Uvicorn.
- Run Redis locally or through Docker.
- Run Celery worker for inference.

For production/demo server:

- Use Docker Compose with services:
  - frontend,
  - backend,
  - Redis,
  - worker.
- Use GPU-enabled server if using heavy diffusion models.

## Backend Completion Criteria

- `/predict` accepts image upload and returns job ID.
- `/status/{job_id}` reports progress.
- Model inference produces reconstructed output.
- `/result/{job_id}` returns previews, metrics, and links.
- `/download/{job_id}/{format}` downloads the result.
- Backend handles invalid files and failed jobs safely.
