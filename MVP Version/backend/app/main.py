from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import router
from app.core.config import settings


app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

settings.storage_dir.mkdir(parents=True, exist_ok=True)
app.mount("/files", StaticFiles(directory=settings.storage_dir), name="files")
app.include_router(router)


@app.get("/health")
def health_check() -> dict[str, object]:
    return {"status": "ok", "model_loaded": True, "mode": "mvp-demo"}
