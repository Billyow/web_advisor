"""
config.py — Configuración centralizada del backend.
Lee variables de entorno desde un archivo .env usando Pydantic BaseSettings.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configuración de la aplicación cargada desde variables de entorno."""

    # --- MongoDB ---
    MONGO_URI: str = "mongodb+srv://<user>:<password>@cluster.mongodb.net/"
    DB_NAME: str = "sem_web_advisor"
    COLLECTION_NAME: str = "audit_reports"

    # --- CORS ---
    FRONTEND_URL: str = "http://localhost:5173"

    # --- App ---
    APP_TITLE: str = "SEM-Web-Advisor API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Singleton cacheado para evitar re-leer .env en cada request."""
    return Settings()
