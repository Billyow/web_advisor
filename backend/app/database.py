"""
database.py — Cliente asíncrono de MongoDB usando Motor.
Proporciona un singleton para reutilizar la conexión en toda la aplicación.
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import get_settings

# --- Singleton del cliente Motor ---
_client: AsyncIOMotorClient | None = None
_database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    """Inicializa la conexión a MongoDB Atlas. Se llama al inicio de la app."""
    global _client, _database
    settings = get_settings()
    _client = AsyncIOMotorClient(settings.MONGO_URI)
    _database = _client[settings.DB_NAME]
    print(f"[OK] Conectado a MongoDB: {settings.DB_NAME}")


async def close_mongo_connection() -> None:
    """Cierra la conexión a MongoDB. Se llama al apagar la app."""
    global _client, _database
    if _client:
        _client.close()
        _client = None
        _database = None
        print("[OK] Conexion a MongoDB cerrada.")


def get_database() -> AsyncIOMotorDatabase:
    """Retorna la instancia de la base de datos. Lanza error si no está conectada."""
    if _database is None:
        raise RuntimeError(
            "La base de datos no está inicializada. "
            "Asegúrate de que connect_to_mongo() fue llamado."
        )
    return _database
