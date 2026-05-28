import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import {
  diagnosticoEspecifico,
  listarEnfermedades,
  type SintomasInput,
  type DiagnosticoResponse,
  type ResultadoEnfermedad,
  type EnfermedadCatalogo,
} from '../services/api'
import {
  getSymptomDescription,
  getSymptomLevelName,
  type SymptomKey,
} from '../utils/symptomDescriptions'

// ── Los 15 síntomas ──
interface SymptomSlider {
  key: keyof SintomasInput
  label: string
}

const symptoms: SymptomSlider[] = [
  { key: 'fiebre', label: 'Fiebre' },
  { key: 'tos_seca', label: 'Tos Seca' },
  { key: 'tos_productiva', label: 'Tos Productiva' },
  { key: 'rinorrea', label: 'Rinorrea' },
  { key: 'estornudos', label: 'Estornudos' },
  { key: 'dolor_garganta', label: 'Dolor de Garganta' },
  { key: 'disnea', label: 'Disnea' },
  { key: 'sibilancias', label: 'Sibilancias' },
  { key: 'dolor_pecho', label: 'Dolor de Pecho' },
  { key: 'fatiga', label: 'Fatiga' },
  { key: 'cianosis', label: 'Cianosis' },
  { key: 'expectoracion_purulenta', label: 'Expectoracion Purulenta' },
  { key: 'perdida_olfato', label: 'Perdida de Olfato' },
  { key: 'congestion_nasal', label: 'Congestion Nasal' },
  { key: 'crepitantes_pulmonares', label: 'Crepitantes Pulmonares' },
]

function AnimatedNumber({
  value,
  color,
  delay = 0,
}: {
  value: number
  color: string
  delay?: number
}) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1000
      const steps = 30
      const stepTime = duration / steps
      let step = 0

      const interval = setInterval(() => {
        step++
        const progress = step / steps
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(Math.round(eased * value * 10) / 10)
        if (step >= steps) clearInterval(interval)
      }, stepTime)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [value, delay])

  return (
    <span
      className="text-[48px] font-bold leading-tight"
      style={{ color }}
    >
      {current.toFixed(1)}%
    </span>
  )
}

export default function DiagnosticoEspecifico() {
  const [patientName, setPatientName] = useState('')

  // ── Enfermedades cargadas dinámicamente desde el backend ──
  const [diseases, setDiseases] = useState<EnfermedadCatalogo[]>([])
  const [loadingDiseases, setLoadingDiseases] = useState(true)
  const [selectedDiseases, setSelectedDiseases] = useState<Record<string, boolean>>({})

  // ── Síntomas (0–100) ──
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    symptoms.forEach((s) => { init[s.key] = 0 })
    return init
  })

  // ── Estado del diagnóstico ──
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<DiagnosticoResponse | null>(null)
  const [lastModifiedSymptom, setLastModifiedSymptom] = useState<{
    key: string
    label: string
    value: number
  } | null>(null)

  const bannerReveal = useScrollReveal<HTMLDivElement>()
  const patientReveal = useScrollReveal<HTMLDivElement>()
  const diseaseReveal = useScrollReveal<HTMLDivElement>()
  const symptomsReveal = useScrollReveal<HTMLDivElement>()
  const resultsReveal = useScrollReveal<HTMLDivElement>()

  // ── Cargar catálogo de enfermedades al montar ──
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const data = await listarEnfermedades()
        setDiseases(data.enfermedades)
        // Seleccionar las primeras 2 por defecto
        const initial: Record<string, boolean> = {}
        data.enfermedades.forEach((d, i) => {
          initial[d.nombre] = i < 2
        })
        setSelectedDiseases(initial)
      } catch {
        setError('No se pudieron cargar las enfermedades del servidor.')
      } finally {
        setLoadingDiseases(false)
      }
    }
    fetchDiseases()
  }, [])

  const handleSliderChange = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    const symptomLabel = symptoms.find(s => s.key === key)?.label || key
    setLastModifiedSymptom({ key, label: symptomLabel, value })
  }

  const toggleDisease = (nombre: string) => {
    setSelectedDiseases((prev) => ({ ...prev, [nombre]: !prev[nombre] }))
  }

  const selectedCount = Object.values(selectedDiseases).filter(Boolean).length

  const buildSintomasInput = (): SintomasInput => {
    return Object.fromEntries(
      symptoms.map((s) => [s.key, values[s.key] / 100])
    ) as unknown as SintomasInput
  }

  const handleEvaluate = async () => {
    const selected = Object.entries(selectedDiseases)
      .filter(([, v]) => v)
      .map(([k]) => k)

    if (selected.length < 1) {
      setError('Selecciona al menos 1 enfermedad para evaluar.')
      return
    }

    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const result = await diagnosticoEspecifico(
        buildSintomasInput(),
        selected,
        patientName || undefined,
      )
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  // ── El resultado top (para el panel derecho) ──
  const topResult: ResultadoEnfermedad | null =
    response && response.resultados.length > 0 ? response.resultados[0] : null

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-10 page-enter">
      {/* Warning Banner */}
      <div
        ref={bannerReveal.ref}
        className={`w-full bg-amber-soft border-l-4 border-on-tertiary-container p-5 rounded-r-xl shadow-sm reveal ${bannerReveal.isVisible ? 'is-visible' : ''}`}
      >
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-on-tertiary-container text-[28px] animate-pulse">
            warning
          </span>
          <div>
            <h3 className="text-label-md font-bold text-on-surface uppercase tracking-wide">
              Advertencia Clinica
            </h3>
            <p className="text-body-md text-on-surface-variant mt-1">
              Este modulo es exclusivamente para uso academico y no sustituye el
              consejo medico profesional.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column: Inputs */}
        <div className="w-full lg:w-[65%] flex flex-col gap-8">
          {/* Patient Info Card */}
          <div
            ref={patientReveal.ref}
            className={`bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col gap-6 card-hover reveal-left ${patientReveal.isVisible ? 'is-visible' : ''}`}
          >
            <div className="flex items-center gap-3 border-b border-surface-container-high pb-4">
              <span className="material-symbols-outlined text-primary-container">
                person
              </span>
              <h2 className="text-headline-sm text-on-surface">
                Informacion del Paciente
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-label-md text-on-surface-variant ml-1 transition-all"
                htmlFor="patient-name-esp"
              >
                Nombre del Paciente
              </label>
              <input
                className="w-full border-2 border-surface-container-high rounded-xl p-4 text-body-lg focus:outline-none focus:ring-0 focus:border-primary-container transition-colors bg-surface-bright"
                id="patient-name-esp"
                placeholder="Ingrese el nombre completo"
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
          </div>

          {/* Disease Selection Card — cargadas del backend */}
          <div
            ref={diseaseReveal.ref}
            className={`tour-de-enfermedades bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col gap-6 card-hover reveal-left ${diseaseReveal.isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">
                  coronavirus
                </span>
                <h2 className="text-headline-sm text-on-surface">
                  Enfermedades a evaluar
                </h2>
              </div>
              <span className="text-label-sm text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">
                {selectedCount} seleccionadas
              </span>
            </div>
            <p className="text-body-md text-on-surface-variant">
              Seleccione las enfermedades para comparar los sintomas actuales.
            </p>

            {loadingDiseases ? (
              <div className="flex items-center justify-center py-8 gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Cargando enfermedades...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                {diseases.map((disease, i) => (
                  <label
                    key={disease.nombre}
                    className="disease-card relative cursor-pointer block animate-scale-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={!!selectedDiseases[disease.nombre]}
                      onChange={() => toggleDisease(disease.nombre)}
                    />
                    <div className="border-2 border-surface-container-high rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:bg-surface-container-low hover:border-outline-variant hover:-translate-y-1">
                      <span className="text-body-md font-medium text-on-surface">
                        {disease.nombre.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`material-symbols-outlined text-primary-container check-icon transition-all duration-300 ${
                          selectedDiseases[disease.nombre]
                            ? 'opacity-100 scale-100 rotate-0'
                            : 'opacity-0 scale-50 -rotate-45'
                        }`}
                      >
                        check_circle
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Symptoms Grid — 15 sliders */}
          <div
            ref={symptomsReveal.ref}
            className={`tour-de-sintomas bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col gap-8 card-hover reveal-left ${symptomsReveal.isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="flex items-center gap-3 border-b border-surface-container-high pb-4">
              <span className="material-symbols-outlined text-primary-container">
                analytics
              </span>
              <h2 className="text-headline-sm text-on-surface">
                Evaluacion de Sintomas
              </h2>
              <span className="text-label-sm text-primary-container bg-primary-fixed px-3 py-1 rounded-full ml-auto animate-pulse-glow">
                Logica Difusa
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {symptoms.map((symptom, i) => (
                <div
                  key={symptom.key}
                  className="flex flex-col gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <label className="text-body-lg font-medium flex justify-between items-center text-on-surface group">
                    <span className="group-hover:text-primary transition-colors">{symptom.label}</span>
                    <span className="text-headline-sm font-bold text-primary-container bg-surface-container-low px-3 py-1 rounded-lg min-w-[3rem] text-center transition-all">
                      {values[symptom.key]}
                    </span>
                  </label>
                  <div className="relative pt-2 pb-6">
                    <input
                      className="w-full"
                      max={100}
                      min={0}
                      type="range"
                      value={values[symptom.key]}
                      onChange={(e) =>
                        handleSliderChange(symptom.key, Number(e.target.value))
                      }
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-label-sm text-on-surface-variant font-medium">
                      <span>Nada</span>
                      <span>Muy Fuerte</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3 animate-fade-in-up">
              <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
              <div>
                <p className="text-red-800 font-semibold">Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleEvaluate}
            disabled={isLoading || selectedCount < 1}
            className="tour-de-btn btn-primary bg-primary-container text-white py-4 px-8 rounded-xl font-bold text-body-lg shadow-md w-full md:w-auto self-end flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Evaluando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">science</span>
                Evaluar Sintomas
              </>
            )}
          </button>
        </div>

        {/* Right Column: Results Panel */}
        <div className="tour-de-explicacion w-full lg:w-[35%]">
          <div
            ref={resultsReveal.ref}
            className={`bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 sticky top-32 flex flex-col items-center justify-center text-center gap-6 min-h-[500px] shadow-sm transition-all duration-500 reveal-right ${resultsReveal.isVisible ? 'is-visible' : ''}`}
          >
            {!response ? (
              lastModifiedSymptom ? (
                <div className="flex flex-col items-center gap-6 animate-scale-in w-full text-left">
                  <div className="w-24 h-24 rounded-full bg-primary-container/10 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-[48px] text-primary-container">
                      info
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 items-center w-full">
                    <h3 className="text-headline-sm text-on-surface font-bold text-center">
                      Síntoma Modificado
                    </h3>
                    <div className="w-12 h-1 bg-primary-container mx-auto rounded-full" />
                  </div>
                  <div className="bg-surface-container-low w-full rounded-xl p-5 border border-outline-variant shadow-sm mt-2">
                    <p className="text-label-md text-primary-container uppercase tracking-wider mb-2">
                      {lastModifiedSymptom.label}
                    </p>
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-headline-md font-bold text-on-surface">
                        {lastModifiedSymptom.value}
                      </span>
                      <span className="text-label-md text-on-surface-variant bg-surface-container px-3 py-1 rounded-md font-semibold">
                        {getSymptomLevelName(lastModifiedSymptom.value)}
                      </span>
                    </div>
                    <p className="text-body-md text-on-surface-variant leading-relaxed">
                      {getSymptomDescription(lastModifiedSymptom.key as SymptomKey, lastModifiedSymptom.value)}
                    </p>
                  </div>
                  <p className="text-label-sm text-on-surface-variant/70 mt-4 text-center">
                    Continúa configurando los síntomas y presiona "Evaluar Síntomas" al terminar.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 animate-fade-in">
                  <div className="w-32 h-32 rounded-full bg-surface-container flex items-center justify-center mb-2 hover:scale-105 transition-transform duration-300">
                    <span className="material-symbols-outlined text-[64px] text-primary-container/40 animate-pulse">
                      troubleshoot
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-headline-md text-on-surface font-bold">
                      Esperando evaluación
                    </h3>
                    <div className="w-12 h-1 bg-surface-container-high mx-auto rounded-full" />
                  </div>
                  <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-[280px]">
                    Configure los sintomas y seleccione enfermedades, luego presione
                    &quot;Evaluar Sintomas&quot;.
                  </p>
                </div>
              )
            ) : !response.confiable ? (
              <div className="flex flex-col items-center gap-6 animate-fade-in">
                <div className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[64px] text-amber-500">
                    warning
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-headline-md text-on-surface font-bold">
                    Sin coincidencias confiables
                  </h3>
                  <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full" />
                </div>
                <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-[280px]">
                  {response.mensaje}
                </p>
                <p className="text-label-md text-on-surface-variant/70 mt-2">
                  Ajuste los valores o seleccione otras opciones para un nuevo
                  analisis.
                </p>

                {/* Aun así mostramos los resultados debajo */}
                {response.resultados.length > 0 && (
                  <div className="w-full mt-4 flex flex-col gap-3">
                    {response.resultados.map((r) => (
                      <div key={r.nombre} className="flex justify-between items-center text-left bg-surface-container-low rounded-lg p-3">
                        <span className="text-body-md text-on-surface font-medium truncate mr-2">
                          {r.nombre.replace(/_/g, ' ')}
                        </span>
                        <span className="text-label-md text-on-surface-variant font-bold whitespace-nowrap">
                          {r.porcentaje.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : topResult ? (
              <div className="flex flex-col items-center gap-6 animate-scale-in">
                <div className="w-32 h-32 rounded-full bg-success-green/10 flex items-center justify-center mb-2 hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[64px] text-success-green animate-bounce">
                    check_circle
                  </span>
                </div>
                <div className="flex flex-col gap-3 animate-fade-in-up delay-100">
                  <h3 className="text-headline-md text-on-surface font-bold">
                    {topResult.nombre.replace(/_/g, ' ')}
                  </h3>
                  <div className="w-12 h-1 bg-success-green mx-auto rounded-full animate-grow-width" />
                </div>
                <AnimatedNumber value={topResult.porcentaje} color="var(--success-green, #48BB78)" delay={200} />
                <p className="text-label-md text-on-surface-variant animate-fade-in-up delay-300">
                  Confianza del diagnostico
                </p>
                <p className="text-body-md text-on-surface-variant leading-relaxed max-w-[280px] animate-fade-in-up delay-400">
                  Se encontro una coincidencia significativa con el patron de
                  sintomas de {topResult.nombre.replace(/_/g, ' ')}.
                </p>

                {/* Otros resultados */}
                {response.resultados.length > 1 && (
                  <div className="w-full mt-4 flex flex-col gap-3 border-t border-surface-container-high pt-4">
                    <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Otras coincidencias</p>
                    {response.resultados.slice(1).map((r) => (
                      <div key={r.nombre} className="flex justify-between items-center text-left bg-surface-container-low rounded-lg p-3">
                        <span className="text-body-md text-on-surface font-medium truncate mr-2">
                          {r.nombre.replace(/_/g, ' ')}
                        </span>
                        <span className="text-label-md text-on-surface-variant font-bold whitespace-nowrap">
                          {r.porcentaje.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
