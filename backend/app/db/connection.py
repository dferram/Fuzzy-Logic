"""
connection.py — Conexión asíncrona a MongoDB con motor.

Usa un patrón lazy: la conexión se establece en el primer
request en lugar de durante el startup. Esto es compatible
con entornos serverless como Vercel.
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

# ── Estado del módulo ────────────────────────────────────
_client: AsyncIOMotorClient | None = None
_database: AsyncIOMotorDatabase | None = None


async def get_or_create_connection() -> AsyncIOMotorDatabase:
    """
    Devuelve la base de datos, creando la conexión si no existe.
    Patrón lazy compatible con entornos serverless.
    """
    global _client, _database

    if _client is None or _database is None:
        print(f"[DB] Conectando a MongoDB ({settings.MONGODB_DB_NAME}) ...")
        _client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000,
        )
        _database = _client[settings.MONGODB_DB_NAME]
        # Verificar conectividad
        await _client.admin.command("ping")
        print(f"[DB] Conexión exitosa — Base de datos: {settings.MONGODB_DB_NAME}")

    return _database


async def connect_to_mongo() -> None:
    """Alias para compatibilidad. Llama a get_or_create_connection."""
    await get_or_create_connection()


async def close_mongo_connection() -> None:
    """Cierra la conexión con MongoDB."""
    global _client, _database
    if _client is not None:
        _client.close()
        _client = None
        _database = None
        print("[DB] Conexión a MongoDB cerrada.")


def get_database() -> AsyncIOMotorDatabase:
    """
    Devuelve la instancia de la base de datos activa.
    Lanza RuntimeError si no se ha inicializado todavía.
    """
    if _database is None:
        raise RuntimeError(
            "La base de datos no está inicializada. "
            "Asegúrate de llamar a get_or_create_connection() primero."
        )
    return _database
