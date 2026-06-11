"""
service.py — Lógica de negocio para los reportes de auditoría.
Interactúa con MongoDB para recuperar y procesar reportes JSON-LD.
"""

from app.database import get_database
from app.config import get_settings
from app.features.audit_report.analyzer import analyze_url
from app.features.audit_report.fuzzy_engine import fuzzy_evaluate
from app.features.audit_report.report_builder import build_json_ld_report


async def run_audit(url: str) -> dict:
    """
    Ejecuta una auditoría completa de la URL.
    1. Analiza accesibilidad, SEO, rendimiento.
    2. Aplica lógica difusa.
    3. Construye JSON-LD.
    4. Guarda en MongoDB.
    """
    # 1. Analizar sitio
    analysis = analyze_url(url)
    scores = analysis["scores"]
    issues = analysis["issues"]

    # 2. Lógica difusa
    fuzzy_score, fuzzy_label = fuzzy_evaluate(
        acc=scores["accessibility"],
        perf=scores["performance"],
        seo=scores["seo"]
    )

    # 3. Construir reporte JSON-LD
    report = build_json_ld_report(url, fuzzy_score, fuzzy_label, scores, issues)

    # 4. Guardar en MongoDB
    settings = get_settings()
    db = get_database()
    collection = db[settings.COLLECTION_NAME]
    
    await collection.insert_one(report.copy()) # copy to avoid modifying original with _id
    
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
