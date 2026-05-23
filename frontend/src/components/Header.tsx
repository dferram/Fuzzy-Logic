import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/diagnostico-general', label: 'Diagnóstico General' },
  { to: '/diagnostico-especifico', label: 'Diagnóstico Específico' },
]

export default function Header() {
  const location = useLocation()

  return (
    <header className="bg-surface-container-lowest sticky top-0 z-50 border-b border-outline-variant shadow-sm">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center w-full px-4 md:px-16 h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-headline-md font-bold text-primary-container tracking-tight"
        >
          MedFuzzy
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 items-center h-full">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`h-full flex items-center transition-colors duration-200 ${
                  isActive
                    ? 'text-primary-container border-b-2 border-primary-container pb-1 font-bold mt-1'
                    : 'text-on-surface-variant font-medium hover:text-primary'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex gap-4 items-center">
          <button
            className="text-on-surface-variant hover:text-primary transition-all opacity-80 hover:opacity-100 hover:scale-95"
            aria-label="Cuenta"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              account_circle
            </span>
          </button>
          <button
            className="text-on-surface-variant hover:text-primary transition-all opacity-80 hover:opacity-100 hover:scale-95"
            aria-label="Configuración"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              settings
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
