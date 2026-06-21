# 🚀 Team SIRIus: Ultimate Project Roadmap & Strategy

**Project:** Generative AI-Based Cloud Removal & Reconstruction for LISS-IV Imagery  
**Event:** Bharatiya Antariksh Hackathon (BAH) 2026  
**Core Constraint:** Final exams run from July 3rd to July 22nd. The project must be structured to accommodate this.

---

## 📅 The 4-Phase Master Plan

### 🔴 Phase 1: The "Hack & Sleep" MVP (Now – June 25)
*Goal: Build a working demo, submit the Idea PPT, and clear our desks for exam prep.*

*   **Frontend (Laksha & Mru):** Complete the React UI (Upload -> Loading -> Results Page with Before/After slider & metrics).
*   **Backend (Rockie):** Integrate the frontend with the FastAPI backend. Bypass heavy PyTorch AI training for now. Implement the **OpenCV Baseline** to instantly remove clouds and calculate real metrics (PSNR/SSIM) locally.
*   **Presentation (Venkyy):** Compile the research and architecture notes into the PPT template. Embed screenshots of the working MVP to prove our architecture is viable.
*   **Action:** Submit the Idea PPT to Hack2Skill before June 25th.

### 🟡 Phase 2: Total Exam Lockdown (June 25 – July 22)
*Goal: Ace final exams. Zero coding.*

*   **July 20:** Announcement of Shortlisted Teams.
*   **July 21:** Induction Session (Only one team member logs in to monitor).
*   No AI training or development occurs during this phase. 

### 🟢 Phase 3: The 14-Day AI Sprint (July 23 – August 5)
*Goal: Build the real Artificial Intelligence model.*

*   Exams are finished. We have exactly 14 days until the finale.
*   Since the Frontend and API infrastructure were completed in Phase 1, the team focuses 100% on **Model Training**.
*   Train the PyTorch U-Net GAN on LISS-IV / SEN12MS-CR datasets.
*   Swap out the backend OpenCV script with the actual trained PyTorch weights.

### 🏆 Phase 4: 30-Hour Grand Finale (August 6 – August 7)
*Goal: Polish, Optimize, and Win.*

*   Enter the 30-hour sprint with a fully functioning, tested application.
*   Focus strictly on advanced deployment optimizations (converting the model to **TensorRT**) so it runs lightning-fast during the live judge demonstration.

---

## 👥 Team Roles & Current Focus

| Member | Role | Immediate Action Item |
|--------|------|-----------------------|
| **Rockie** | Backend Lead & Project Coordinator | Integrate frontend files with FastAPI; implement OpenCV baseline processor; fix API bugs. |
| **Venkyy** | Research Lead | Translate architectural choices into the PPT; explain the methodology to judges. |
| **Laksha** | Frontend Developer | Build the structural UI (Upload flows, layout, page routing). |
| **Mru** | Frontend Developer | Build the results experience (animations, Before/After slider, metrics display). |

---

## 📖 Team Glossary (Simple Explanations for PPT & Judges)
*(Use these simple definitions to make sure everyone is on the same page when talking to the judges!)*

**1. OpenCV Baseline (Our Phase 1 "Fake AI")**
OpenCV is a traditional coding library for images. A "baseline" means we are using standard math formulas to remove clouds, rather than a trained AI. It is incredibly fast and runs on a normal laptop without crashing. We are using this just to get our MVP working before we actually train the AI.

**2. PyTorch**
The programming framework created by Meta/Facebook that we will use in July to build and train our actual Artificial Intelligence. 

**3. GAN (Generative Adversarial Network)**
The specific type of AI we are building. It works by making two AIs fight each other: 
*   **The Generator:** Tries to create a perfectly fake "cloud-free" image.
*   **The Discriminator:** Looks at the image and tries to catch the Generator's mistakes.
Over time, the Generator gets so good at removing clouds that the Discriminator can't tell it's fake.

**4. U-Net**
The specific "shape" of our AI. It takes a large cloudy image, shrinks it down to understand the core features (the "U" shape), and expands it back out into a clear image.

**5. Rasterio & `rasterio.windows`**
Satellite images are massive (often gigabytes). `rasterio.windows` is a trick that allows our code to load the image in small "chunks" (windows) rather than all at once, preventing our servers from crashing due to running out of RAM.

**6. GeoTIFF & CRS (Coordinate Reference System)**
A GeoTIFF is like a normal `.png`, but it has GPS coordinates hidden inside. The CRS is the specific "grid" or map projection the satellite uses. If we don't maintain strict CRS consistency, our map data might accidentally get placed in the middle of the ocean.

**7. PSNR & SSIM (Our Quality Metrics)**
The math formulas we use to prove to the judges that our AI is good.
*   **PSNR:** Measures how much "error" or noise we introduced. Higher is better.
*   **SSIM:** Measures how well we preserved the actual shapes (buildings, roads, rivers) underneath the clouds. 1.0 is a perfect score.

**8. Mixed Precision / `torch.cuda.amp.autocast()`**
A genius coding trick for the GPU. It forces the computer to use 16-bit math instead of 32-bit math for certain tasks, which cuts our memory usage in half and makes training the AI twice as fast.

**9. TensorRT**
A tool made by NVIDIA. Once our AI is fully trained in August, it might be a bit slow. TensorRT takes our finished AI and "compresses" it, making it run lightning-fast. This is a massive flex for the 30-hour finale demo.
