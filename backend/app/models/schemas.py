"""
schemas.py — Modelos de Pydantic para validación de datos.

Define los esquemas de entrada (requests) y salida (responses)
para los endpoints de diagnóstico por lógica difusa.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


# ═══════════════════════════════════════════════════════════
# LISTA CANÓNICA DE SÍNTOMAS (15 en total)
# ═══════════════════════════════════════════════════════════
SYMPTOM_NAMES: List[str] = [
    "Fiebre",
    "Tos_Seca",
    "Tos_Productiva",
    "Rinorrea",
    "Estornudos",
    "Dolor_Garganta",
    "Disnea",
    "Sibilancias",
    "Dolor_Pecho",
    "Fatiga",
    "Cianosis",
    "Expectoracion_Purulenta",
    "Perdida_Olfato",
    "Congestion_Nasal",
    "Crepitantes_Pulmonares",
]


# ═══════════════════════════════════════════════════════════
# ESQUEMA DE ENTRADA: VECTOR DE SÍNTOMAS
# ═══════════════════════════════════════════════════════════
class SintomasInput(BaseModel):
    """
    Vector de 15 síntomas del paciente.
    Cada valor es un float en el rango [0.0, 1.0] que representa
    el grado de pertenencia difusa del síntoma reportado.
    """

    fiebre: float = Field(
        ..., ge=0.0, le=1.0,
        description="Grado de fiebre (0 = sin fiebre, 1 = fiebre muy alta)",
        json_schema_extra={"examples": [0.7]},
    )
    tos_seca: float = Field(
        ..., ge=0.0, le=1.0,
        description="Intensidad de la tos seca",
        json_schema_extra={"examples": [0.5]},
    )
    tos_productiva: float = Field(
        ..., ge=0.0, le=1.0,
        description="Intensidad de la tos productiva (con flema)",
        json_schema_extra={"examples": [0.2]},
    )
    rinorrea: float = Field(
        ..., ge=0.0, le=1.0,
        description="Grado de secreción nasal (rinorrea)",
        json_schema_extra={"examples": [0.6]},
    )
    estornudos: float = Field(
        ..., ge=0.0, le=1.0,
        description="Frecuencia de estornudos",
        json_schema_extra={"examples": [0.4]},
    )
    dolor_garganta: float = Field(
        ..., ge=0.0, le=1.0,
        description="Intensidad del dolor de garganta",
        json_schema_extra={"examples": [0.3]},
    )
    disnea: float = Field(
        ..., ge=0.0, le=1.0,
        description="Dificultad para respirar (disnea)",
        json_schema_extra={"examples": [0.1]},
    )
    sibilancias: float = Field(
        ..., ge=0.0, le=1.0,
        description="Presencia de sibilancias al respirar",
        json_schema_extra={"examples": [0.0]},
    )
    dolor_pecho: float = Field(
        ..., ge=0.0, le=1.0,
        description="Intensidad del dolor torácico",
        json_schema_extra={"examples": [0.2]},
    )
    fatiga: float = Field(
        ..., ge=0.0, le=1.0,
        description="Nivel de fatiga general",
        json_schema_extra={"examples": [0.8]},
    )
    cianosis: float = Field(
        ..., ge=0.0, le=1.0,
        description="Presencia de cianosis (coloración azulada)",
        json_schema_extra={"examples": [0.0]},
    )
    expectoracion_purulenta: float = Field(
        ..., ge=0.0, le=1.0,
        description="Presencia de expectoración purulenta",
        json_schema_extra={"examples": [0.1]},
    )
    perdida_olfato: float = Field(
        ..., ge=0.0, le=1.0,
        description="Grado de pérdida de olfato / gusto",
        json_schema_extra={"examples": [0.3]},
    )
    congestion_nasal: float = Field(
        ..., ge=0.0, le=1.0,
        description="Intensidad de la congestión nasal",
        json_schema_extra={"examples": [0.5]},
    )
    crepitantes_pulmonares: float = Field(
        ..., ge=0.0, le=1.0,
        description="Presencia de crepitantes a la auscultación",
        json_schema_extra={"examples": [0.0]},
    )

    def to_vector(self) -> List[float]:
        """Convierte el modelo a una lista ordenada de 15 valores."""
        return [
            self.fiebre,
            self.tos_seca,
            self.tos_productiva,
            self.rinorrea,
            self.estornudos,
            self.dolor_garganta,
            self.disnea,
            self.sibilancias,
            self.dolor_pecho,
            self.fatiga,
            self.cianosis,
            self.expectoracion_purulenta,
            self.perdida_olfato,
            self.congestion_nasal,
            self.crepitantes_pulmonares,
        ]


# ═══════════════════════════════════════════════════════════
# ESQUEMA DE ENTRADA: DIAGNÓSTICO GENERAL
# ═══════════════════════════════════════════════════════════
class DiagnosticoGeneralRequest(BaseModel):
    """Petición para el endpoint POST /api/diagnostico/general."""

    nombre_paciente: Optional[str] = Field(
        None,
        min_length=1,
        max_length=120,
        description="Nombre del paciente (opcional)",
        json_schema_extra={"examples": ["Juan Pérez"]},
    )
    sintomas: SintomasInput = Field(
        ...,
        description="Vector de 15 síntomas con valores difusos [0.0, 1.0]",
    )


# ═══════════════════════════════════════════════════════════
# ESQUEMA DE ENTRADA: DIAGNÓSTICO ESPECÍFICO
# ═══════════════════════════════════════════════════════════
class DiagnosticoEspecificoRequest(BaseModel):
    """Petición para el endpoint POST /api/diagnostico/especifico."""

    nombre_paciente: Optional[str] = Field(
        None,
        min_length=1,
        max_length=120,
        description="Nombre del paciente (opcional)",
        json_schema_extra={"examples": ["María López"]},
    )
    sintomas: SintomasInput = Field(
        ...,
        description="Vector de 15 síntomas con valores difusos [0.0, 1.0]",
    )
    enfermedades: List[str] = Field(
        ...,
        min_length=1,
        description="Lista de nombres de enfermedades a evaluar",
        json_schema_extra={
            "examples": [["Influenza", "COVID-19", "Neumonía_Bacteriana"]]
        },
    )


# ═══════════════════════════════════════════════════════════
# ESQUEMAS DE SALIDA (RESPONSES)
# ═══════════════════════════════════════════════════════════
class DetalleInterseccion(BaseModel):
    """Detalle de la intersección síntoma a síntoma."""

    sintoma: str = Field(..., description="Nombre del síntoma")
    valor_usuario: float = Field(..., description="Valor ingresado por el usuario")
    valor_base: float = Field(..., description="Valor de la base de conocimiento")
    interseccion: float = Field(
        ..., description="min(valor_usuario, valor_base)"
    )


class ResultadoEnfermedad(BaseModel):
    """Resultado de la evaluación difusa para una enfermedad."""

    nombre: str = Field(..., description="Nombre de la enfermedad")
    origen: str = Field(..., description="Origen / etiología de la enfermedad")
    tratamiento: str = Field(..., description="Tratamiento recomendado")
    grado_coincidencia: float = Field(
        ...,
        description="Suma de las intersecciones (Grado de Coincidencia)",
    )
    porcentaje: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Grado de coincidencia normalizado como porcentaje (0–100%)",
    )
    detalle: List[DetalleInterseccion] = Field(
        ...,
        description="Detalle de la intersección por cada síntoma",
    )


class DiagnosticoResponse(BaseModel):
    """Respuesta del endpoint de diagnóstico."""

    confiable: bool = Field(
        ...,
        description="Indica si al menos un resultado supera el umbral de confiabilidad",
    )
    umbral: float = Field(
        ..., description="Valor del umbral de confiabilidad utilizado"
    )
    mensaje: str = Field(
        ..., description="Mensaje descriptivo del resultado"
    )
    nombre_paciente: Optional[str] = Field(
        None, description="Nombre del paciente evaluado"
    )
    resultados: List[ResultadoEnfermedad] = Field(
        ...,
        description="Lista de enfermedades evaluadas, ordenadas de mayor a menor coincidencia",
    )
