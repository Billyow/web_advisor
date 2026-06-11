"""
main.py — Punto de entrada de la API FastAPI para SEM-Web-Advisor.
Configura CORS, ciclo de vida de la base de datos y monta los routers.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import connect_to_mongo, close_mongo_connection
from app.features.audit_report.router import router as audit_router

# --- Ciclo de vida de la aplicación ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Conecta a MongoDB al iniciar y cierra la conexión al apagar."""
    await connect_to_mongo()
    yield
    await close_mongo_connection()

# --- Instancia de FastAPI ---
settings = get_settings()

app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description=(
        "API del Sistema Inteligente de Mantenimiento Web Semántico. "
        "Expone reportes de auditoría generados por agentes SPADE "
        "con lógica difusa (scikit-fuzzy) en formato JSON-LD."
    ),
    lifespan=lifespan,
)


# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Montar routers ---
app.include_router(audit_router, prefix="/api")


# --- Health check ---
@app.get("/", tags=["Health"])
async def health_check():
    """Endpoint de verificación de estado de la API."""
    return {
        "status": "ok",
        "service": settings.APP_TITLE,
        "version": settings.APP_VERSION,
    }
