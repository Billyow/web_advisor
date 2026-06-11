"""
schemas.py — Modelos Pydantic para la respuesta del AuditReport.
Refleja la estructura JSON-LD real almacenada en MongoDB.
"""

from pydantic import BaseModel, Field
from typing import Optional


class FuzzyVerdict(BaseModel):
    """Resultado del sistema de lógica difusa (scikit-fuzzy)."""
    value: float = Field(..., description="Puntuación numérica del veredicto (0-100)")
    description: str = Field(..., description="Etiqueta del veredicto: Urgente, Aceptable, etc.")


class RecommendationStatus(BaseModel):
    """Estado de la recomendación según la ontología."""
    id: str = Field(..., alias="@id", description="IRI del estado: onto:Critical, onto:Acceptable, etc.")


class RecommendationAction(BaseModel):
    """Acción sugerida según la ontología."""
    id: str = Field(..., alias="@id", description="IRI de la acción: onto:Accessibility, onto:SEO, etc.")


class Recommendation(BaseModel):
    """Recomendación individual generada por el agente experto."""
    type: Optional[str] = Field(None, alias="@type")
    has_status: RecommendationStatus = Field(..., alias="onto:hasStatus")
    suggests_action: RecommendationAction = Field(..., alias="onto:suggestsAction")
    description: str = Field(..., alias="schema:description")

    class Config:
        populate_by_name = True


class JsonLdContext(BaseModel):
    """Contexto JSON-LD del documento."""
    schema_: str = Field(..., alias="schema")
    onto: str


class AuditReportResponse(BaseModel):
    """
    Modelo completo del reporte de auditoría en formato JSON-LD.
    Coincide con la estructura almacenada en MongoDB.
    """
    context: JsonLdContext = Field(..., alias="@context")
    type: str = Field(..., alias="@type")
    name: str = Field(..., alias="schema:name")
    date_created: str = Field(..., alias="schema:dateCreated")
    url: str = Field(..., alias="schema:url")
    fuzzy_verdict: FuzzyVerdict = Field(..., alias="onto:fuzzyVerdict")
    recommendations: list[Recommendation] = Field(
        default_factory=list,
        alias="onto:Recommendation"
    )

    class Config:
        populate_by_name = True
