# SEM-Web-Advisor

**Sistema Inteligente de Mantenimiento Web Semántico**

Proyecto universitario que integra agentes inteligentes (SPADE), lógica difusa (scikit-fuzzy) y Web Semántica (JSON-LD / OWL) para auditar y recomendar mejoras en sitios web.

## Estructura del Proyecto

```
web-advisor/
├── backend/          # API FastAPI + Agentes SPADE
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── ontology/
│   │   │   └── web_maintenance.owl
│   │   └── features/
│   │       ├── agents/
│   │       └── audit_report/
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/         # React + Vite + Tailwind CSS v4
    └── src/
        ├── features/dashboard/
        └── shared/
```

## Inicio Rápido

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env       # Editar con tus credenciales de MongoDB Atlas
uvicorn app.main:app --reload
```

La API estará disponible en `http://localhost:8000`.
Documentación interactiva en `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Python, FastAPI, Motor (MongoDB async) |
| Agentes | SPADE (Multi-Agent Systems) |
| Lógica Difusa | scikit-fuzzy |
| Ontología | OWL (Protégé), JSON-LD |
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Base de Datos | MongoDB Atlas |
