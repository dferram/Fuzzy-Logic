import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface SymptomSlider {
  id: string
  label: string
  icon: string
  labels: string[]
  max: number
}

const symptoms: SymptomSlider[] = [
  {
    id: 's1',
    label: 'Fiebre',
    icon: 'device_thermostat',
    labels: ['No', '< 37.5', '< 38.5', '> 39'],
    max: 3,
  },
  {
    id: 's2',
    label: 'Tos',
    icon: 'pulmonology',
    labels: ['No', 'Leve', 'Fuerte', 'Muy Fuerte'],
    max: 3,
  },
  {
    id: 's3',
    label: 'Dolor de Cabeza',
    icon: 'sentiment_dissatisfied',
    labels: ['No', 'Leve', 'Fuerte', 'Muy Fuerte'],
    max: 3,
  },
  {
    id: 's4',
    label: 'Fatiga',
    icon: 'bed',
    labels: ['No', 'Leve', 'Fuerte', 'Muy Fuerte'],
    max: 3,
  },
  {
    id: 's5',
    label: 'Dolor Muscular',
    icon: 'accessibility_new',
    labels: ['No', 'Leve', 'Fuerte', 'Muy Fuerte'],
    max: 3,
  },
  {
    id: 's6',
    label: 'Dificultad Respiratoria',
    icon: 'air',
    labels: ['No', 'Leve', 'Fuerte', 'Muy Fuerte'],
    max: 3,
  },
]

interface ResultCard {
  name: string
  origin: string
  percentage: number
  color: string
  treatments: string[]
}

const mockResults: ResultCard[] = [
  {
    name: 'Infección Respiratoria Alta',
    origin: 'Origen: Viral (Probable)',
    percentage: 85,
    color: '#48BB78',
    treatments: [
      'Reposo relativo.',
      'Hidratación abundante.',
      'Paracetamol 500mg (condicional a fiebre/dolor).',
    ],
  },
  {
    name: 'Rinofaringitis',
    origin: 'Origen: Ambiental / Alérgico',
    percentage: 42,
    color: '#6B7280',
    treatments: [
      'Antihistamínicos si hay secreción.',
      'Evitar alérgenos conocidos.',
    ],
  },
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
        const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
        setCurrent(Math.round(eased * value))
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
      {current}%
    </span>
  )
}

export default function DiagnosticoGeneral() {
  const [patientName, setPatientName] = useState('')
  const [values, setValues] = useState<Record<string, number>>({
    s1: 0,
    s2: 1,
    s3: 2,
    s4: 0,
    s5: 0,
    s6: 0,
  })
  const [showResults, setShowResults] = useState(false)

  const bannerReveal = useScrollReveal<HTMLDivElement>()
  const patientReveal = useScrollReveal<HTMLDivElement>()
  const symptomsReveal = useScrollReveal<HTMLDivElement>()

  const handleSliderChange = (id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  const handleCalculate = () => {
    setShowResults(true)
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
            Prototipo Académico de Lógica Difusa: Consulte a un médico
          </p>
          <p className="text-on-surface-variant text-body-md text-sm mt-1">
            Este sistema es una herramienta de apoyo al diagnóstico y no
            reemplaza el criterio médico profesional.
          </p>
        </div>
      </div>

      {/* Patient Info */}
      <section
        ref={patientReveal.ref}
        className={`tour-dg-paciente bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] card-hover reveal ${patientReveal.isVisible ? 'is-visible' : ''}`}
      >
        <h2 className="text-headline-md text-primary-container mb-6 border-b border-surface-container-highest pb-4">
          Información del Paciente
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

      {/* Symptoms Grid */}
      <section
        ref={symptomsReveal.ref}
        className={`tour-dg-sintomas bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] card-hover reveal ${symptomsReveal.isVisible ? 'is-visible' : ''}`}
      >
        <h2 className="text-headline-md text-primary-container mb-8 border-b border-surface-container-highest pb-4">
          Evaluación de Síntomas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
          {symptoms.map((symptom, i) => (
            <div
              key={symptom.id}
              className={`flex flex-col gap-3 transition-all duration-500 ${
                symptomsReveal.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: symptomsReveal.isVisible
                  ? `${i * 100}ms`
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
              </div>
              <input
                className="w-full"
                max={symptom.max}
                min={0}
                step={1}
                type="range"
                value={values[symptom.id]}
                onChange={(e) =>
                  handleSliderChange(symptom.id, Number(e.target.value))
                }
              />
              <div className="flex justify-between text-label-sm text-on-surface-variant mt-1 px-1">
                {symptom.labels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-end">
          <button
            onClick={handleCalculate}
            className="tour-dg-btn btn-primary bg-primary-container text-on-primary px-8 py-3.5 rounded-xl text-label-md font-semibold shadow-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container"
          >
            <span className="material-symbols-outlined">calculate</span>
            Calcular Diagnóstico
          </button>
        </div>
      </section>

      {/* Results Area */}
      {showResults && (
        <section className="mt-6 animate-fade-in-up">
          <h2 className="text-headline-lg text-primary-container mb-8 animate-fade-in-up">
            Resultados del Análisis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockResults.map((result, i) => (
              <div
                key={result.name}
                className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative overflow-hidden card-hover animate-scale-in"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div
                  className="absolute top-0 left-0 w-1.5 h-full"
                  style={{ backgroundColor: result.color }}
                />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[24px] leading-8 font-semibold text-on-background">
                      {result.name}
                    </h3>
                    <p className="text-body-md text-on-surface-variant mt-1.5">
                      {result.origin}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <AnimatedNumber
                      value={result.percentage}
                      color={result.color}
                      delay={i * 200 + 300}
                    />
                    <span className="text-label-sm text-on-surface-variant mt-1">
                      Confianza Lógica
                    </span>
                  </div>
                </div>
                <AnimatedProgressBar
                  percentage={result.percentage}
                  color={result.color}
                  delay={i * 200 + 200}
                />
                <div className="pt-6 border-t border-surface-container-highest">
                  <h4 className="text-label-md font-semibold text-on-background tracking-wide mb-3">
                    Tratamiento Sugerido:
                  </h4>
                  <ul className="text-body-md text-on-surface-variant list-disc list-inside space-y-2">
                    {result.treatments.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
