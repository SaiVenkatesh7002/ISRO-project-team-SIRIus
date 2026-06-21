from dataclasses import dataclass, field
from pathlib import Path
from uuid import uuid4

from app.core.config import settings


@dataclass
class JobState:
    job_id: str
    filename: str
    folder: Path
    status: str = "queued"
    progress: int = 0
    step: str = "Created"
    error: str | None = None
    metrics: dict[str, float | int | str] = field(default_factory=dict)
    previews: dict[str, str] = field(default_factory=dict)
    downloads: dict[str, Path] = field(default_factory=dict)

    def to_public_dict(self) -> dict[str, object]:
        return {
            "job_id": self.job_id,
            "filename": self.filename,
            "status": self.status,
            "progress": self.progress,
            "current_step": self.step,
            "error": self.error,
        }

    def to_result_dict(self) -> dict[str, object]:
        return {
            **self.to_public_dict(),
            "metrics": self.metrics,
            "previews": self.previews,
            "downloads": {
                name: f"/download/{self.job_id}/{name}" for name in self.downloads
            },
        }


_jobs: dict[str, JobState] = {}


def create_job(filename: str) -> JobState:
    job_id = uuid4().hex[:12]
    folder = settings.storage_dir / job_id
    folder.mkdir(parents=True, exist_ok=True)
    job = JobState(job_id=job_id, filename=filename, folder=folder)
    _jobs[job_id] = job
    return job


def get_job(job_id: str) -> JobState | None:
    return _jobs.get(job_id)


def update_job(job_id: str, **changes: object) -> None:
    job = _jobs[job_id]
    for key, value in changes.items():
        setattr(job, key, value)
