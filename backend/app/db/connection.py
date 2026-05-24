"""
connection.py — Conexión asíncrona a MongoDB con motor.

Provee un cliente singleton que se inicializa al arrancar la
aplicación y se cierra al detenerla, gestionado desde los
eventos del ciclo de vida de FastAPI.
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

# ── Estado del módulo ────────────────────────────────────
_client: AsyncIOMotorClient | None = None
_database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    """
    Establece la conexión con MongoDB.
    Se llama desde el evento `startup` de FastAPI.
    """
    global _client, _database
    print(f"🔌 Conectando a MongoDB en {settings.MONGODB_URI} ...")
    _client = AsyncIOMotorClient(settings.MONGODB_URI)
    _database = _client[settings.MONGODB_DB_NAME]

    # Verificar conectividad
    await _client.admin.command("ping")
    print(f"✅ Conexión exitosa — Base de datos: {settings.MONGODB_DB_NAME}")


async def close_mongo_connection() -> None:
    """
    Cierra la conexión con MongoDB.
    Se llama desde el evento `shutdown` de FastAPI.
    """
    global _client, _database
    if _client is not None:
        _client.close()
        _client = None
        _database = None
        print("🔒 Conexión a MongoDB cerrada.")


def get_database() -> AsyncIOMotorDatabase:
    """Devuelve la instancia de la base de datos activa."""
    if _database is None:
        raise RuntimeError(
            "La base de datos no está inicializada. "
            "Asegúrate de llamar a connect_to_mongo() primero."
        )
    return _database
