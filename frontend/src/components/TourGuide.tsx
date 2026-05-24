import { useEffect, useState } from 'react'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'
import { useLocation, useNavigate } from 'react-router-dom'

export default function TourGuide() {
  const location = useLocation()
  const navigate = useNavigate()
  const [run, setRun] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    // Escucha si se desactiva desde el menú de ajustes
    const handleSettingsChange = () => {
      const disabled = localStorage.getItem('medfuzzy-tutorial-disabled') === 'true'
      if (disabled) setRun(false)
    }
    window.addEventListener('tutorialSettingsChanged', handleSettingsChange)
    return () => window.removeEventListener('tutorialSettingsChanged', handleSettingsChange)
  }, [])

  useEffect(() => {
    // Dynamic steps based on current route
    let routeSteps: Step[] = []

    if (location.pathname === '/') {
      routeSteps = [
        {
          target: 'body',
          placement: 'center',
          content: '¡Bienvenido a MedFuzzy! Te daremos un rápido recorrido para que aprendas a usar este sistema de diagnóstico basado en Inteligencia Artificial.',
          title: 'Bienvenido al Sistema de Soporte a la Decisión',
          disableBeacon: true,
        },
        {
          target: '.tour-inicio-tecnologia',
          content: 'Aquí te explicamos la ventaja principal: usamos Lógica Difusa. En lugar de diagnósticos rígidos ("Sí" o "No"), evaluamos el nivel de intensidad real de los síntomas del paciente.',
          title: 'Nuestra Tecnología',
          placement: 'top',
        },
        {
          target: '.tour-inicio-btn',
          content: 'Haz clic aquí cuando estés listo para comenzar el análisis.',
          title: 'Comienza tu diagnóstico',
          spotlightClicks: true,
          placement: 'bottom',
        },
      ]
    } else if (location.pathname === '/diagnostico-general') {
      routeSteps = [
        {
          target: '.tour-dg-paciente',
          content: 'Primero, ingresa el nombre del paciente para mantener un registro en la evaluación actual.',
          title: 'Datos Básicos',
          disableBeacon: true,
          placement: 'bottom',
        },
        {
          target: '.tour-dg-sintomas',
          content: 'Ajusta la intensidad de cada síntoma. Por ejemplo, en lugar de solo decir que tiene fiebre, indica si es leve, fuerte o muy fuerte.',
          title: 'Evaluación Difusa',
          placement: 'top',
        },
        {
          target: '.tour-dg-btn',
          content: 'Presiona Calcular para que el motor cruce los datos e infiera la probabilidad de cada enfermedad respiratoria.',
          title: 'Resultados Inmediatos',
          placement: 'left',
        },
      ]
    } else if (location.pathname === '/diagnostico-especifico') {
      routeSteps = [
        {
          target: '.tour-de-enfermedades',
          content: 'Selecciona al menos 2 enfermedades de la base de conocimientos para comparar el cuadro clínico actual con los patrones teóricos.',
          title: 'Selección de Patrones',
          disableBeacon: true,
          placement: 'bottom',
        },
        {
          target: '.tour-de-sintomas',
          content: 'Aquí la lógica difusa brilla: ajusta la barra en una escala de 0 a 100 para capturar la magnitud exacta del síntoma reportado por el paciente.',
          title: 'Precisión Milimétrica',
          placement: 'top',
        },
        {
          target: '.tour-de-btn',
          content: 'Presiona "Evaluar Síntomas" para ver la probabilidad estadística de las patologías seleccionadas.',
          title: 'Motor de Inferencia',
          placement: 'top',
        },
      ]
    }

    setSteps(routeSteps)
    
    // Check global toggle
    const disabled = localStorage.getItem('medfuzzy-tutorial-disabled') === 'true'
    
    if (routeSteps.length > 0 && !disabled) {
      setRun(true)
    } else {
      setRun(false)
    }
  }, [location.pathname])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRun(false)
    }
  }

  return (
    <Joyride
      key={location.pathname}
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showSkipButton
      steps={steps}
      styles={{
        options: {
          arrowColor: '#ffffff',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.65)',
          primaryColor: '#002045',
          textColor: '#181c1e',
          zIndex: 1000,
        },
        tooltipContainer: {
          textAlign: 'left',
          fontFamily: "'Inter', sans-serif",
        },
        buttonNext: {
          backgroundColor: '#002045',
          borderRadius: '8px',
          fontWeight: 600,
          padding: '10px 16px',
        },
        buttonBack: {
          marginRight: 10,
          color: '#43474e',
        },
        buttonSkip: {
          color: '#43474e',
        },
      }}
      locale={{
        back: 'Anterior',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        skip: 'Saltar Tour',
      }}
    />
  )
}
