# PPT Prompt for Gamma AI — ISRO Team SIRIus

Copy and paste this prompt into Gamma AI to generate a detailed presentation.

## Gamma AI Prompt

Create a professional, visually impressive hackathon presentation for a project named **ISRO Team SIRIus: Generative AI-Based Cloud Removal and Reconstruction for LISS-IV Satellite Imagery**.

The presentation should be suitable for an ISRO/Bharatiya Antariksh Hackathon style evaluation. Use a modern space-tech theme with dark navy backgrounds, satellite visuals, cloud overlays, cyan highlights, and ISRO-inspired orange accents. Keep the language understandable for judges from both technical and non-technical backgrounds.

## Slide-by-Slide Structure

### Slide 1: Title Slide

Title: **ISRO Team SIRIus**

Subtitle: **Generative AI-Based Cloud Removal and Reconstruction for LISS-IV Satellite Imagery**

Include:
- Team name: Team SIRIus
- Project context: ISRO / Bharatiya Antariksh Hackathon
- Visual: satellite image with clouds transforming into clear land imagery

### Slide 2: The Problem

Explain that optical satellite imagery is often affected by cloud cover and cloud shadows. This is a major issue in tropical and mountainous regions such as North East India. Cloudy images reduce the usability of satellite data for land-use mapping, disaster monitoring, agriculture, infrastructure planning, and environmental analysis.

Key message: **Valuable satellite images become partially unusable because clouds hide important ground information.**

### Slide 3: Why LISS-IV Matters

Explain LISS-IV in simple terms:
- LISS-IV is a high-resolution imaging sensor used in ISRO Resourcesat satellites.
- It provides around 5.8 m spatial resolution.
- It captures important spectral bands such as green, red, and near-infrared.
- It is useful for detailed mapping and monitoring.

Mention that because LISS-IV imagery has high value, recovering cloud-covered regions can improve its practical usability.

### Slide 4: Our Solution

Present the solution as an AI-powered cloud-removal system.

Explain:
- User uploads a cloudy satellite image.
- The system detects/reconstructs cloud-covered regions.
- A generative AI model creates a clearer, cloud-free version.
- The result is displayed with before/after comparison and quality metrics.

Key message: **We convert cloudy satellite images into more usable reconstructed images.**

### Slide 5: What Is Our Actual Work?

Explain that existing AI models already exist, but our work is to adapt and operationalize them for the specific ISRO LISS-IV use case.

Include these points:
- Collect and prepare suitable LISS-IV data.
- Align cloudy and clear images.
- Preprocess GeoTIFF satellite data.
- Train or fine-tune cloud-removal models.
- Compare GAN and diffusion-based approaches.
- Build a usable web application for upload, processing, viewing, and downloading.

Simple line: **Existing models are starting points; our contribution is making them work for LISS-IV data in a usable end-to-end system.**

### Slide 6: System Architecture

Show a clean architecture diagram with these blocks:

1. User Interface
2. Image Upload
3. FastAPI Backend
4. Preprocessing Pipeline
5. AI Cloud-Removal Model
6. Postprocessing and Metrics
7. Result Viewer and Download

Explain how data flows from user upload to AI inference to final output.

### Slide 7: Data Pipeline

Explain the data preparation steps:
- Download LISS-IV scenes from Bhoonidhi.
- Collect cloudy and cloud-free/historical reference images.
- Stack bands such as green, red, and NIR.
- Convert raw values if metadata is available.
- Co-register images so they align correctly.
- Split large images into 256×256 patches.
- Apply normalization and augmentation.
- Generate synthetic clouds if real paired data is limited.

Visual suggestion: pipeline arrow diagram.

### Slide 8: AI Model Strategy

Explain the two-phase model strategy:

Phase 1 MVP:
- Hybrid GAN using U-Net generator, attention module, and PatchGAN discriminator.
- Faster to train and easier to deploy.

Phase 2 Advanced:
- Diffusion model such as EMRDM or diffusion bridge approach.
- Better reconstruction quality but higher compute requirements.

Mention optional SAR/optical fusion using Sentinel-1 or Sentinel-2 for improved reconstruction.

### Slide 9: Evaluation Metrics

Explain the metrics in simple terms:

- PSNR: measures image reconstruction quality.
- SSIM: checks structural similarity with reference image.
- SAM: checks spectral consistency, important for satellite data.
- LPIPS: checks perceptual similarity.
- Inference time: measures speed of processing.

Key message: **We evaluate both visual quality and scientific correctness.**

### Slide 10: Web Application

Show the planned app features:
- Upload satellite image.
- Track processing status.
- View before/after comparison.
- Use swipe slider, zoom, and pan.
- See metrics dashboard.
- Download reconstructed output as PNG or GeoTIFF.

Mention frontend stack: React, Vite, Tailwind CSS, Framer Motion.
Mention backend stack: FastAPI, PyTorch, Rasterio/GDAL, Celery, Redis.

### Slide 11: Innovation and Impact

Explain why the project matters:
- Increases usability of cloudy satellite images.
- Helps monitoring in cloud-prone regions.
- Supports disaster management, mapping, agriculture, infrastructure, and environment analysis.
- Saves time by reducing manual image filtering.
- Provides a deployable tool, not just a model experiment.

Key line: **Our system turns unusable cloudy imagery into actionable geospatial information.**

### Slide 12: Challenges and Mitigation

Create a table with challenges and solutions:

- Limited LISS-IV paired data → use synthetic clouds and transfer learning.
- Cloud-free reference scarcity → use historical clear images and multi-temporal data.
- Co-registration errors → use GDAL/Rasterio alignment methods.
- Spectral mismatch → use SAM loss and spectral consistency checks.
- High compute needs → start with GAN MVP, then scale to diffusion.

### Slide 13: Roadmap

Show a timeline:

Week 1-2:
- Data collection and preprocessing.

Week 3-4:
- Baseline GAN model.

Week 5-6:
- Advanced diffusion or SAR fusion experiments.

Week 7-8:
- Backend and frontend development.

Week 9-10:
- Optimization, testing, deployment, and final presentation.

### Slide 14: Expected Outcome

List final deliverables:
- Clean dataset pipeline.
- Trained baseline cloud-removal model.
- Evaluation metrics and comparison.
- Web dashboard.
- Before/after visualization.
- Downloadable reconstructed output.
- Project report and presentation.

### Slide 15: Closing Slide

Title: **From Cloudy Pixels to Clear Insights**

End with:
**Team SIRIus aims to make LISS-IV satellite imagery more usable through AI-powered cloud removal and reconstruction.**

Include thank you message and team name.

## Design Instructions for Gamma AI

- Use a professional space-tech visual style.
- Use diagrams wherever possible.
- Avoid too much text per slide.
- Use short bullet points with clear headings.
- Add satellite imagery, cloud overlays, AI/neural network visuals, and before/after comparison visuals.
- Use consistent colors: dark navy, cyan, white, and orange.
- Make the presentation look like a serious ISRO hackathon project.

## Tone

Use confident, simple, professional language. Explain technical topics in a way that both engineers and non-technical judges can understand.
