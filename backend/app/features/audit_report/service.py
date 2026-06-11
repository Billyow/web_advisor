"""
service.py — Lógica de negocio para los reportes de auditoría.
Interactúa con MongoDB para recuperar y procesar reportes JSON-LD.
"""

import json
import random
import os
import datetime
from rdflib import Graph, Namespace
from fastapi import Request
from app.database import get_database
from app.config import get_settings
from app.features.audit_report.fuzzy_engine import fuzzy_evaluate

ONTOLOGY_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ontology", "web_maintenance.owl"))

def extract_recommendations(status_name: str) -> list:
    """Extrae recomendaciones de la ontología para el estado dado."""
    recs = []
    try:
        g = Graph()
        # Parsear como json-ld ya que la ontología provista tiene ese formato
        with open(ONTOLOGY_PATH, 'r', encoding='utf-8') as f:
            g.parse(data=f.read(), format="json-ld")
        
        if status_name == "Critical":
            recs.append("Acción crítica requerida: Revisar el rendimiento general y las buenas prácticas de SEO.")
        elif status_name == "Acceptable":
            recs.append("Aceptable: Continúa mejorando los aspectos de Accesibilidad y SEO.")
        else:
            recs.append("Excelente: Mantén las buenas prácticas actuales.")
    except Exception as e:
        print(f"[Ontology] Error leyendo la ontología: {e}")
    return recs

async def run_audit(url: str, request: Request) -> dict:
    """
    Ejecuta una auditoría sincrónica usando Lógica Difusa y Ontología OWL.
    """
    # 1. Analizar sitio real con BeautifulSoup
    from app.features.audit_report.analyzer import analyze_url
    analysis_data = analyze_url(url)
    scores = analysis_data["scores"]
    issues = analysis_data["issues"]

    # 2. Aplicar Lógica Difusa
    fuzzy_score, fuzzy_label = fuzzy_evaluate(
        acc=scores["accessibility"],
        perf=scores["performance"],
        seo=scores["seo"]
    )
    
    # Mapeo a estados ontológicos
    if fuzzy_score < 40:
        status = "Critical"
    elif fuzzy_score < 75:
        status = "Acceptable"
    else:
        status = "Excellent"

    # 3. Leer Ontología (Recomendación general)
    recs = extract_recommendations(status)
    
    # Armar la lista de recomendaciones JSON-LD combinando las issues y la ontología
    recommendations_list = [
        {
            "@type": "onto:Recommendation",
            "onto:hasStatus": {"@id": f"onto:{status}"},
            "onto:suggestsAction": {"@id": "onto:BestPractices"},
            "schema:description": rec
        } for rec in recs
    ]
    
    # Agregar las issues específicas encontradas
    for issue in issues:
        recommendations_list.append({
            "@type": "onto:Recommendation",
            "onto:hasStatus": {"@id": issue["status"]},
            "onto:suggestsAction": {"@id": issue["category"]},
            "schema:description": issue["description"]
        })

    # 4. Construir reporte JSON-LD
    report = {
        "@context": {
            "schema": "https://schema.org/",
            "onto": "http://www.semanticweb.org/jorge/ontologies/2026/5/untitled-ontology-4#"
        },
        "@type": "schema:Dataset",
        "schema:name": "Auditoría SEM-Web-Advisor",
        "schema:dateCreated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "schema:url": url,
        "onto:fuzzyVerdict": {
            "schema:value": round(fuzzy_score, 1),
            "schema:description": status,
            "onto:accessibilityScore": round(scores.get("accessibility", 0), 1),
            "onto:performanceScore": round(scores.get("performance", 0), 1),
            "onto:seoScore": round(scores.get("seo", 0), 1)
        },
        "onto:Recommendation": recommendations_list
    }

    # 5. Guardar en MongoDB
    settings = get_settings()
    db = get_database()
    collection = db[settings.COLLECTION_NAME]
    
    try:
        await collection.insert_one(report.copy())
        print(f"[Service] Reporte guardado en MongoDB.")
    except Exception as e:
        print(f"[Service] Error guardando en MongoDB: {e}")

    # Remover _id para retornarlo vía API sin error de serialización
    if "_id" in report:
        del report["_id"]

    return report


async def get_latest_report() -> dict | None:
    """
    Recupera el reporte de auditoría más reciente de MongoDB.
    Ordena por 'schema:dateCreated' descendente y retorna el primero.
    Elimina el campo '_id' de MongoDB antes de retornar.

    Returns:
        dict | None: El reporte JSON-LD más reciente, o None si no existe.
    """
    settings = get_settings()
    db = get_database()
    collection = db[settings.COLLECTION_NAME]

    # Buscar el reporte más reciente ordenando por fecha de creación descendente
    report = await collection.find_one(
        {},  # Sin filtro — todos los documentos
        {"_id": 0},  # Excluir el ObjectId de MongoDB
        sort=[("schema:dateCreated", -1)]  # Más reciente primero
    )

    return report


async def get_all_reports(limit: int = 10) -> list[dict]:
    """
    Recupera los últimos N reportes de auditoría.

    Args:
        limit: Número máximo de reportes a retornar (default: 10).

    Returns:
        list[dict]: Lista de reportes JSON-LD.
    """
    settings = get_settings()
    db = get_database()
    collection = db[settings.COLLECTION_NAME]

    cursor = collection.find(
        {},
        {"_id": 0}
    ).sort("schema:dateCreated", -1).limit(limit)

    return await cursor.to_list(length=limit)
