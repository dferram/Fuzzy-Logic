"""
diagnostico.py — Endpoints REST para el diagnóstico por lógica difusa.

Provee los dos endpoints principales:
    - POST /api/diagnostico/general
    - POST /api/diagnostico/especifico

Y endpoints auxiliares:
    - GET  /api/diagnostico/enfermedades  (catálogo)
    - GET  /api/diagnostico/sintomas      (lista de síntomas)
"""

from fastapi import APIRouter, HTTPException, status

from app.db.connection import get_database
from app.models.schemas import (
    DiagnosticoGeneralRequest,
    DiagnosticoEspecificoRequest,
    DiagnosticoResponse,
    SYMPTOM_NAMES,
)
from app.services.fuzzy_engine import (
    diagnostico_general,
    diagnostico_especifico,
)

router = APIRouter(
    prefix="/api/diagnostico",
    tags=["Diagnóstico"],
    responses={
        500: {"description": "Error interno del servidor"},
    },
)


# ═══════════════════════════════════════════════════════════
# POST /api/diagnostico/general
# ═══════════════════════════════════════════════════════════
@router.post(
    "/general",
    response_model=DiagnosticoResponse,
    summary="Diagnóstico General",
    description=(
        "Recibe el vector de 15 síntomas del paciente y evalúa "
        "**todas** las enfermedades registradas en la base de datos. "
        "Devuelve las enfermedades ordenadas por grado de coincidencia "
        "de mayor a menor, aplicando la norma T del mínimo."
    ),
    status_code=status.HTTP_200_OK,
)
async def endpoint_diagnostico_general(
    request: DiagnosticoGeneralRequest,
) -> DiagnosticoResponse:
    """
    Evalúa el vector de síntomas contra TODAS las enfermedades.
    """
    try:
        db = get_database()
        vector = request.sintomas.to_vector()

        response = await diagnostico_general(
            db=db,
            vector_usuario=vector,
            nombre_paciente=request.nombre_paciente,
        )
        return response

    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error de conexión a la base de datos: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno al procesar el diagnóstico: {str(e)}",
        )


# ═══════════════════════════════════════════════════════════
# POST /api/diagnostico/especifico
# ═══════════════════════════════════════════════════════════
@router.post(
    "/especifico",
    response_model=DiagnosticoResponse,
    summary="Diagnóstico Específico",
    description=(
        "Recibe el vector de 15 síntomas del paciente y una lista "
        "de enfermedades específicas a evaluar. Devuelve los resultados "
        "ordenados por grado de coincidencia de mayor a menor."
    ),
    status_code=status.HTTP_200_OK,
)
async def endpoint_diagnostico_especifico(
    request: DiagnosticoEspecificoRequest,
) -> DiagnosticoResponse:
    """
    Evalúa el vector de síntomas contra las enfermedades seleccionadas.
    """
    try:
        db = get_database()
        vector = request.sintomas.to_vector()

        response = await diagnostico_especifico(
            db=db,
            vector_usuario=vector,
            nombres_enfermedades=request.enfermedades,
            nombre_paciente=request.nombre_paciente,
        )
        return response

    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error de conexión a la base de datos: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno al procesar el diagnóstico: {str(e)}",
        )


# ═══════════════════════════════════════════════════════════
# GET /api/diagnostico/enfermedades  (Catálogo)
# ═══════════════════════════════════════════════════════════
@router.get(
    "/enfermedades",
    summary="Listar Enfermedades",
    description=(
        "Devuelve el catálogo de todas las enfermedades registradas "
        "en la base de datos con sus nombres, origen y tratamiento."
    ),
    status_code=status.HTTP_200_OK,
)
async def listar_enfermedades():
    """
    Retorna la lista de enfermedades disponibles para consulta.
    Útil para poblar el selector del frontend.
    """
    try:
        db = get_database()
        collection = db["enfermedades"]
        cursor = collection.find(
            {},
            {"_id": 0, "nombre": 1, "origen": 1, "tratamiento": 1},
        )
        enfermedades = await cursor.to_list(length=None)
        return {
            "total": len(enfermedades),
            "enfermedades": enfermedades,
        }

    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error de conexión a la base de datos: {str(e)}",
        )


# ═══════════════════════════════════════════════════════════
# GET /api/diagnostico/sintomas  (Lista de síntomas)
# ═══════════════════════════════════════════════════════════
@router.get(
    "/sintomas",
    summary="Listar Síntomas",
    description="Devuelve la lista canónica de los 15 síntomas evaluados.",
    status_code=status.HTTP_200_OK,
)
async def listar_sintomas():
    """
    Retorna la lista de los 15 síntomas que el sistema evalúa.
    Útil para que el frontend construya dinámicamente el formulario.
    """
    return {
        "total": len(SYMPTOM_NAMES),
        "sintomas": SYMPTOM_NAMES,
    }
