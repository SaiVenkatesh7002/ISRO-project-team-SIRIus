# Frontend Development Plan — ISRO Team SIRIus

## Purpose

The frontend is the user-facing web dashboard for the ISRO Team SIRIus cloud-removal system. It allows users to upload cloudy LISS-IV satellite images, track processing, compare original and reconstructed outputs, view quality metrics, and download results.

## Recommended Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| Framework | React + Vite | Fast modern frontend |
| Styling | Tailwind CSS | Clean responsive UI |
| Routing | React Router | Multi-page navigation |
| Animations | Framer Motion | Smooth transitions and loaders |
| API Calls | Axios or Fetch | Communicate with FastAPI backend |
| Image Viewer | OpenSeadragon / Leaflet | Zoom and pan for large images |
| GeoTIFF Preview | GeoTIFF.js | Optional browser-side GeoTIFF handling |
| Charts | Recharts / Chart.js | Display metrics visually |
| Icons | Lucide React / React Icons | UI icons |

## Design Style

- Theme: space-tech, satellite, scientific, ISRO-inspired.
- Background: dark navy or black-blue.
- Accent colors: cyan/blue and orange.
- Use glassmorphism cards, thin borders, soft shadows, and clean typography.
- Use satellite, cloud, map, and AI-related visuals.
- Keep UI simple enough for non-technical judges.

## Pages

### 1. Home Page

Goal: Explain the project quickly.

Sections:

- Hero title: **Generative AI-Based Cloud Removal for LISS-IV Imagery**.
- Short description of the cloud-cover problem.
- CTA buttons:
  - Start Reconstruction
  - View Methodology
- Feature cards:
  - LISS-IV satellite imagery
  - AI cloud removal
  - Before/after visualization
  - Scientific metrics
- Optional animated satellite/cloud background.

### 2. Upload Page

Goal: Let the user provide a cloudy satellite image.

Features:

- Drag-and-drop upload box.
- Manual file picker.
- Supported formats: `.tif`, `.tiff`, `.png`, `.jpg`, `.jpeg`.
- File validation messages.
- Preview thumbnail for normal images.
- Optional metadata form:
  - location,
  - date,
  - satellite/source,
  - notes.
- Button: **Run Cloud Removal**.

### 3. Processing Page

Goal: Show the backend/AI job progress.

Features:

- Progress bar.
- Animated satellite/orbit loader.
- Step tracker:
  1. Upload received
  2. Validating image
  3. Preprocessing
  4. Running AI model
  5. Stitching output
  6. Calculating metrics
  7. Completed
- Poll backend using `GET /status/{job_id}`.
- Show friendly error message if processing fails.

### 4. Results Page

Goal: Display reconstruction output.

Features:

- Before/after side-by-side viewer.
- Swipe comparison slider.
- Zoom and pan support for large images.
- Metrics cards:
  - PSNR,
  - SSIM,
  - SAM,
  - LPIPS,
  - inference time.
- Download buttons:
  - PNG preview,
  - GeoTIFF output,
  - optional PDF report.
- Button to process another image.

### 5. Methodology Page

Goal: Explain how the system works.

Sections:

- LISS-IV sensor details: 5.8 m resolution, green/red/NIR bands.
- Data pipeline: Bhoonidhi download, band stacking, co-registration, patching.
- Model strategy: Hybrid GAN MVP and diffusion advanced version.
- Evaluation metrics explanation.
- Architecture diagram.

### 6. Team Page

Goal: Present Team SIRIus.

Sections:

- Team name and project context.
- Member cards with roles.
- Acknowledgments to ISRO/NRSC and open-source datasets.

## Required Components

```text
components/
├── Navbar.jsx
├── Footer.jsx
├── HeroSection.jsx
├── FeatureCard.jsx
├── UploadDropzone.jsx
├── FilePreviewCard.jsx
├── MetadataForm.jsx
├── ProgressStepper.jsx
├── ProcessingLoader.jsx
├── ImageComparisonSlider.jsx
├── MetricsCard.jsx
├── MetricsChart.jsx
├── DownloadPanel.jsx
├── ArchitectureDiagram.jsx
├── StatusBadge.jsx
├── ErrorAlert.jsx
└── TeamMemberCard.jsx
```

## Suggested Frontend File Structure

```text
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Upload.jsx
│   │   ├── Processing.jsx
│   │   ├── Results.jsx
│   │   ├── Methodology.jsx
│   │   └── Team.jsx
│   ├── services/
│   │   └── api.js
│   ├── store/
│   │   └── jobStore.js
│   ├── utils/
│   │   ├── fileValidation.js
│   │   └── formatMetrics.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

## Backend API Integration

### Upload and Start Job

`POST /predict`

Frontend sends:

- image file,
- optional metadata.

Backend returns:

- `job_id`,
- status,
- message.

### Track Job

`GET /status/{job_id}`

Frontend receives:

- status: queued, processing, completed, failed,
- progress percentage,
- current step,
- error message if failed.

### Fetch Results

`GET /result/{job_id}`

Frontend receives:

- original preview URL,
- reconstructed preview URL,
- metrics,
- download links.

### Download Output

`GET /download/{job_id}`

Downloads reconstructed image.

## Frontend State Flow

```text
idle
 → selected_file
 → uploading
 → queued
 → processing
 → completed
 → result_displayed

Any state → failed, if backend returns an error.
```

## Animations

- Page fade/slide transitions.
- Floating satellite in hero section.
- Moving cloud overlay.
- Progress step animation.
- Card hover animations.
- Smooth before/after image slider.

## Extra Frontend Features

- Demo sample image button.
- Dark/light mode toggle.
- Cloud mask overlay toggle.
- Confidence heatmap overlay.
- Processing history using local storage.
- Export report button.
- Interactive map if image metadata has coordinates.

## Frontend Completion Criteria

- User can upload a satellite image.
- User can see processing progress.
- User can view original and reconstructed images.
- User can read metrics clearly.
- User can download output.
- UI is responsive and presentation-ready.
