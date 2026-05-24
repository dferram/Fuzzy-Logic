import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { diagnosticoGeneral, type SintomasInput, type DiagnosticoResponse, type ResultadoEnfermedad } from '../services/api'

// ── Los 15 síntomas con sus keys que mapean a SintomasInput ──
interface SymptomSlider {
  key: keyof SintomasInput
  label: string
  icon: string
}

const symptoms: SymptomSlider[] = [
  { key: 'fiebre', label: 'Fiebre', icon: 'device_thermostat' },
  { key: 'tos_seca', label: 'Tos Seca', icon: 'pulmonology' },
  { key: 'tos_productiva', label: 'Tos Productiva', icon: 'water_drop' },
  { key: 'rinorrea', label: 'Rinorrea', icon: 'water' },
  { key: 'estornudos', label: 'Estornudos', icon: 'air' },
  { key: 'dolor_garganta', label: 'Dolor de Garganta', icon: 'mic_off' },
  { key: 'disnea', label: 'Disnea', icon: 'airwave' },
  { key: 'sibilancias', label: 'Sibilancias', icon: 'graphic_eq' },
  { key: 'dolor_pecho', label: 'Dolor de Pecho', icon: 'cardiology' },
  { key: 'fatiga', label: 'Fatiga', icon: 'bed' },
  { key: 'cianosis', label: 'Cianosis', icon: 'bloodtype' },
  { key: 'expectoracion_purulenta', label: 'Expectoración Purulenta', icon: 'science' },
  { key: 'perdida_olfato', label: 'Pérdida de Olfato', icon: 'sentiment_dissatisfied' },
  { key: 'congestion_nasal', label: 'Congestión Nasal', icon: 'masks' },
  { key: 'crepitantes_pulmonares', label: 'Crepitantes Pulmonares', icon: 'stethoscope' },
]

// ── Colores para las tarjetas de resultado por posición ──
const RESULT_COLORS = [
  '#48BB78', '#4299E1', '#ED8936', '#9F7AEA',
  '#F56565', '#38B2AC', '#DD6B20', '#667EEA',
  '#E53E3E', '#D69E2E',
]

function AnimatedProgressBar({
  percentage,
  color,
  delay = 0,
}: {
  percentage: number
  color: string
  delay?: number
}) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100 + delay)
    return () => clearTimeout(timer)
  }, [percentage, delay])

  return (
    <div className="w-full bg-surface-container-highest rounded-full h-3 mb-8">
      <div
        className="h-3 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  )
}

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
      const duration = 800
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
      className="text-[36px] leading-[40px] font-bold tracking-tight"
      style={{ color }}
    >
      {current.toFixed(1)}%
    </span>
  )
}

export default function DiagnosticoGeneral() {
  const [patientName, setPatientName] = useState('')
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    symptoms.forEach((s) => { init[s.key] = 0 })
    return init
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<DiagnosticoResponse | null>(null)

  const bannerReveal = useScrollReveal<HTMLDivElement>()
  const patientReveal = useScrollReveal<HTMLDivElement>()
  const symptomsReveal = useScrollReveal<HTMLDivElement>()

  const handleSliderChange = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const buildSintomasInput = (): SintomasInput => {
    return Object.fromEntries(
      symptoms.map((s) => [s.key, values[s.key] / 100])
    ) as unknown as SintomasInput
  }

  const handleCalculate = async () => {
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const result = await diagnosticoGeneral(
        buildSintomasInput(),
        patientName || undefined,
      )
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-10 page-enter">
      {/* Warning Banner */}
      <div
        ref={bannerReveal.ref}
        className={`w-full bg-[#FAF0DA] border-l-4 border-[#D69E2E] p-4 rounded-r-xl flex items-start gap-4 shadow-sm reveal ${bannerReveal.isVisible ? 'is-visible' : ''}`}
      >
        <span className="material-symbols-outlined text-[#D69E2E] mt-0.5">
          warning
        </span>
        <div>
          <p className="text-on-background text-label-md font-bold">
            Prototipo Academico de Logica Difusa: Consulte a un medico
          </p>
          <p className="text-on-surface-variant text-body-md text-sm mt-1">
            Este sistema es una herramienta de apoyo al diagnostico y no
            reemplaza el criterio medico profesional.
          </p>
        </div>
      </div>

      {/* Patient Info */}
      <section
        ref={patientReveal.ref}
        className={`tour-dg-paciente bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] card-hover reveal ${patientReveal.isVisible ? 'is-visible' : ''}`}
      >
        <h2 className="text-headline-md text-primary-container mb-6 border-b border-surface-container-highest pb-4">
          Informacion del Paciente
        </h2>
        <div className="max-w-xl">
          <label
            className="block text-label-md text-on-surface-variant mb-2"
            htmlFor="patientName"
          >
            Nombre del Paciente
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl border border-surface-container-highest bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all text-body-md text-on-background placeholder-on-surface-variant/50 shadow-sm"
            id="patientName"
            placeholder="Ingrese nombre completo"
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
      </section>

      {/* Symptoms Grid — 15 sliders (0-100) */}
      <section
        ref={symptomsReveal.ref}
        className={`tour-dg-sintomas bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] card-hover reveal ${symptomsReveal.isVisible ? 'is-visible' : ''}`}
      >
        <h2 className="text-headline-md text-primary-container mb-8 border-b border-surface-container-highest pb-4">
          Evaluacion de Sintomas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {symptoms.map((symptom, i) => (
            <div
              key={symptom.key}
              className={`flex flex-col gap-3 transition-all duration-500 ${
                symptomsReveal.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: symptomsReveal.isVisible
                  ? `${i * 60}ms`
                  : '0ms',
              }}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="text-body-lg font-semibold text-on-background flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-primary-container/70 text-2xl transition-transform duration-300 hover:scale-125"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {symptom.icon}
                  </span>
                  {symptom.label}
                </label>
                <span className="text-headline-sm font-bold text-primary-container bg-surface-container-low px-3 py-1 rounded-lg min-w-[3rem] text-center transition-all">
                  {values[symptom.key]}
                </span>
              </div>
              <input
                className="w-full"
                max={100}
                min={0}
                step={1}
                type="range"
                value={values[symptom.key]}
                onChange={(e) =>
                  handleSliderChange(symptom.key, Number(e.target.value))
                }
              />
              <div className="flex justify-between text-label-sm text-on-surface-variant mt-1 px-1">
                <span>Nada</span>
                <span>Muy Fuerte</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-end">
          <button
            onClick={handleCalculate}
            disabled={isLoading}
            className="tour-dg-btn btn-primary bg-primary-container text-on-primary px-8 py-3.5 rounded-xl text-label-md font-semibold shadow-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Analizando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">calculate</span>
                Calcular Diagnostico
              </>
            )}
          </button>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3 animate-fade-in-up">
          <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
          <div>
            <p className="text-red-800 font-semibold">Error al procesar el diagnostico</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Results Area */}
      {response && (
        <section className="mt-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-headline-lg text-primary-container animate-fade-in-up">
              Resultados del Analisis
            </h2>
            <span className={`px-4 py-2 rounded-full text-label-md font-semibold ${
              response.confiable
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {response.confiable ? 'Confiable' : 'No Confiable'}
            </span>
          </div>

          {/* Mensaje del backend */}
          <div className={`p-4 rounded-xl mb-8 text-body-md ${
            response.confiable
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {response.mensaje}
          </div>

          {response.resultados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {response.resultados.map((result: ResultadoEnfermedad, i: number) => {
                const color = RESULT_COLORS[i % RESULT_COLORS.length]
                return (
                  <div
                    key={result.nombre}
                    className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative overflow-hidden card-hover animate-scale-in"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <div
                      className="absolute top-0 left-0 w-1.5 h-full"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex justify-between items-start mb-6">
                      <div className="pr-4">
                        <h3 className="text-[24px] leading-8 font-semibold text-on-background">
                          {result.nombre.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-body-md text-on-surface-variant mt-1.5">
                          Origen: {result.origen.length > 80
                            ? result.origen.substring(0, 80) + '...'
                            : result.origen}
                        </p>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <AnimatedNumber
                          value={result.porcentaje}
                          color={color}
                          delay={i * 200 + 300}
                        />
                        <span className="text-label-sm text-on-surface-variant mt-1">
                          Confianza Logica
                        </span>
                      </div>
                    </div>
                    <AnimatedProgressBar
                      percentage={result.porcentaje}
                      color={color}
                      delay={i * 200 + 200}
                    />
                    <div className="pt-6 border-t border-surface-container-highest">
                      <h4 className="text-label-md font-semibold text-on-background tracking-wide mb-3">
                        Tratamiento Sugerido:
                      </h4>
                      <p className="text-body-md text-on-surface-variant">
                        {result.tratamiento}
                      </p>
                    </div>
                    {/* Grado de coincidencia raw */}
                    <div className="mt-4 pt-4 border-t border-surface-container-highest flex justify-between text-label-sm text-on-surface-variant">
                      <span>Grado de coincidencia</span>
                      <span className="font-bold" style={{ color }}>
                        {result.grado_coincidencia.toFixed(4)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-[64px] opacity-30 mb-4 block">search_off</span>
              <p className="text-body-lg">No se encontraron resultados.</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
