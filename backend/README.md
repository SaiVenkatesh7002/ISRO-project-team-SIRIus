# Backend MVP

FastAPI backend skeleton for ISRO Team SIRIus.

## Run locally

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Endpoints

- `GET /health`
- `POST /predict`
- `GET /status/{job_id}`
- `GET /result/{job_id}`
- `GET /download/{job_id}/{format_name}`

This MVP currently performs demo processing and returns copied previews. Replace `app/services/processing.py` with real preprocessing, inference, postprocessing, and metrics code.
