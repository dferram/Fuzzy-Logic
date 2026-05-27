import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { obtenerMatriz, type MatrizEnfermedad } from '../services/api'

// Nombres de los síntomas para las columnas de la tabla
const SYMPTOM_NAMES = [
  'Fiebre', 'Tos_Seca', 'Tos_Productiva', 'Rinorrea', 'Estornudos',
  'Dolor_Garganta', 'Disnea', 'Sibilancias', 'Dolor_Pecho', 'Fatiga',
  'Cianosis', 'Expectoracion_Purulenta', 'Perdida_Olfato',
  'Congestion_Nasal', 'Crepitantes_Pulmonares'
]

export default function BaseConocimiento() {
  const [matriz, setMatriz] = useState<MatrizEnfermedad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const headerReveal = useScrollReveal<HTMLDivElement>()
  const tableReveal = useScrollReveal<HTMLDivElement>()

  useEffect(() => {
    const fetchMatriz = async () => {
      try {
        const data = await obtenerMatriz()
        setMatriz(data.matriz)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }
    fetchMatriz()
  }, [])

  // Función para obtener el color de fondo de la celda basado en el valor (0.0 a 1.0)
  const getCellColor = (value: number) => {
    if (value === 0) return 'bg-surface-container-lowest text-on-surface-variant/30' // Gris claro para 0
    if (value < 0.3) return 'bg-primary-container/10 text-on-surface'
    if (value < 0.6) return 'bg-primary-container/30 text-on-surface'
    if (value < 0.8) return 'bg-primary-container/60 text-on-surface font-medium'
    return 'bg-primary-container text-on-primary-container font-bold' // Valores altos (0.8 - 1.0) resaltados
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12 flex flex-col gap-10 page-enter">
      {/* Header Area */}
      <div
        ref={headerReveal.ref}
        className={`flex flex-col gap-4 reveal ${headerReveal.isVisible ? 'is-visible' : ''}`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full text-primary-container text-label-md w-fit">
          <span className="material-symbols-outlined text-[16px]">database</span>
          Matriz de Logica Difusa
        </div>
        <h1 className="text-headline-lg text-on-surface">
          Base de Conocimiento
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-3xl">
          Esta matriz muestra los grados de pertenencia difusa asignados a cada sintoma
          para las diferentes patologias respiratorias. Los valores van de <strong>0.0</strong> (ausencia de relacion)
          a <strong>1.0</strong> (fuerte correlacion clinica).
        </p>
      </div>

      {/* Main Table Card */}
      <div
        ref={tableReveal.ref}
        className={`bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden reveal ${tableReveal.isVisible ? 'is-visible' : ''}`}
        style={{ transitionDelay: '150ms' }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-[48px] text-primary-container">progress_activity</span>
            <p className="text-body-lg font-medium">Cargando base de conocimiento...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="material-symbols-outlined text-[48px] text-red-500">error</span>
            <p className="text-body-lg font-medium text-red-800">Error al cargar la matriz</p>
            <p className="text-body-md text-red-600">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-surface-container-low border-b-2 border-outline-variant">
                  <th className="p-4 text-label-md font-bold text-on-surface sticky left-0 bg-surface-container-low z-10 border-r border-outline-variant min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    Enfermedad
                  </th>
                  {SYMPTOM_NAMES.map((symptom) => (
                    <th key={symptom} className="p-2 align-middle h-40 text-label-sm font-semibold text-on-surface-variant border-r border-outline-variant/50 last:border-none">
                      <div className="flex items-center justify-center w-full h-full">
                        <span style={{ writingMode: 'vertical-rl' }} className="tracking-widest">
                          {symptom.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {matriz.map((row, index) => (
                  <tr key={row.nombre} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 text-body-md font-medium text-on-surface sticky left-0 bg-surface-container-lowest z-10 border-r border-outline-variant shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] group">
                      {row.nombre.replace(/_/g, ' ')}
                      {/* Tooltip on hover for Origen y Tratamiento */}
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-72 p-4 bg-inverse-surface text-inverse-on-surface text-label-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg flex flex-col gap-2">
                        <div>
                          <strong className="text-primary-fixed-dim">Origen:</strong> {row.origen}
                        </div>
                        <div>
                          <strong className="text-primary-fixed-dim">Tratamiento:</strong> {row.tratamiento}
                        </div>
                      </div>
                    </td>
                    {SYMPTOM_NAMES.map((symptom) => {
                      const value = row.sintomas[symptom] ?? 0.0
                      return (
                        <td
                          key={`${row.nombre}-${symptom}`}
                          className={`p-0 border-r border-outline-variant/50 last:border-none text-center transition-colors duration-300 ${getCellColor(value)}`}
                        >
                          <div className="w-full h-full p-4 flex items-center justify-center">
                            {value.toFixed(1)}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      {!isLoading && !error && (
        <div className="flex items-center justify-end gap-6 text-label-sm text-on-surface-variant">
          <span className="font-semibold">Nivel de Pertenencia:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-surface-container-lowest border border-outline-variant"></div>
            <span>0.0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-container/30"></div>
            <span>0.1 - 0.5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-container/60"></div>
            <span>0.6 - 0.7</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-container"></div>
            <span>0.8 - 1.0</span>
          </div>
        </div>
      )}
    </div>
  )
}
