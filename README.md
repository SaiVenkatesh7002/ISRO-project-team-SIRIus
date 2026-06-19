# 🛰️ ISRO SIRIus: Generative AI-Based Cloud Removal & Reconstruction for LISS-IV Satellite Imagery

**Team SIRIus** — ISRO Project | Bharatiya Antariksh Hackathon (BAH) 2026

> Persistent cloud cover is a major challenge in optical remote sensing, particularly over tropical and mountainous regions such as the North Eastern Region (NER) of India. Clouds and cloud shadows significantly reduce the usability of optical satellite imagery for applications such as land use–land cover mapping, disaster monitoring, environmental assessment, and infrastructure analysis. LISS-IV imagery provides high spatial resolution data that is valuable for detailed geospatial analysis. However, frequent cloud contamination limits the temporal availability of usable observations.

---

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [Satellite & Data Specifications](#satellite--data-specifications)
- [State-of-the-Art: Model Architectures](#state-of-the-art-model-architectures)
- [Full Project Architecture](#full-project-architecture)
- [Project Flow & Work Packages](#project-flow--work-packages)
- [Tech Stack](#tech-stack)
- [Reference Solutions](#reference-solutions)
- [Risks & Mitigations](#risks--mitigations)
- [Getting Started](#getting-started)
- [Team Workflow](#team-workflow)

---

## 🎯 Problem Statement

Develop a **Generative AI-based framework** for automated cloud removal and surface reconstruction in LISS-IV imagery. The framework should leverage spatial, spectral, and temporal information to generate cloud-free imagery while preserving fine-scale spatial details and spectral consistency.

**Proposed solutions may explore:**
- Diffusion models
- GANs (Generative Adversarial Networks)
- Transformer-based architectures
- Multi-modal fusion (Sentinel-1 SAR, Sentinel-2 optical, temporal references)

---

## 📡 Satellite & Data Specifications

### LISS-IV Sensor (Resourcesat-2 / 2A)

| Parameter | Value |
|-----------|-------|
| **Spatial Resolution** | 5.8m (at Nadir) |
| **Spectral Bands** | B2: Green (0.52–0.59µm), B3: Red (0.62–0.68µm), B4: NIR (0.76–0.86µm) |
| **Swath** | 70km (Mono) / 23.5km (Multispectral MX) |
| **Radiometric Resolution** | 10-bit |
| **Revisit** | 5 days (steerable) / 24 days (systematic) |
| **Data Access** | ISRO **Bhoonidhi** portal (free registration) — GeoTIFF format |
| **Coverage** | India (2011–present) |

### Auxiliary Data Sources

| Source | Type | Key Use |
|--------|------|---------|
| **Sentinel-1 (C-band SAR)** | Radar (penetrates clouds) | Structural guidance for reconstruction |
| **Sentinel-2 MSI** | Optical (10m res) | Multi-spectral reference, temporal context |
| **Historical LISS-IV** | Optical (same sensor) | Temporal reference — cloud-free past scenes |

---

## 🧠 State-of-the-Art: Model Architectures

### Tier 1 (Recommended — High Fidelity)

#### 🥇 A. Hybrid Diffusion Model — EMRDM (CVPR 2025)

| Aspect | Detail |
|--------|--------|
| **Strength** | Highest fidelity, best structural similarity (SSIM) |
| **Weakness** | Slower inference, higher compute |
| **Paper** | "Effective Cloud Removal for Remote Sensing Images by an Improved Mean-Reverting Denoising Model" |
| **Repo** | [github.com/Ly403/EMRDM](https://github.com/Ly403/EMRDM) |

- Uses **mean-reverting diffusion** (not standard Gaussian)
- Excels at both **mono-temporal** and **multi-temporal** tasks
- Modular design with elucidated design space

#### 🥇 B. Diffusion Bridge — DB-CR (2025)

| Aspect | Detail |
|--------|--------|
| **Strength** | SAR-optical fusion native, fast sampling |
| **Weakness** | Requires paired SAR + optical data |
| **Paper** | "Multimodal Diffusion Bridge with Attention-Based SAR Fusion" |

- Bridges directly from cloudy → cloud-free (skips pure noise)
- Two-branch backbone with cross-modality fusion blocks
- State-of-the-art on SEN12MS-CR benchmark

### Tier 2 (Proven — Faster Deployment)

#### 🥈 C. Hybrid GAN (Pix2Pix + Attention)

| Aspect | Detail |
|--------|--------|
| **Strength** | Fast inference, well-studied, GPU-friendly |
| **Weakness** | Mode collapse risk, lower structural fidelity |

**Architecture:**
- **Generator:** U-Net with Cloud Attention Module
- **Discriminator:** Multi-scale PatchGAN (70×70 patches)
- **Loss:** Charbonnier + SSIM + Gradient + Adversarial + Spectral

#### 🥉 D. SpA-GAN / AttentionGAN

- Spatial Attention GAN for high-res imagery
- Good for preserving fine spatial details
- Proven on LISS-IV like resolutions

### 🎯 Our Recommendation: Two-Phase Approach

```
Phase 1 (MVP):  Hybrid GAN (U-Net + PatchGAN + Attention)
Phase 2 (Prod): Diffusion Model (EMRDM or DB-CR)
```

---

## 🏗️ Full Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PROJECT ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┐
│         DATA PIPELINE           │
├─────────────────────────────────┤
│                                 │
│  Bhoonidhi Portal ──┐           │
│  (LISS-IV GeoTIFF)   │          │
│                     ▼           │
│  ┌─────────────────────────┐   │
│  │ Data Ingestion & QA      │   │
│  │ - Band stacking (B2,B3,B4)│   │
│  │ - DN → TOA Reflectance   │   │
│  │ - Co-registration        │   │
│  │ - Cloud masking (QA band)│   │
│  └────────────┬────────────┘   │
│               ▼                 │
│  ┌─────────────────────────┐   │
│  │ Preprocessing            │   │
│  │ - Patchify (256×256)    │   │
│  │ - Normalize             │   │
│  │ - Augment (flip, rotate)│   │
│  │ - Train/Val/Test split  │   │
│  └────────────┬────────────┘   │
│               ▼                 │
│  ┌─────────────────────────┐   │
│  │ Dataset Store            │   │
│  │ - PyTorch Dataset class  │   │
│  │ - DataLoader with prefetch│  │
│  └─────────────────────────┘   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│       MODEL PIPELINE            │
├─────────────────────────────────┤
│                                 │
│  Cloudy 256×256 Patch           │
│         ▼                       │
│  ┌─────────────────────────┐   │
│  │ Cloud Detection Module   │   │
│  │ (Learned Attention Mask) │   │
│  └────────────┬────────────┘   │
│               ▼                 │
│  ┌─────────────────────────┐   │
│  │ Fusion Module            │   │
│  │ (Optional SAR/Optical)   │   │
│  └────────────┬────────────┘   │
│               ▼                 │
│  ┌─────────────────────────┐   │
│  │ Generator (U-Net /       │   │
│  │  Diffusion Backbone)     │   │
│  └────────────┬────────────┘   │
│               ▼                 │
│  ┌─────────────────────────┐   │
│  │ Cloud-Free 256×256 Patch │   │
│  └─────────────────────────┘   │
│                                 │
│  Training:                      │
│  ┌─────────────────────────┐   │
│  │ Discriminator (PatchGAN) │   │
│  │ Adversarial Loss         │   │
│  │ Perceptual Loss (VGG)    │   │
│  │ Spectral Loss (SAM)      │   │
│  │ SSIM + L1 Loss           │   │
│  └─────────────────────────┘   │
│                                 │
│  Evaluation Metrics:            │
│  PSNR, SSIM, SAM, LPIPS, UIQI  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│      APPLICATION LAYER          │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │       Frontend           │   │
│  │  (React + Tailwind)     │   │
│  │                         │   │
│  │  ┌─── Upload Panel ──┐  │   │
│  │  │ Drag & drop GeoTIFF│  │   │
│  │  │ or .png/.jpg       │  │   │
│  │  └────────────────────┘  │   │
│  │  ┌─── Viewer ─────────┐  │   │
│  │  │ Side-by-side        │  │   │
│  │  │ Before / After      │  │   │
│  │  │ Zoom / Pan / Swipe  │  │   │
│  │  └────────────────────┘  │   │
│  │  ┌─── Metrics Panel ──┐  │   │
│  │  │ PSNR: 32.4 dB      │  │   │
│  │  │ SSIM: 0.94         │  │   │
│  │  │ SAM:  3.2°         │  │   │
│  │  └────────────────────┘  │   │
│  │  ┌─── Download ───────┐  │   │
│  │  │ Export as GeoTIFF   │  │   │
│  │  │ Export as PNG       │  │   │
│  │  └────────────────────┘  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │       Backend            │   │
│  │  (FastAPI + Celery)     │   │
│  │                         │   │
│  │  ┌─── REST API ───────┐ │   │
│  │  │ POST /predict       │ │   │
│  │  │ GET  /status/{id}   │ │   │
│  │  │ GET  /metrics       │ │   │
│  │  └────────────────────┘ │   │
│  │  ┌─── Task Queue ─────┐ │   │
│  │  │ Celery + Redis      │ │   │
│  │  │ Async inference     │ │   │
│  │  └────────────────────┘ │   │
│  │  ┌─── Model Server ───┐ │   │
│  │  │ PyTorch model load  │ │   │
│  │  │ GPU/CPU inference   │ │   │
│  │  └────────────────────┘ │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

---

## 📅 Project Flow & Work Packages

```
WEEK 1-2:  Data Acquisition & Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├── Register on Bhoonidhi portal
├── Download LISS-IV scenes (NER region)
│   ├── Cloudy + Clear pairs (same location)
│   └── Historical references
├── Setup repo structure
├── Build data preprocessing pipeline
│   ├── Band stacking
│   ├── DN → TOA Reflectance conversion
│   ├── Image registration
│   └── Patch generation (256×256)
└── Build synthetic cloud generator

WEEK 3-4:  Baseline Model (GAN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├── Implement U-Net generator
│   └── With Cloud Attention Module
├── Implement Multi-scale PatchGAN discriminator
├── Define loss functions
│   ├── Charbonnier (L1 smooth)
│   ├── SSIM loss
│   ├── Gradient loss
│   ├── Spectral Angle Mapper (SAM) loss
│   └── Adversarial loss
├── Training loop with callbacks
├── Experiment tracking (TensorBoard/MLflow)
└── Evaluation on holdout set

WEEK 5-6:  Advanced Model (Diffusion)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├── Implement/Adapt EMRDM or DB-CR
├── SAR-optical fusion module (optional)
│   ├── Download Sentinel-1 GRD scenes
│   ├── Co-register with LISS-IV
│   └── Cross-attention fusion blocks
├── Train diffusion model
└── Compare with GAN baseline

WEEK 7-8:  Backend & Frontend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├── FastAPI backend
│   ├── Model loading & inference
│   ├── Async task queue (Celery + Redis)
│   └── REST endpoints
├── React frontend
│   ├── Upload interface
│   ├── Side-by-side viewer (swipe/zoom)
│   ├── Metrics display
│   └── Download results
└── Dockerize everything

WEEK 9-10: Optimization & Deployment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├── Model optimization
│   ├── TorchScript / ONNX export
│   ├── Quantization (FP16/INT8)
│   └── TensorRT (if NVIDIA GPU)
├── Performance tuning
├── Security hardening
├── Testing (unit + integration + E2E)
└── Deploy (HuggingFace Spaces / EC2 / Local)
```

---

## 🛠️ Tech Stack

### Core AI/ML

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | PyTorch 2.x | Model building & training |
| **Geospatial** | Rasterio + GDAL | GeoTIFF I/O, CRS handling |
| **Image Processing** | OpenCV, scikit-image, Albumentations | Augmentation, transforms |
| **Spectral Metrics** | torchmetrics, kornia | SAM, PSNR, SSIM |
| **Experiment Tracking** | MLflow / TensorBoard | Logging, hyperparameter tuning |

### Backend

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **API** | FastAPI + Uvicorn | RESTful inference server |
| **Task Queue** | Celery + Redis | Async inference for large images |
| **Model Serving** | TorchServe / custom | Model versioning, batching |

### Frontend

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | React (Vite + Tailwind CSS) | UI |
| **Map/Image Viewer** | Leaflet + GeoTIFF.js / OpenSeadragon | Large image visualization |
| **Charts** | Recharts / Chart.js | Metrics visualization |

### Infrastructure

| Component | Technology |
|-----------|-----------|
| **Container** | Docker + docker-compose |
| **GPU Support** | NVIDIA CUDA 12.x + cuDNN |
| **Deployment** | Local / HuggingFace Spaces / AWS EC2 G4 |

---

## 📚 Reference Solutions (BAH 2026)

These teams tackled the **exact same problem statement**:

| Repo | Approach | Highlights |
|------|----------|-----------|
| [karthikeyan-shankar/LISS-IV-Cloud-Removal](https://github.com/karthikeyan-shankar/LISS-IV-Cloud-Removal) | Hybrid GAN (Pix2Pix) | FastAPI + React, Docker, Bhoonidhi data |
| [Roshan3399/cloud-removal](https://github.com/Roshan3399/cloud-removal) | U-Net + Cloud Attention + PatchGAN | Lightweight, CPU-friendly, MIT licensed |
| [Mouryagna/Generative-AI-Based-Cloud-Removal...](https://github.com/Mouryagna/Generative-AI-Based-Cloud-Removal-and-Reconstruction-for-LISS-IV-Satellite-Imagery) | Multi-modal fusion | SAR + Optical fusion focus |

### Key Datasets for Training

| Dataset | Description | Link |
|---------|-------------|------|
| **SEN12MS-CR** | Sentinel-2 + Sentinel-1 paired, global | [Link](https://patricktum.github.io/cloud_removal/sen12mscr/) |
| **RICE1** | Thin cloud removal benchmark | [Link](https://github.com/BUPTLdy/RICE_DATASET) |
| **CUHK-CR** | Cloud removal paired dataset | [Link](https://github.com/littlebeen/DDPM-Enhancement-for-Cloud-Removal) |
| **Bhoonidhi** | Real LISS-IV scenes (our target) | [Bhoonidhi Portal](https://bhoonidhi.nrsc.gov.in) |

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Limited LISS-IV training data | High | Use synthetic clouds + transfer learning from SEN12MS-CR |
| Cloud-free reference scarcity | High | Multi-temporal approach: use clear pixels from different dates |
| High compute requirement | Medium | Start with lightweight GAN, scale to diffusion later |
| Co-registration errors | Medium | Use Rasterio/GDAL warping with GCPs |
| Spectral consistency loss | Medium | Add SAM loss + spectral normalization in training |
| Model overfitting to NER region | Low | Augment with diverse geography from SEN12MS-CR |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- PyTorch 2.x
- Rasterio / GDAL
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/SaiVenkatesh7002/ISRO-project-team-SIRIus.git
cd ISRO-project-team-SIRIus

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt
```

### Quick Start

```bash
# Train on synthetic data
python scripts/train.py --config configs/default.yaml

# Inference on single image
python scripts/inference.py --input cloudy.tif --output clear.tif --checkpoint checkpoints/best.pth

# Evaluate metrics
python scripts/evaluate.py --pred_dir predictions/ --gt_dir ground_truth/
```

---

## 👥 Team Workflow

1. **Dataset Sourcing:**
   - Find matching LISS-IV scenes of the same coordinates (e.g., Guwahati / Shillong) on ISRO's **Bhoonidhi** portal
   - Download cloudy + historical clear scenes → place in `data/raw/cloudy` and `data/raw/clear`

2. **Dataset Preparation:**
   - Run preprocessing scripts to slice scenes into coordinate-registered 256×256 tiles

3. **Model Training:**
   - Train the model (GAN or Diffusion) using PyTorch training scripts

4. **Evaluation:**
   - Compute PSNR, SSIM, SAM, LPIPS metrics
   - Visual comparison side-by-side

5. **Operational Interface:**
   - Run FastAPI server for the web dashboard
   - Upload cloudy image → Get cloud-free reconstruction

---

## 📁 Project Structure

```
ISRO-project-team-SIRIus/
├── data/
│   ├── raw/           # Raw GeoTIFF scenes
│   │   ├── cloudy/
│   │   └── clear/
│   ├── patches/       # 256×256 tiles
│   └── synthetic/     # Synthetic cloud data
├── src/
│   ├── data/          # Preprocessing, patching, cloud masking
│   ├── models/        # U-Net, Diffusion, Discriminator, Losses
│   ├── training/      # Training loop, callbacks
│   ├── inference/     # Inference & evaluation
│   ├── web/           # FastAPI backend + React frontend
│   └── utils/         # Metrics, visualization helpers
├── configs/           # YAML configuration files
├── notebooks/         # Jupyter notebooks for exploration
├── scripts/           # CLI entry points
├── checkpoints/       # Trained model weights
├── requirements.txt   # Python dependencies
├── setup.py           # Package setup
├── Dockerfile         # Container definition
└── README.md          # This file
```

---

## 📄 License

This project is developed for the **Bharatiya Antariksh Hackathon (BAH) 2026** under Team SIRIus.

---

## 🙏 Acknowledgments

- **ISRO / NRSC** — Data via Bhoonidhi portal
- **ESA Copernicus** — Sentinel-1 & Sentinel-2 data
- Open-source community for foundational research in remote sensing AI

---

*Last updated: June 2026 | Built with OpenCode GOLIATH*