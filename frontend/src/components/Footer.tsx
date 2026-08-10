export default function Footer() {
  return (
    <footer className="bg-surface-container border-t border-outline-variant">
      <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-8 md:flex-row justify-between items-center">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="text-headline-sm font-bold text-primary">
            MedFuzzy
          </div>
          <p className="text-on-surface text-sm">
            © 2026 MedFuzzy. Sistema basado en Inteligencia Artificial y Lógica Difusa. 
            Proyecto desarrollado para la materia de Inteligencia Artificial.
            Universidad Autónoma de Querétaro — Facultad de Informática.
          </p>
        </div>
        <div className="flex justify-end items-center">
          <img 
            src="/informatica.png" 
            alt="Facultad de Informática UAQ" 
            className="w-48 h-auto object-contain opacity-80 hover:opacity-100 transition-opacity" 
          />
        </div>
      </div>
    </footer>
  )
}
