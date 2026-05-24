"""
config.py — Configuración centralizada del backend.

Utiliza pydantic-settings para leer variables de entorno
desde un archivo .env o del sistema operativo.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Configuración general de la aplicación."""

    # ── MongoDB ──────────────────────────────────────────
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "fuzzydx_db"

    # ── Servidor ─────────────────────────────────────────
    APP_ENV: str = "development"
    APP_PORT: int = 8000
    APP_HOST: str = "0.0.0.0"

    # ── CORS ─────────────────────────────────────────────
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # ── Lógica Difusa ────────────────────────────────────
    FUZZY_THRESHOLD: float = 2.5

    @property
    def cors_origins_list(self) -> List[str]:
        """Devuelve la lista de orígenes CORS como una lista de strings."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


# Instancia global — se importa desde cualquier módulo
settings = Settings()
