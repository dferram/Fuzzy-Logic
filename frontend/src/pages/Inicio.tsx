import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Inicio() {
  const techSection = useScrollReveal<HTMLDivElement>()
  const card1 = useScrollReveal<HTMLDivElement>()
  const card2 = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
  const card3 = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
  const explanationLeft = useScrollReveal<HTMLDivElement>()
  const explanationRight = useScrollReveal<HTMLDivElement>()

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
                school
              </span>
              Proyecto Académico Universitario
            </div>

            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface animate-fade-in-up delay-100">
              Diagnóstico Clínico Inteligente con Lógica Difusa
            </h1>

            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto animate-fade-in-up delay-200">
              Un proyecto de investigación que implementa la Teoría de Conjuntos Difusos 
              para modelar la incertidumbre inherente en el diagnóstico médico de enfermedades respiratorias.
            </p>

            <div className="inline-flex items-center gap-2 text-label-md text-on-surface-variant/70 animate-fade-in-up delay-250">
              <span className="material-symbols-outlined text-[16px]">person</span>
              Diego Fernando Ramírez García | UAQ - Facultad de Informática
            </div>

            <div className="mt-4 flex gap-4 justify-center w-full animate-fade-in-up delay-300">
              <Link
                to="/diagnostico-general"
                className="tour-inicio-btn btn-primary bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md shadow-md flex items-center gap-2 hover:-translate-y-0.5 transition-all"
              >
                Probar Sistema
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  science
                </span>
              </Link>
              <a
                href="#tecnologia"
                className="bg-surface-container-lowest border border-outline-variant text-primary px-6 py-3 rounded-lg text-label-md hover:bg-surface-container-low hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Ver Marco Teórico
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Explicacion Teórica Section */}
      <section id="tecnologia" className="tour-inicio-tecnologia w-full bg-surface py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 flex flex-col gap-12">
          <div
            ref={techSection.ref}
            className={`text-center max-w-2xl mx-auto reveal ${techSection.isVisible ? 'is-visible' : ''}`}
          >
            <h2 className="text-headline-md text-on-surface mb-4">
              Fundamentos de la Lógica Difusa
            </h2>
            <p className="text-body-md text-on-surface-variant">
              A diferencia de la lógica booleana clásica donde un elemento pertenece o no pertenece a un conjunto (0 o 1), 
              la lógica difusa introducida por Lotfi A. Zadeh permite grados de pertenencia continuos entre 0 y 1, 
              modelando matemáticamente el razonamiento aproximado humano.
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
                  functions
                </span>
              </div>
              <h3 className="text-headline-sm text-on-surface mb-3">
                Conjuntos Difusos
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Se definen conjuntos como "Fiebre Alta" o "Dolor Severo". Un paciente no simplemente "tiene" o "no tiene" el síntoma, 
                sino que posee un grado de pertenencia (ej. 0.8) a ese conjunto difuso, reflejando la realidad médica.
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
                  alt_route
                </span>
              </div>
              <h3 className="text-headline-sm text-on-surface mb-3">
                Norma T del Mínimo
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Para inferir la intersección entre los síntomas del paciente y los patrones de la enfermedad, 
                utilizamos la norma T de Zadeh (operador de mínimo). Así garantizamos matemáticamente 
                el cálculo de la superposición de conjuntos.
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
                  clinical_notes
                </span>
              </div>
              <h3 className="text-headline-sm text-on-surface mb-3">
                Motor de Inferencia
              </h3>
              <p className="text-body-md text-on-surface-variant">
                El sistema evalúa el vector difuso de entrada (síntomas) contra 10 bases de conocimiento (enfermedades respiratorias), 
                calculando un índice de coincidencia normalizado (defusificación implícita) para emitir resultados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Aplicacion Medica Section */}
      <section className="w-full bg-surface-container-low py-16 md:py-24 border-t border-outline-variant">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Explanation List */}
            <div
              ref={explanationLeft.ref}
              className={`reveal-left ${explanationLeft.isVisible ? 'is-visible' : ''}`}
            >
              <h2 className="text-headline-md text-on-surface mb-6">
                El Problema del Diagnóstico Convencional
              </h2>
              <div className="flex flex-col gap-8 mt-8">
                {[
                  {
                    icon: 'warning',
                    title: 'Ambigüedad Semántica',
                    desc: 'Los pacientes expresan síntomas con términos vagos ("me duele un poco", "tengo algo de temperatura"). La lógica clásica booleana fuerza estas expresiones a verdades absolutas, perdiendo información crucial.',
                  },
                  {
                    icon: 'join_inner',
                    title: 'Solución Propuesta',
                    desc: 'Este proyecto de Inteligencia Artificial captura esa incertidumbre. Mapea expresiones lingüísticas a valores difusos [0,1], permitiendo que la computadora razone con información imprecisa de forma estructurada.',
                  },
                  {
                    icon: 'biotech',
                    title: 'Contexto Académico',
                    desc: 'Este es un sistema experto desarrollado como proyecto universitario, demostrando cómo los modelos formales matemáticos de la IA pueden aplicarse al razonamiento clínico.',
                  },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    className="flex gap-4 group"
                    style={{
                      transitionDelay: explanationLeft.isVisible
                        ? `${i * 150}ms`
                        : '0ms',
                    }}
                  >
                    <div className="mt-1 text-primary group-hover:scale-110 transition-transform duration-300">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-headline-sm text-on-surface">
                        {item.title}
                      </h4>
                      <p className="text-body-md text-on-surface-variant mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Academic Diagram/Explanation */}
            <div
              ref={explanationRight.ref}
              className={`bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant shadow-sm card-hover reveal-right ${explanationRight.isVisible ? 'is-visible' : ''}`}
            >
              <div className="border-b border-outline-variant pb-4 mb-4 flex justify-between items-center">
                <h3 className="text-headline-sm text-on-surface">
                  Modelo Matemático de Inferencia
                </h3>
                <span className="material-symbols-outlined text-outline">
                  calculate
                </span>
              </div>
              <div className="space-y-6">
                <div className="bg-surface p-4 rounded-lg border border-outline-variant text-center">
                  <p className="font-mono text-sm text-on-surface font-semibold mb-2">
                    Cálculo de Intersección (Norma T)
                  </p>
                  <p className="font-mono text-xs text-on-surface-variant">
                    μ_{`{A ∩ B}`}(x) = min[μ_A(x), μ_B(x)]
                  </p>
                </div>
                
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Para cada enfermedad <i>E</i> en la base de conocimiento y el conjunto de síntomas reportados por el paciente <i>P</i>:
                </p>

                <div className="bg-surface p-4 rounded-lg border border-outline-variant text-center">
                  <p className="font-mono text-sm text-on-surface font-semibold mb-2">
                    Índice de Coincidencia (C)
                  </p>
                  <p className="font-mono text-xs text-on-surface-variant">
                    C(P, E) = {`{Σ_{i=1}^n min(P_i, E_i)}`} / n
                  </p>
                </div>

                <p className="text-body-sm text-on-surface-variant leading-relaxed text-center">
                  Donde <b>n</b> es el número total de síntomas evaluables (15). El resultado final es un grado de pertenencia global que indica qué tan posible es que el paciente posea el cuadro clínico de la enfermedad evaluada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
