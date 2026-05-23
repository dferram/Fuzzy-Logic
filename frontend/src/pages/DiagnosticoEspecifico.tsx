import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const diseases = [
  { id: 'gripe', label: 'Gripe', defaultChecked: true },
  { id: 'covid', label: 'COVID-19', defaultChecked: true },
  { id: 'alergias', label: 'Alergias', defaultChecked: false },
  { id: 'dengue', label: 'Dengue', defaultChecked: false },
  { id: 'neumonia', label: 'Neumonía', defaultChecked: false },
]

interface SymptomSlider {
  id: string
  label: string
}

const symptoms: SymptomSlider[] = [
  { id: 's1', label: 'Fiebre' },
  { id: 's2', label: 'Tos Seca' },
  { id: 's3', label: 'Fatiga' },
  { id: 's4', label: 'Dolor de Cabeza' },
  { id: 's5', label: 'Pérdida de Olfato/Gusto' },
  { id: 's6', label: 'Dolor Muscular' },
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
      className="text-[48px] font-bold leading-tight"
      style={{ color }}
    >
      {current}%
    </span>
  )
}

export default function DiagnosticoEspecifico() {
  const [patientName, setPatientName] = useState('')
  const [selectedDiseases, setSelectedDiseases] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    diseases.forEach((d) => {
      initial[d.id] = d.defaultChecked
    })
    return initial
  })
  const [values, setValues] = useState<Record<string, number>>({
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 0,
    s5: 0,
    s6: 0,
  })
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)

  useEffect(() => {
    if (showTutorial) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showTutorial])

  const bannerReveal = useScrollReveal<HTMLDivElement>()
  const patientReveal = useScrollReveal<HTMLDivElement>()
  const diseaseReveal = useScrollReveal<HTMLDivElement>()
  const symptomsReveal = useScrollReveal<HTMLDivElement>()
  const resultsReveal = useScrollReveal<HTMLDivElement>()

  const handleSliderChange = (id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  const toggleDisease = (id: string) => {
    setSelectedDiseases((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleEvaluate = () => {
    setHasEvaluated(true)
  }

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
              Advertencia Clínica
            </h3>
            <p className="text-body-md text-on-surface-variant mt-1">
              Este módulo es exclusivamente para uso académico y no sustituye el
              consejo médico profesional.
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
                Información del Paciente
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

          {/* Disease Selection Card */}
          <div
            ref={diseaseReveal.ref}
            className={`bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col gap-6 card-hover reveal-left ${diseaseReveal.isVisible ? 'is-visible' : ''}`}
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
              <span className="text-label-sm text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full animate-pulse">
                Mínimo 2
              </span>
            </div>
            <p className="text-body-md text-on-surface-variant">
              Seleccione las enfermedades para comparar los síntomas actuales.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
              {diseases.map((disease, i) => (
                <label
                  key={disease.id}
                  className={`disease-card relative cursor-pointer block animate-scale-in`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={selectedDiseases[disease.id]}
                    onChange={() => toggleDisease(disease.id)}
                  />
                  <div className="border-2 border-surface-container-high rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:bg-surface-container-low hover:border-outline-variant hover:-translate-y-1">
                    <span className="text-body-md font-medium text-on-surface">
                      {disease.label}
                    </span>
                    <span
                      className={`material-symbols-outlined text-primary-container check-icon transition-all duration-300 ${
                        selectedDiseases[disease.id]
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
          </div>

          {/* Symptoms Grid */}
          <div
            ref={symptomsReveal.ref}
            className={`bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col gap-8 card-hover reveal-left ${symptomsReveal.isVisible ? 'is-visible' : ''} ${showTutorial ? 'relative z-[101] ring-4 ring-primary-container/30 bg-surface' : ''}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="flex items-center gap-3 border-b border-surface-container-high pb-4">
              <span className="material-symbols-outlined text-primary-container">
                analytics
              </span>
              <h2 className="text-headline-sm text-on-surface">
                Evaluación de Síntomas
              </h2>
              <span className="text-label-sm text-primary-container bg-primary-fixed px-3 py-1 rounded-full ml-auto animate-pulse-glow">
                Lógica Difusa
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {symptoms.map((symptom, i) => (
                <div
                  key={symptom.id}
                  className={`flex flex-col gap-4 animate-fade-in-up`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <label className="text-body-lg font-medium flex justify-between items-center text-on-surface group">
                    <span className="group-hover:text-primary transition-colors">{symptom.label}</span>
                    <span className="text-headline-sm font-bold text-primary-container bg-surface-container-low px-3 py-1 rounded-lg min-w-[3rem] text-center transition-all">
                      {values[symptom.id]}
                    </span>
                  </label>
                  <div className="relative pt-2 pb-6">
                    <input
                      className="w-full"
                      max={100}
                      min={0}
                      type="range"
                      value={values[symptom.id]}
                      onChange={(e) =>
                        handleSliderChange(symptom.id, Number(e.target.value))
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

          <button
            onClick={handleEvaluate}
            className={`btn-primary bg-primary-container text-white py-4 px-8 rounded-xl font-bold text-body-lg shadow-md w-full md:w-auto self-end flex items-center justify-center gap-2 ${showTutorial ? 'relative z-[101] ring-4 ring-primary-container/30 animate-pulse-glow' : ''}`}
          >
            <span className="material-symbols-outlined">science</span>
            Evaluar Síntomas
          </button>
        </div>

        {/* Right Column: Results Area */}
        <div className="w-full lg:w-[35%]">
          <div
            ref={resultsReveal.ref}
            className={`bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 sticky top-32 flex flex-col items-center justify-center text-center gap-6 min-h-[500px] shadow-sm transition-all duration-500 reveal-right ${resultsReveal.isVisible ? 'is-visible' : ''}`}
          >
            {!hasEvaluated ? (
              <div className="flex flex-col items-center gap-6 animate-fade-in">
                <div className="w-32 h-32 rounded-full bg-surface-container flex items-center justify-center mb-2 hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[64px] text-primary-container/40 animate-pulse">
                    troubleshoot
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-headline-md text-on-surface font-bold">
                    Sin coincidencias
                  </h3>
                  <div className="w-12 h-1 bg-surface-container-high mx-auto rounded-full" />
                </div>
                <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-[280px]">
                  Los síntomas ingresados actualmente no coinciden de manera
                  confiable con las enfermedades seleccionadas.
                </p>
                <p className="text-label-md text-on-surface-variant/70 mt-2">
                  Ajuste los valores o seleccione otras opciones para un nuevo
                  análisis.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 animate-scale-in">
                <div className="w-32 h-32 rounded-full bg-success-green/10 flex items-center justify-center mb-2 hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[64px] text-success-green animate-bounce">
                    check_circle
                  </span>
                </div>
                <div className="flex flex-col gap-3 animate-fade-in-up delay-100">
                  <h3 className="text-headline-md text-on-surface font-bold">
                    Gripe Común
                  </h3>
                  <div className="w-12 h-1 bg-success-green mx-auto rounded-full animate-grow-width" />
                </div>
                <AnimatedNumber value={78} color="var(--success-green, #48BB78)" delay={200} />
                <p className="text-label-md text-on-surface-variant animate-fade-in-up delay-300">
                  Confianza del diagnóstico
                </p>
                <p className="text-body-md text-on-surface-variant leading-relaxed max-w-[280px] animate-fade-in-up delay-400">
                  Se encontró una coincidencia significativa con el patrón de
                  síntomas de la Gripe Común.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-auto">
          {/* Gray out background */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setShowTutorial(false)} />
          
          {/* Tutorial Message Box */}
          <div className="relative bg-surface-container-lowest text-on-surface p-6 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-primary-container/30 max-w-[450px] mx-4 animate-fade-in-up z-[101] md:ml-[35%] lg:ml-[25%]">
            <button 
              onClick={() => setShowTutorial(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low rounded-full p-1 flex items-center justify-center hover:bg-surface-container-high"
              aria-label="Cerrar tutorial"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="flex items-start gap-4 pr-6">
              <div className="bg-primary-fixed text-primary-container p-2 rounded-full mt-1">
                <span className="material-symbols-outlined text-[24px]">psychiatry</span>
              </div>
              <div>
                <h4 className="text-headline-sm font-bold text-primary-container mb-2 tracking-tight">Cómo funciona la Lógica Difusa</h4>
                <p className="text-body-md text-on-surface-variant mb-4 leading-relaxed">
                  A diferencia de un diagnóstico normal donde los síntomas son simplemente "Sí" o "No", aquí debes 
                  ajustar la <strong className="text-on-surface">intensidad exacta (0 a 100)</strong> de cada síntoma.
                </p>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  Ajusta los valores y luego presiona <strong className="text-primary font-semibold">Evaluar Síntomas</strong>. 
                  El sistema cruzará estos datos difusos para calcular la probabilidad exacta de las enfermedades seleccionadas.
                </p>
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="mt-6 bg-primary-container text-on-primary px-6 py-2 rounded-lg text-label-md font-semibold hover:bg-[#0f2444] transition-colors w-full shadow-sm"
                >
                  ¡Entendido!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
