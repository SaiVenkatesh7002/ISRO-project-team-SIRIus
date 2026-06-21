from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ISRO Team SIRIus API"
    storage_dir: Path = Path("storage")
    max_upload_mb: int = 50
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    model_config = SettingsConfigDict(env_prefix="SIRIUS_")


settings = Settings()
