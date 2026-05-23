import { useState } from 'react'

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
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-10">
      {/* Warning Banner */}
      <div className="w-full bg-amber-soft border-l-4 border-on-tertiary-container p-5 rounded-r-xl shadow-sm">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-on-tertiary-container text-[28px]">
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
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col gap-6">
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
                className="text-label-md text-on-surface-variant ml-1"
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
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col gap-6">
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
                Mínimo 2
              </span>
            </div>
            <p className="text-body-md text-on-surface-variant">
              Seleccione las enfermedades para comparar los síntomas actuales.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
              {diseases.map((disease) => (
                <label
                  key={disease.id}
                  className="disease-card relative cursor-pointer block"
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={selectedDiseases[disease.id]}
                    onChange={() => toggleDisease(disease.id)}
                  />
                  <div className="border-2 border-surface-container-high rounded-xl p-4 flex items-center justify-between transition-all hover:bg-surface-container-low hover:border-outline-variant">
                    <span className="text-body-md font-medium text-on-surface">
                      {disease.label}
                    </span>
                    <span
                      className={`material-symbols-outlined text-primary-container check-icon transition-all duration-200 ${
                        selectedDiseases[disease.id]
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-50'
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
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col gap-8">
            <div className="flex items-center gap-3 border-b border-surface-container-high pb-4">
              <span className="material-symbols-outlined text-primary-container">
                analytics
              </span>
              <h2 className="text-headline-sm text-on-surface">
                Evaluación de Síntomas
              </h2>
              <span className="text-label-sm text-primary-container bg-primary-fixed px-3 py-1 rounded-full ml-auto">
                Lógica Difusa
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {symptoms.map((symptom) => (
                <div key={symptom.id} className="flex flex-col gap-4">
                  <label className="text-body-lg font-medium flex justify-between items-center text-on-surface">
                    <span>{symptom.label}</span>
                    <span className="text-headline-sm font-bold text-primary-container bg-surface-container-low px-3 py-1 rounded-lg min-w-[3rem] text-center">
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
            className="bg-primary-container text-white py-4 px-8 rounded-xl font-bold text-body-lg hover:bg-primary transition-colors shadow-md w-full md:w-auto self-end flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">science</span>
            Evaluar Síntomas
          </button>
        </div>

        {/* Right Column: Results Area */}
        <div className="w-full lg:w-[35%]">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 sticky top-32 flex flex-col items-center justify-center text-center gap-6 min-h-[500px] shadow-sm">
            {!hasEvaluated ? (
              <>
                <div className="w-32 h-32 rounded-full bg-surface-container flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[64px] text-primary-container/40">
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
              </>
            ) : (
              <>
                <div className="w-32 h-32 rounded-full bg-success-green/10 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[64px] text-success-green">
                    check_circle
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-headline-md text-on-surface font-bold">
                    Gripe Común
                  </h3>
                  <div className="w-12 h-1 bg-success-green mx-auto rounded-full" />
                </div>
                <div className="text-[48px] font-bold text-success-green leading-tight">
                  78%
                </div>
                <p className="text-label-md text-on-surface-variant">
                  Confianza del diagnóstico
                </p>
                <p className="text-body-md text-on-surface-variant leading-relaxed max-w-[280px]">
                  Se encontró una coincidencia significativa con el patrón de
                  síntomas de la Gripe Común.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
