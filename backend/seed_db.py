"""
seed_db.py — Script para insertar un documento JSON-LD de prueba en MongoDB.
Ejecutar una sola vez: python seed_db.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

SAMPLE_REPORT = {
    "@context": {
        "schema": "https://schema.org/",
        "onto": "http://www.semanticweb.org/jorge/ontologies/2026/5/untitled-ontology-4#"
    },
    "@type": "schema:Dataset",
    "schema:name": "Auditoría SEM-Web-Advisor",
    "schema:dateCreated": "2026-06-10T12:00:00Z",
    "schema:url": "https://example.com",
    "onto:fuzzyVerdict": {
        "schema:value": 82.5,
        "schema:description": "Urgente"
    },
    "onto:Recommendation": [
        {
            "@type": "onto:Recommendation",
            "onto:hasStatus": {"@id": "onto:Critical"},
            "onto:suggestsAction": {"@id": "onto:Accessibility"},
            "schema:description": "12 etiquetas <img> sin atributo alt. Se sugiere agregar texto alternativo descriptivo."
        },
        {
            "@type": "onto:Recommendation",
            "onto:hasStatus": {"@id": "onto:Acceptable"},
            "onto:suggestsAction": {"@id": "onto:SEO"},
            "schema:description": "Falta de meta descriptions en 5 páginas."
        }
    ]
}


async def seed():
    uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME", "sem_web_advisor")
    collection_name = os.getenv("COLLECTION_NAME", "audit_reports")

    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    collection = db[collection_name]

    # Verificar si ya existe un documento
    existing = await collection.count_documents({})
    if existing > 0:
        print(f"⚠️  Ya existen {existing} documento(s) en '{collection_name}'. No se insertó nada.")
    else:
        result = await collection.insert_one(SAMPLE_REPORT)
        print(f"✅ Documento de prueba insertado con _id: {result.inserted_id}")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
