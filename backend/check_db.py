"""Verifica la conexion a MongoDB y muestra el documento de prueba."""
import asyncio
import os
import json
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()


async def check():
    client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
    db = client["sem_web_advisor"]
    collection = db["audit_reports"]

    count = await collection.count_documents({})
    print(f"Documentos encontrados: {count}")

    doc = await collection.find_one({}, {"_id": 0})
    if doc:
        print("--- Documento de prueba ---")
        print(json.dumps(doc, indent=2, ensure_ascii=False))
    else:
        print("No se encontraron documentos.")

    client.close()


if __name__ == "__main__":
    asyncio.run(check())
