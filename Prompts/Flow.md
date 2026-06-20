# Project Flow — ISRO Team SIRIus

## Project Goal

Build an end-to-end AI system that removes clouds from **LISS-IV satellite imagery** and reconstructs usable cloud-free images while preserving spatial detail and spectral consistency.

The system is not only a model. It includes:

- data collection from ISRO Bhoonidhi,
- preprocessing of satellite GeoTIFF images,
- AI-based cloud removal,
- evaluation using image and spectral metrics,
- a backend inference service,
- and a frontend dashboard for upload, viewing, comparison, and download.

## Why This Project Matters

LISS-IV imagery is valuable because it provides high-resolution satellite data, around **5.8 m spatial resolution**, using green, red, and NIR bands. However, clouds and shadows reduce its usefulness, especially in cloud-prone regions like the North Eastern Region of India.

This project aims to convert partially unusable cloudy images into more useful reconstructed images for mapping, disaster monitoring, land-use analysis, environmental assessment, and infrastructure planning.

## High-Level System Architecture

```text
User
 │
 ▼
Frontend Web App
 │  Upload GeoTIFF / PNG / JPG
 ▼
FastAPI Backend
 │  Validate file, create job, manage status
 ▼
Preprocessing Pipeline
 │  Band stacking, normalization, patch generation
 ▼
AI Model Pipeline
 │  Hybrid GAN MVP or Diffusion advanced model
 ▼
Postprocessing Pipeline
 │  Stitch patches, restore output, calculate metrics
 ▼
Result Storage
 │  Original image, reconstructed image, previews, metrics
 ▼
Frontend Result Viewer
    Before/after comparison, metrics, download
```

## Data Pipeline

### Source Data

- Main source: **LISS-IV GeoTIFF imagery** from ISRO Bhoonidhi.
- Target bands: B2 Green, B3 Red, B4 NIR.
- Auxiliary options:
  - Sentinel-1 SAR for cloud-penetrating structure guidance.
  - Sentinel-2 optical for multispectral and temporal context.
  - Historical LISS-IV clear scenes for cloud-free references.

### Data Preparation Steps

1. Download cloudy and clear/historical scenes from Bhoonidhi.
2. Organize raw images into `data/raw/cloudy` and `data/raw/clear`.
3. Stack LISS-IV bands correctly.
4. Convert DN values to reflectance if metadata is available.
5. Co-register cloudy and reference images so ground locations match.
6. Generate or use cloud masks where possible.
7. Split large images into **256×256 patches**.
8. Normalize data for model input.
9. Apply augmentation such as flips and rotations.
10. Split data into training, validation, and test sets.

## Model Pipeline

### MVP Model

The recommended first version is a **Hybrid GAN**:

- Generator: U-Net with Cloud Attention Module.
- Discriminator: Multi-scale PatchGAN.
- Losses: Charbonnier, SSIM, gradient, adversarial, and spectral/SAM loss.

This version is faster to train, GPU-friendly, and suitable for a working demo.

### Advanced Model

The production/research version can use diffusion models:

- EMRDM-style mean-reverting diffusion.
- DB-CR-style diffusion bridge with SAR-optical fusion.

This can improve reconstruction quality but requires more compute and better paired data.

## Application Flow

1. User opens the web app.
2. User uploads a cloudy satellite image.
3. Frontend sends the file to the FastAPI backend.
4. Backend validates the file and creates a processing job.
5. Backend preprocesses the image into model-ready patches.
6. AI model reconstructs cloud-covered regions.
7. Backend stitches output patches into a final image.
8. Backend calculates metrics such as PSNR, SSIM, SAM, LPIPS, and inference time.
9. Frontend displays original and reconstructed images.
10. User downloads the result as PNG or GeoTIFF.

## Page Structure

### 1. Home Page

- Introduces the project.
- Explains the cloud-cover problem.
- Shows a short solution overview.
- Includes call-to-action buttons for upload and methodology.

### 2. Upload Page

- Drag-and-drop satellite image upload.
- Accepts GeoTIFF, PNG, JPG.
- Optional metadata fields such as location, date, and satellite source.
- Starts AI reconstruction.

### 3. Processing Page

- Shows live job status.
- Displays steps: upload, preprocessing, inference, postprocessing, metrics.
- Uses progress indicators and animations.

### 4. Results Page

- Shows before/after image comparison.
- Provides swipe, zoom, and pan features.
- Displays metrics like PSNR, SSIM, SAM, LPIPS.
- Allows downloading reconstructed outputs.

### 5. Methodology Page

- Explains LISS-IV data.
- Explains the data pipeline.
- Explains GAN and diffusion model strategy.
- Shows evaluation metrics and architecture diagrams.

### 6. Team Page

- Displays Team SIRIus details.
- Shows roles, project context, and acknowledgments.

## Suggested Extra Features

- Cloud mask preview before reconstruction.
- Confidence heatmap for uncertain regions.
- Batch upload for multiple satellite images.
- Timeline comparison using historical images.
- Exportable PDF report with metrics.
- Interactive map if geolocation metadata exists.
- Processing history page.
- Dark-mode satellite-themed interface.
- Admin dashboard for model logs and failed jobs.

## MVP vs Advanced Version

| Area | MVP | Advanced |
|---|---|---|
| Model | Hybrid GAN | Diffusion / SAR-optical fusion |
| Data | LISS-IV + synthetic clouds | LISS-IV + Sentinel-1/2 + temporal references |
| Backend | FastAPI synchronous or simple async | FastAPI + Celery + Redis |
| Frontend | Upload, process, compare, download | Map viewer, history, heatmaps, reports |
| Deployment | Local or demo server | Dockerized GPU-enabled deployment |

## Recommended Development Order

1. Build basic repo and folder structure.
2. Implement preprocessing scripts.
3. Build simple model inference pipeline.
4. Create FastAPI upload and result endpoints.
5. Build frontend upload and result pages.
6. Add metrics and comparison viewer.
7. Improve model quality.
8. Dockerize and prepare final demo.
