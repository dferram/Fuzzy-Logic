"""
main.py — Punto de entrada de la aplicación FastAPI.

Configura:
    - Middleware CORS para el frontend.
    - Eventos del ciclo de vida (startup/shutdown) para MongoDB.
    - Seed de datos desde CSV al iniciar.
    - Registro de routers.
"""

import sys
import os

# ═══════════════════════════════════════════════════════════
# CORRECCIÓN DE RUTAS PARA VERCEL / entornos de deploy
# Añadimos la carpeta 'backend' al sys.path para que los imports
# locales (from app.*) funcionen sin importar desde dónde se llame.
# ═══════════════════════════════════════════════════════════
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db.connection import get_or_create_connection, close_mongo_connection
from app.db.seed import seed_enfermedades
from app.routers import diagnostico


# ═══════════════════════════════════════════════════════════
# CICLO DE VIDA DE LA APLICACIÓN
# Usamos lifespan pero con manejo de errores para que no
# bloquee el startup en entornos serverless (Vercel).
# ═══════════════════════════════════════════════════════════
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── STARTUP ──────────────────────────────────────────
    try:
        db = await get_or_create_connection()
        await seed_enfermedades(db)
        print("[APP] FuzzyDx Backend iniciado correctamente.")
        print(f"   > Entorno:   {settings.APP_ENV}")
        print(f"   > MongoDB:   {settings.MONGODB_DB_NAME}")
        print(f"   > Umbral:    {settings.FUZZY_THRESHOLD}")
        print(f"   > CORS:      {settings.cors_origins_list}")
    except Exception as e:
        print(f"[APP] Advertencia en startup: {e}")
        print("[APP] El backend iniciará de todas formas (lazy connection).")

    yield

    # ── SHUTDOWN ─────────────────────────────────────────
    await close_mongo_connection()
    print("[APP] FuzzyDx Backend detenido.")


# ═══════════════════════════════════════════════════════════
# INSTANCIA DE LA APLICACIÓN
# ═══════════════════════════════════════════════════════════
app = FastAPI(
    title="FuzzyDx API",
    description=(
        "API REST para el Sistema de Diagnóstico de Enfermedades "
        "Respiratorias basado en Lógica Difusa.\n\n"
        "Utiliza la **intersección de conjuntos difusos** (norma T del mínimo) "
        "para evaluar el grado de coincidencia entre los síntomas del paciente "
        "y los patrones clínicos de 10 enfermedades respiratorias.\n\n"
        "**Disclaimer:** Este sistema es un proyecto académico y no sustituye "
        "la opinión de un profesional de la salud."
    ),
    version="1.0.0",
    contact={
        "name": "Fernando Ramírez",
        "url": "https://github.com/dferram",
    },
    license_info={
        "name": "MIT",
    },
    lifespan=lifespan,
    # En Vercel, la app se sirve como ASGI directamente
    docs_url="/docs",
    redoc_url="/redoc",
)


# ═══════════════════════════════════════════════════════════
# MIDDLEWARE CORS
# ═══════════════════════════════════════════════════════════
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════
# REGISTRO DE ROUTERS
# ═══════════════════════════════════════════════════════════
app.include_router(diagnostico.router)


from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

@app.get("/", tags=["Root"])
async def read_root():
    """Endpoint raíz para evitar 404."""
    return {
        "message": "FuzzyDx API está funcionando correctamente.",
        "docs": "/docs",
        "health": "/api/health"
    }

# ═══════════════════════════════════════════════════════════
# ENDPOINT HEALTH (Health Check)
# ═══════════════════════════════════════════════════════════
@app.get("/api/health", tags=["Health"], summary="Health Check")
async def health_api():
    """Endpoint de verificación de estado."""
    return {
        "status": "ok",
        "service": "FuzzyDx API",
        "version": "1.0.0"
    }

# ═══════════════════════════════════════════════════════════
# SERVIR FRONTEND DE REACT
# ═══════════════════════════════════════════════════════════
frontend_dist = os.path.join(os.path.dirname(__file__), "../../frontend/dist")

# Solo montamos los estáticos si la carpeta dist existe (es decir, en producción)
if os.path.isdir(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    # Cualquier ruta que no empiece con /api se redirige a index.html (para React Router)
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        index_path = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend no encontrado en el servidor."}


@app.get(
    "/health",
    tags=["Health"],
    summary="Health Check detallado",
)
async def health_check():
    """Verifica la salud del servidor y la conexión a la base de datos."""
    try:
        db = await get_or_create_connection()
        count = await db["enfermedades"].count_documents({})
        db_status = "connected"
    except Exception as e:
        count = 0
        db_status = f"error: {str(e)}"

    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "database": {
            "status": db_status,
            "enfermedades_registradas": count,
        },
        "config": {
            "umbral_confiabilidad": settings.FUZZY_THRESHOLD,
            "entorno": settings.APP_ENV,
        },
    }
