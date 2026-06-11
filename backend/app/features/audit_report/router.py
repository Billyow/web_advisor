"""
router.py — Endpoints REST para los reportes de auditoría.
Expone la API que consume el frontend React.
"""

from fastapi import APIRouter, HTTPException, Request, status
from app.features.audit_report.service import get_latest_report, get_all_reports, run_audit
from app.features.audit_report.schemas_request import AuditRequest

router = APIRouter(
    prefix="/audit-reports",
    tags=["Audit Reports"],
    responses={404: {"description": "Reporte no encontrado"}},
)

@router.post(
    "/audit",
    summary="Ejecutar una nueva auditoría web",
    description="Analiza la URL usando Lógica Difusa y extrae recomendaciones de la Ontología OWL.",
    response_description="Reporte final JSON-LD",
    status_code=status.HTTP_200_OK
)
async def create_audit(audit_request: AuditRequest, request: Request):
    """
    Inicia el proceso de auditoría web para una URL de forma sincrónica.
    """
    try:
        response = await run_audit(audit_request.url, request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error durante el análisis semántico: {str(e)}"
        )


@router.get(
    "/latest",
    summary="Obtener el último reporte de auditoría",
    description="Recupera el reporte de auditoría más reciente en formato JSON-LD.",
    response_description="Reporte de auditoría en formato JSON-LD",
)
async def read_latest_report():
    """
    Retorna el último reporte de auditoría almacenado en MongoDB.
    El reporte incluye el veredicto difuso y las recomendaciones semánticas.
    """
    report = await get_latest_report()

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron reportes de auditoría. "
                   "Ejecuta primero el sistema multiagente para generar un reporte."
        )

    return report


@router.get(
    "/",
    summary="Listar reportes de auditoría",
    description="Recupera los últimos N reportes de auditoría.",
)
async def read_all_reports(limit: int = 10):
    """
    Retorna una lista con los últimos reportes de auditoría.

    Args:
        limit: Número máximo de reportes a retornar (query param, default: 10).
    """
    reports = await get_all_reports(limit=limit)
    return {"reports": reports, "total": len(reports)}
