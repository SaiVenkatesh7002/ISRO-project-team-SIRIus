# MVP Execution Tasks — ISRO Team SIRIus

## Immediate Goal

Build a working MVP demo:

```text
Upload image → backend creates job → frontend tracks status → result page shows before/after + metrics + downloads
```

The first version can use demo processing. Real cloud-removal inference can replace the demo processor later.

---

## Rockie — Backend Lead + Coordinator

### Day 1

- [x] Create FastAPI backend skeleton.
- [x] Add `/health`, `/predict`, `/status/{job_id}`, `/result/{job_id}`, and `/download/{job_id}/{format_name}`.
- [x] Add in-memory job manager for MVP.
- [x] Add demo processing service.
- [ ] Test upload flow locally with a small PNG/JPG.
- [ ] Coordinate frontend API contract with Laksha and Mru.

### Day 2

- [ ] Replace demo processor with real preprocessing/inference function.
- [ ] Add safe file cleanup strategy.
- [ ] Add better error handling and logging.
- [ ] Prepare backend run instructions for the team.

---

## Venkyy — Research + Model/Preprocessing Support

### Day 1

- [ ] Confirm exact LISS-IV data availability from Bhoonidhi.
- [ ] Find/download one small test satellite image or tile.
- [ ] Research usable pretrained cloud-removal baseline.
- [ ] Write simple explanation of GAN MVP vs diffusion advanced model.

### Day 2

- [ ] Define `process_image(input_path) -> result` interface for Rockie.
- [ ] Help implement preprocessing: read image, normalize, patchify.
- [ ] Help define metrics: PSNR, SSIM, SAM, inference time.
- [ ] Prepare methodology content for PPT/About page.

---

## Laksha — Frontend Pages + Upload Flow

### Day 1

- [x] Frontend skeleton created.
- [x] Home page created.
- [x] Upload page created.
- [ ] Improve Upload page UI.
- [ ] Test API call to `/predict`.

### Day 2

- [ ] Add metadata form fields.
- [ ] Improve responsive layout.
- [ ] Add validation messages for unsupported files.
- [ ] Polish Home and About pages.

---

## Mru — Results UI + Animations

### Day 1

- [x] Results page created.
- [x] Step tracker created.
- [x] Metrics cards created.
- [ ] Improve before/after comparison UI.

### Day 2

- [ ] Add smoother loading animations.
- [ ] Add image zoom/pan or better comparison slider.
- [ ] Improve result metrics visual design.
- [ ] Add final visual polish for demo.

---

## Cut Scope Rules

If time is short:

1. Keep the demo processor and focus on end-to-end flow.
2. Use PNG/JPG first; GeoTIFF can be shown as planned support.
3. Do not add login, database, Celery, Redis, or heavy deployment until MVP works.
4. Prioritize a clean demo over complex model claims.

---

## Next Technical Milestones

- [ ] Backend runs locally with `uvicorn app.main:app --reload`.
- [ ] Frontend runs locally with `npm run dev`.
- [ ] Upload from frontend reaches backend successfully.
- [ ] Status polling works.
- [ ] Results page displays previews and metrics.
- [ ] Demo image can be downloaded.
- [ ] Real model/preprocessing replaces demo copy logic.
