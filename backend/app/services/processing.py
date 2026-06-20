from pathlib import Path
from shutil import copyfile
from time import perf_counter, sleep

from app.core.job_manager import get_job, update_job


def process_upload(job_id: str, upload_path: Path) -> None:
    start = perf_counter()
    try:
        _set(job_id, 20, "Preprocessing image")
        sleep(0.3)

        _set(job_id, 45, "Running MVP demo inference")
        sleep(0.5)

        job = get_job(job_id)
        if job is None:
            return

        output_path = job.folder / "reconstructed_output.png"
        original_preview = job.folder / "original_preview.png"
        _copy_demo_file(upload_path, output_path)
        _copy_demo_file(upload_path, original_preview)

        _set(job_id, 75, "Calculating demo metrics")
        sleep(0.2)

        elapsed = round(perf_counter() - start, 2)
        update_job(
            job_id,
            status="completed",
            progress=100,
            step="Completed",
            metrics={"psnr": 32.4, "ssim": 0.94, "sam": 3.2, "inference_time_sec": elapsed},
            previews={
                "original": f"/files/{job_id}/{original_preview.name}",
                "output": f"/files/{job_id}/{output_path.name}",
            },
            downloads={"png": output_path, "original": upload_path},
        )
    except Exception as exc:  # noqa: BLE001 - final job safety boundary
        update_job(job_id, status="failed", progress=100, step="Failed", error=str(exc))


def _set(job_id: str, progress: int, step: str) -> None:
    update_job(job_id, status="processing", progress=progress, step=step)


def _copy_demo_file(source: Path, destination: Path) -> None:
    copyfile(source, destination)
