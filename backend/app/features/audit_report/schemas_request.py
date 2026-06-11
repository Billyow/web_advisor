from pydantic import BaseModel, HttpUrl

class AuditRequest(BaseModel):
    """Modelo para solicitar una nueva auditoría."""
    url: str
