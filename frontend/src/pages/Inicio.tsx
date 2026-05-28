import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Inicio() {
  const techSection = useScrollReveal<HTMLDivElement>()
  const card1 = useScrollReveal<HTMLDivElement>()
  const card2 = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
  const card3 = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
  const benefitsLeft = useScrollReveal<HTMLDivElement>()
  const benefitsRight = useScrollReveal<HTMLDivElement>()

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-surface-container-lowest overflow-hidden">
        {/* Animated Heartbeat Monitor Background */}
        <div className="absolute top-[35%] -translate-y-1/2 left-0 w-full h-40 pointer-events-none opacity-[0.5] z-0 overflow-hidden bg-ekg-grid">
          <div className="absolute left-0 top-0 h-full w-[2400px]">
            <svg
              className="w-full h-full animate-sweep"
              preserveAspectRatio="none"
              viewBox="0 0 2400 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path
                d="M 0 80 L 15 80 L 25 60 L 35 80 L 45 80 L 55 100 L 70 10 L 85 110 L 95 80 L 110 80 L 125 50 L 140 80 L 300 80 L 315 80 L 325 60 L 335 80 L 345 80 L 355 100 L 370 10 L 385 110 L 395 80 L 410 80 L 425 50 L 440 80 L 600 80 L 615 80 L 625 60 L 635 80 L 645 80 L 655 100 L 670 10 L 685 110 L 695 80 L 710 80 L 725 50 L 740 80 L 900 80 L 915 80 L 925 60 L 935 80 L 945 80 L 955 100 L 970 10 L 985 110 L 995 80 L 1010 80 L 1025 50 L 1040 80 L 1200 80 L 1215 80 L 1225 60 L 1235 80 L 1245 80 L 1255 100 L 1270 10 L 1285 110 L 1295 80 L 1310 80 L 1325 50 L 1340 80 L 1500 80 L 1515 80 L 1525 60 L 1535 80 L 1545 80 L 1555 100 L 1570 10 L 1585 110 L 1595 80 L 1610 80 L 1625 50 L 1640 80 L 1800 80 L 1815 80 L 1825 60 L 1835 80 L 1845 80 L 1855 100 L 1870 10 L 1885 110 L 1895 80 L 1910 80 L 1925 50 L 1940 80 L 2100 80 L 2115 80 L 2125 60 L 2135 80 L 2145 80 L 2155 100 L 2170 10 L 2185 110 L 2195 80 L 2210 80 L 2225 50 L 2240 80 L 2400 80"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
            </svg>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-16 md:py-32 flex flex-col items-center justify-center text-center min-h-[500px] relative z-10">
          <div className="z-10 flex flex-col items-center gap-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full text-primary-container text-label-md w-fit animate-fade-in-down">
              <span className="material-symbols-outlined text-[16px]">
                psychiatry
              </span>
              Sistema de Soporte a la Decisión
            </div>

            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface animate-fade-in-up delay-100">
              Diagnóstico Clínico Inteligente con Lógica Difusa
            </h1>

            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto animate-fade-in-up delay-200">
              Transformando síntomas ambiguos en decisiones precisas mediante
              inteligencia artificial avanzada.
            </p>

            <div className="inline-flex items-center gap-2 text-label-md text-on-surface-variant/70 animate-fade-in-up delay-250">
              <span className="material-symbols-outlined text-[16px]">person</span>
              Diego Fernando Ramírez García
            </div>

            <div className="mt-4 flex gap-4 justify-center w-full animate-fade-in-up delay-300">
              <Link
                to="/diagnostico-general"
                className="tour-inicio-btn btn-primary bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md shadow-md flex items-center gap-2"
              >
                Comenzar Diagnóstico
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
              <a
                href="#tecnologia"
                className="bg-surface-container-lowest border border-outline-variant text-primary px-6 py-3 rounded-lg text-label-md hover:bg-surface-container-low hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Saber Más
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="tecnologia" className="tour-inicio-tecnologia w-full bg-surface py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 flex flex-col gap-12">
          <div
            ref={techSection.ref}
            className={`text-center max-w-2xl mx-auto reveal ${techSection.isVisible ? 'is-visible' : ''}`}
          >
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
            <div
              ref={card1.ref}
              className={`bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm card-hover relative overflow-hidden group reveal ${card1.isVisible ? 'is-visible' : ''}`}
              style={{ transitionDelay: '0ms' }}
            >
              <div className="w-1 absolute left-0 top-0 bottom-0 bg-primary opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
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
            <div
              ref={card2.ref}
              className={`bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm card-hover relative overflow-hidden group reveal ${card2.isVisible ? 'is-visible' : ''}`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="w-1 absolute left-0 top-0 bottom-0 bg-secondary opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
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
            <div
              ref={card3.ref}
              className={`bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm card-hover relative overflow-hidden group reveal ${card3.isVisible ? 'is-visible' : ''}`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="w-1 absolute left-0 top-0 bottom-0 bg-primary-container opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary-container mb-6 group-hover:scale-110 transition-transform duration-300">
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
            <div
              ref={benefitsLeft.ref}
              className={`reveal-left ${benefitsLeft.isVisible ? 'is-visible' : ''}`}
            >
              <h2 className="text-headline-md text-on-surface mb-6">
                Por qué elegir MedFuzzy
              </h2>
              <div className="flex flex-col gap-8 mt-8">
                {[
                  {
                    icon: 'check_circle',
                    title: 'Simplicidad',
                    desc: 'Interfaz intuitiva diseñada para integrarse sin fricción en el flujo de trabajo clínico habitual.',
                  },
                  {
                    icon: 'shield',
                    title: 'Seguridad',
                    desc: 'Soporte basado en evidencia académica rigurosa, operando siempre como una herramienta de apoyo, no de reemplazo.',
                  },
                  {
                    icon: 'devices',
                    title: 'Accesibilidad',
                    desc: 'Disponible en múltiples plataformas con un tiempo de respuesta inmediato en entornos de alta exigencia.',
                  },
                ].map((benefit, i) => (
                  <div
                    key={benefit.title}
                    className="flex gap-4 group"
                    style={{
                      transitionDelay: benefitsLeft.isVisible
                        ? `${i * 150}ms`
                        : '0ms',
                    }}
                  >
                    <div className="mt-1 text-primary group-hover:scale-110 transition-transform duration-300">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {benefit.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-headline-sm text-on-surface">
                        {benefit.title}
                      </h4>
                      <p className="text-body-md text-on-surface-variant mt-1">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Inference Simulator Card */}
            <div
              ref={benefitsRight.ref}
              className={`bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant shadow-sm card-hover reveal-right ${benefitsRight.isVisible ? 'is-visible' : ''}`}
            >
              <div className="border-b border-outline-variant pb-4 mb-4 flex justify-between items-center">
                <h3 className="text-headline-sm text-on-surface">
                  Simulador de Inferencia
                </h3>
                <span className="material-symbols-outlined text-outline hover:rotate-180 transition-transform duration-500 cursor-pointer">
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
                    <div
                      className={`h-full bg-primary rounded-full transition-all duration-1000 ease-out ${
                        benefitsRight.isVisible ? 'w-2/3' : 'w-0'
                      }`}
                    />
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
                    <div
                      className={`h-full bg-secondary rounded-full transition-all duration-1000 ease-out delay-300 ${
                        benefitsRight.isVisible ? 'w-1/4' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
                  <div className="text-sm text-label-sm text-primary mb-1">
                    Confianza Diagnóstica
                  </div>
                  <div
                    className={`text-2xl text-headline-md text-primary transition-all duration-700 delay-500 ${
                      benefitsRight.isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2'
                    }`}
                  >
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
