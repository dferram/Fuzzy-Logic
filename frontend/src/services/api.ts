/**
 * api.ts — Servicio de comunicación con el backend FastAPI.
 *
 * Centraliza todas las llamadas HTTP hacia /api/diagnostico/*.
 */

const BASE_URL = '/api/diagnostico'

// ═══════════════════════════════════════════════════════════
// TIPOS (espejan los schemas de Pydantic del backend)
// ═══════════════════════════════════════════════════════════

export interface SintomasInput {
  fiebre: number
  tos_seca: number
  tos_productiva: number
  rinorrea: number
  estornudos: number
  dolor_garganta: number
  disnea: number
  sibilancias: number
  dolor_pecho: number
  fatiga: number
  cianosis: number
  expectoracion_purulenta: number
  perdida_olfato: number
  congestion_nasal: number
  crepitantes_pulmonares: number
}

export interface DetalleInterseccion {
  sintoma: string
  valor_usuario: number
  valor_base: number
  interseccion: number
}

export interface ResultadoEnfermedad {
  nombre: string
  origen: string
  tratamiento: string
  grado_coincidencia: number
  porcentaje: number
  detalle: DetalleInterseccion[]
}

export interface DiagnosticoResponse {
  confiable: boolean
  umbral: number
  mensaje: string
  nombre_paciente: string | null
  resultados: ResultadoEnfermedad[]
}

export interface EnfermedadCatalogo {
  nombre: string
  origen: string
  tratamiento: string
}

export interface ListaEnfermedadesResponse {
  total: number
  enfermedades: EnfermedadCatalogo[]
}

// ═══════════════════════════════════════════════════════════
// FUNCIONES DE API
// ═══════════════════════════════════════════════════════════

/**
 * POST /api/diagnostico/general
 * Evalúa los síntomas contra TODAS las enfermedades.
 */
export async function diagnosticoGeneral(
  sintomas: SintomasInput,
  nombrePaciente?: string,
): Promise<DiagnosticoResponse> {
  const response = await fetch(`${BASE_URL}/general`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre_paciente: nombrePaciente || null,
      sintomas,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `Error ${response.status}`)
  }

  return response.json()
}

/**
 * POST /api/diagnostico/especifico
 * Evalúa los síntomas contra las enfermedades seleccionadas.
 */
export async function diagnosticoEspecifico(
  sintomas: SintomasInput,
  enfermedades: string[],
  nombrePaciente?: string,
): Promise<DiagnosticoResponse> {
  const response = await fetch(`${BASE_URL}/especifico`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre_paciente: nombrePaciente || null,
      sintomas,
      enfermedades,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `Error ${response.status}`)
  }

  return response.json()
}

/**
 * GET /api/diagnostico/enfermedades
 * Obtiene el catálogo completo de enfermedades.
 */
export async function listarEnfermedades(): Promise<ListaEnfermedadesResponse> {
  const response = await fetch(`${BASE_URL}/enfermedades`)

  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener enfermedades`)
  }

  return response.json()
}
