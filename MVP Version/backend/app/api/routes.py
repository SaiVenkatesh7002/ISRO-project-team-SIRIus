from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.job_manager import create_job, get_job, update_job
from app.services.processing import process_upload
from app.services.validation import validate_upload

router = APIRouter()


@router.post("/predict")
async def predict(background_tasks: BackgroundTasks, file: UploadFile = File(...)) -> dict[str, str]:
    validate_upload(file)
    job = create_job(file.filename or "upload")
    upload_path = job.folder / f"original{Path(file.filename or '').suffix.lower()}"

    with upload_path.open("wb") as output:
        while chunk := await file.read(1024 * 1024):
            output.write(chunk)

    update_job(job.job_id, status="queued", progress=5, step="Upload received")
    background_tasks.add_task(process_upload, job.job_id, upload_path)
    return {"job_id": job.job_id, "status": "queued", "message": "Cloud removal job started"}


@router.get("/status/{job_id}")
def status(job_id: str) -> dict[str, object]:
    job = get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job.to_public_dict()


@router.get("/result/{job_id}")
def result(job_id: str) -> dict[str, object]:
    job = get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status != "completed":
        raise HTTPException(status_code=409, detail="Job is not completed yet")
    return job.to_result_dict()


@router.get("/download/{job_id}/{format_name}")
def download(job_id: str, format_name: str) -> FileResponse:
    job = get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if format_name not in {"png", "geotiff", "original"}:
        raise HTTPException(status_code=400, detail="Unsupported download format")

    path = job.downloads.get(format_name)
    if path is None or not path.exists():
        raise HTTPException(status_code=404, detail="File not available")
    return FileResponse(path=path, filename=path.name)
