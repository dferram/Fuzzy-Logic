import { Link } from 'react-router-dom'

export default function Inicio() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-surface-container-lowest overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-16 md:py-32 flex flex-col items-center justify-center text-center min-h-[500px]">
          <div className="z-10 flex flex-col items-center gap-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full text-primary-container text-label-md w-fit">
              <span className="material-symbols-outlined text-[16px]">
                psychiatry
              </span>
              Sistema de Soporte a la Decisión
            </div>

            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Diagnóstico Clínico Inteligente con Lógica Difusa
            </h1>

            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Transformando síntomas ambiguos en decisiones precisas mediante
              inteligencia artificial avanzada.
            </p>

            <div className="mt-4 flex gap-4 justify-center w-full">
              <Link
                to="/diagnostico-general"
                className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md shadow-md hover:bg-primary-container transition-colors flex items-center gap-2"
              >
                Comenzar Diagnóstico
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
              <a
                href="#tecnologia"
                className="bg-surface-container-lowest border border-outline-variant text-primary px-6 py-3 rounded-lg text-label-md hover:bg-surface-container-low transition-colors"
              >
                Saber Más
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section
        id="tecnologia"
        className="w-full bg-surface py-16 md:py-24"
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-headline-md text-on-surface mb-4">
              La Ventaja de la Lógica Difusa
            </h2>
            <p className="text-body-md text-on-surface-variant">
              La medicina no es binaria. Nuestro motor de inferencia capta la
              sutileza de la descripción del paciente, operando en el espectro
              entre &lsquo;sano&rsquo; y &lsquo;enfermo&rsquo;.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-1 absolute left-0 top-0 bottom-0 bg-primary opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  forum
                </span>
              </div>
              <h3 className="text-headline-sm text-on-surface mb-3">
                Lenguaje Natural
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Interpreta descripciones vagas como &ldquo;un poco de
                fiebre&rdquo; o &ldquo;dolor moderado&rdquo; asignándoles
                valores matemáticos precisos para el análisis.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-1 absolute left-0 top-0 bottom-0 bg-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-6">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  donut_large
                </span>
              </div>
              <h3 className="text-headline-sm text-on-surface mb-3">
                Intersección Difusa
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Calcula la probabilidad de patologías cruzando múltiples
                conjuntos de síntomas difusos, reflejando la complejidad real
                del cuadro clínico.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-1 absolute left-0 top-0 bottom-0 bg-primary-container opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary-container mb-6">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  track_changes
                </span>
              </div>
              <h3 className="text-headline-sm text-on-surface mb-3">
                Precisión Clínica
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Genera un índice de confianza para cada diagnóstico sugerido,
                permitiendo al profesional médico priorizar las vías de
                investigación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full bg-surface-container-low py-16 md:py-24 border-t border-outline-variant">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Benefits List */}
            <div>
              <h2 className="text-headline-md text-on-surface mb-6">
                Por qué elegir MedFuzzy
              </h2>
              <div className="flex flex-col gap-8 mt-8">
                <div className="flex gap-4">
                  <div className="mt-1 text-primary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  </div>
                  <div>
                    <h4 className="text-headline-sm text-on-surface">
                      Simplicidad
                    </h4>
                    <p className="text-body-md text-on-surface-variant mt-1">
                      Interfaz intuitiva diseñada para integrarse sin fricción
                      en el flujo de trabajo clínico habitual.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 text-primary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      shield
                    </span>
                  </div>
                  <div>
                    <h4 className="text-headline-sm text-on-surface">
                      Seguridad
                    </h4>
                    <p className="text-body-md text-on-surface-variant mt-1">
                      Soporte basado en evidencia académica rigurosa, operando
                      siempre como una herramienta de apoyo, no de reemplazo.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 text-primary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      devices
                    </span>
                  </div>
                  <div>
                    <h4 className="text-headline-sm text-on-surface">
                      Accesibilidad
                    </h4>
                    <p className="text-body-md text-on-surface-variant mt-1">
                      Disponible en múltiples plataformas con un tiempo de
                      respuesta inmediato en entornos de alta exigencia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Inference Simulator Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant shadow-sm">
              <div className="border-b border-outline-variant pb-4 mb-4 flex justify-between items-center">
                <h3 className="text-headline-sm text-on-surface">
                  Simulador de Inferencia
                </h3>
                <span className="material-symbols-outlined text-outline">
                  tune
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-label-md text-on-surface">
                      Intensidad del Dolor
                    </span>
                    <span className="text-label-sm text-primary">
                      Moderado-Alto
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-label-md text-on-surface">
                      Duración Síntomas
                    </span>
                    <span className="text-label-sm text-secondary">Agudo</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-1/4 rounded-full" />
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
                  <div className="text-sm text-label-sm text-primary mb-1">
                    Confianza Diagnóstica
                  </div>
                  <div className="text-2xl text-headline-md text-primary">
                    87.4%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
