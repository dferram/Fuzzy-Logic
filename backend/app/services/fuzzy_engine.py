"""
fuzzy_engine.py — Motor de Inferencia por Lógica Difusa.

Implementa la intersección de conjuntos difusos usando la
norma T del mínimo para calcular el grado de coincidencia
entre los síntomas del paciente y cada enfermedad registrada.
"""

from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.schemas import (
    SYMPTOM_NAMES,
    ResultadoEnfermedad,
    DetalleInterseccion,
    DiagnosticoResponse,
)
from app.config import settings


async def _obtener_enfermedades(
    db: AsyncIOMotorDatabase,
    nombres: Optional[List[str]] = None,
) -> list[dict]:
    """
    Recupera las enfermedades de la base de datos.

    Args:
        db: Instancia de la base de datos.
        nombres: Si se proporciona, filtra solo por esos nombres.

    Returns:
        Lista de documentos de enfermedades.
    """
    collection = db["enfermedades"]

    if nombres:
        cursor = collection.find({"nombre": {"$in": nombres}})
    else:
        cursor = collection.find({})

    return await cursor.to_list(length=None)


def _calcular_interseccion(
    vector_usuario: List[float],
    enfermedad: dict,
) -> ResultadoEnfermedad:
    """
    Calcula la intersección de conjuntos difusos entre el vector
    del paciente y una enfermedad.

    Algoritmo:
        Para cada síntoma i:
            intersección_i = min(usuario_i, base_i)
        Grado de coincidencia = Σ intersección_i

    Args:
        vector_usuario: Lista de 15 floats [0.0, 1.0] del paciente.
        enfermedad: Documento de la enfermedad desde MongoDB.

    Returns:
        ResultadoEnfermedad con el grado de coincidencia y el detalle.
    """
    sintomas_base = enfermedad.get("sintomas", {})
    detalles: List[DetalleInterseccion] = []
    suma_intersecciones = 0.0

    for i, nombre_sintoma in enumerate(SYMPTOM_NAMES):
        valor_usuario = vector_usuario[i]
        valor_base = sintomas_base.get(nombre_sintoma, 0.0)

        # Norma T del mínimo
        interseccion = min(valor_usuario, valor_base)
        suma_intersecciones += interseccion

        detalles.append(
            DetalleInterseccion(
                sintoma=nombre_sintoma,
                valor_usuario=round(valor_usuario, 4),
                valor_base=round(valor_base, 4),
                interseccion=round(interseccion, 4),
            )
        )

    # Calcular porcentaje normalizado (máximo teórico = 15.0)
    max_posible = float(len(SYMPTOM_NAMES))  # 15.0
    porcentaje = round((suma_intersecciones / max_posible) * 100, 2)

    return ResultadoEnfermedad(
        nombre=enfermedad.get("nombre", "Desconocida"),
        origen=enfermedad.get("origen", "No especificado"),
        tratamiento=enfermedad.get("tratamiento", "No especificado"),
        grado_coincidencia=round(suma_intersecciones, 4),
        porcentaje=porcentaje,
        detalle=detalles,
    )


async def diagnostico_general(
    db: AsyncIOMotorDatabase,
    vector_usuario: List[float],
    nombre_paciente: Optional[str] = None,
) -> DiagnosticoResponse:
    """
    Evalúa TODAS las enfermedades contra el vector de síntomas.

    Args:
        db: Instancia de la base de datos.
        vector_usuario: Vector de 15 síntomas del paciente.
        nombre_paciente: Nombre del paciente (opcional).

    Returns:
        DiagnosticoResponse con resultados ordenados de mayor a menor.
    """
    enfermedades = await _obtener_enfermedades(db)

    if not enfermedades:
        return DiagnosticoResponse(
            confiable=False,
            umbral=settings.FUZZY_THRESHOLD,
            mensaje="No se encontraron enfermedades en la base de datos.",
            nombre_paciente=nombre_paciente,
            resultados=[],
        )

    resultados: List[ResultadoEnfermedad] = []
    for enfermedad in enfermedades:
        resultado = _calcular_interseccion(vector_usuario, enfermedad)
        resultados.append(resultado)

    # Ordenar de mayor a menor grado de coincidencia
    resultados.sort(key=lambda r: r.grado_coincidencia, reverse=True)

    # Verificar umbral de confiabilidad
    hay_confiable = any(
        r.grado_coincidencia >= settings.FUZZY_THRESHOLD for r in resultados
    )

    if hay_confiable:
        mensaje = (
            f"Se encontraron coincidencias confiables (umbral ≥ {settings.FUZZY_THRESHOLD}). "
            f"Se evaluaron {len(resultados)} enfermedades."
        )
    else:
        mensaje = (
            f"El grado de coincidencia no es confiable. "
            f"Ninguna enfermedad superó el umbral de {settings.FUZZY_THRESHOLD}. "
            f"Se recomienda consultar a un profesional de la salud para un "
            f"diagnóstico preciso."
        )

    return DiagnosticoResponse(
        confiable=hay_confiable,
        umbral=settings.FUZZY_THRESHOLD,
        mensaje=mensaje,
        nombre_paciente=nombre_paciente,
        resultados=resultados,
    )


async def diagnostico_especifico(
    db: AsyncIOMotorDatabase,
    vector_usuario: List[float],
    nombres_enfermedades: List[str],
    nombre_paciente: Optional[str] = None,
) -> DiagnosticoResponse:
    """
    Evalúa SOLO las enfermedades solicitadas contra el vector de síntomas.

    Args:
        db: Instancia de la base de datos.
        vector_usuario: Vector de 15 síntomas del paciente.
        nombres_enfermedades: Lista de nombres de enfermedades a evaluar.
        nombre_paciente: Nombre del paciente (opcional).

    Returns:
        DiagnosticoResponse con resultados ordenados de mayor a menor.
    """
    enfermedades = await _obtener_enfermedades(db, nombres=nombres_enfermedades)

    if not enfermedades:
        nombres_str = ", ".join(nombres_enfermedades)
        return DiagnosticoResponse(
            confiable=False,
            umbral=settings.FUZZY_THRESHOLD,
            mensaje=(
                f"No se encontraron las enfermedades solicitadas en la base de datos: "
                f"{nombres_str}. Verifique los nombres ingresados."
            ),
            nombre_paciente=nombre_paciente,
            resultados=[],
        )

    # Verificar si alguna enfermedad solicitada no fue encontrada
    nombres_encontrados = {e["nombre"] for e in enfermedades}
    no_encontradas = [n for n in nombres_enfermedades if n not in nombres_encontrados]

    resultados: List[ResultadoEnfermedad] = []
    for enfermedad in enfermedades:
        resultado = _calcular_interseccion(vector_usuario, enfermedad)
        resultados.append(resultado)

    # Ordenar de mayor a menor grado de coincidencia
    resultados.sort(key=lambda r: r.grado_coincidencia, reverse=True)

    # Verificar umbral de confiabilidad
    hay_confiable = any(
        r.grado_coincidencia >= settings.FUZZY_THRESHOLD for r in resultados
    )

    if hay_confiable:
        mensaje = (
            f"Se encontraron coincidencias confiables (umbral ≥ {settings.FUZZY_THRESHOLD}). "
            f"Se evaluaron {len(resultados)} de {len(nombres_enfermedades)} "
            f"enfermedades solicitadas."
        )
    else:
        mensaje = (
            f"El grado de coincidencia no es confiable. "
            f"Ninguna de las enfermedades seleccionadas superó el umbral de "
            f"{settings.FUZZY_THRESHOLD}. "
            f"Se recomienda consultar a un profesional de la salud."
        )

    if no_encontradas:
        mensaje += (
            f" NOTA: Las siguientes enfermedades no se encontraron en la base "
            f"de datos: {', '.join(no_encontradas)}."
        )

    return DiagnosticoResponse(
        confiable=hay_confiable,
        umbral=settings.FUZZY_THRESHOLD,
        mensaje=mensaje,
        nombre_paciente=nombre_paciente,
        resultados=resultados,
    )
