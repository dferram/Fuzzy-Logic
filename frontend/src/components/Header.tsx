import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/diagnostico-general', label: 'Diagnóstico General' },
  { to: '/diagnostico-especifico', label: 'Diagnóstico Específico' },
]

export default function Header() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-surface-container-lowest sticky top-0 z-50 border-b border-outline-variant shadow-sm animate-fade-in-down">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center w-full px-4 md:px-16 h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-headline-md font-bold text-primary-container tracking-tight hover:text-primary transition-colors duration-200"
        >
          MedFuzzy
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center h-full">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`h-full flex items-center transition-all duration-300 relative ${
                  isActive
                    ? 'text-primary-container font-bold'
                    : 'text-on-surface-variant font-medium hover:text-primary'
                }`}
              >
                {label}
                {/* Animated active indicator */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-primary-container transition-all duration-300 ease-out ${
                    isActive ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        {/* Actions + Mobile Toggle */}
        <div className="flex gap-3 items-center">
          <button
            className="text-on-surface-variant hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95"
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
            className="text-on-surface-variant hover:text-primary transition-all duration-200 hover:scale-110 hover:rotate-90 active:scale-95"
            aria-label="Configuración"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              settings
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-on-surface-variant hover:text-primary transition-all duration-200 ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            <span className="material-symbols-outlined text-[28px]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 mobile-menu-overlay md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute top-16 left-0 right-0 bg-surface-container-lowest border-b border-outline-variant shadow-lg z-50 md:hidden animate-fade-in-down">
            <div className="flex flex-col py-2">
              {navLinks.map(({ to, label }, i) => {
                const isActive = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-6 py-4 transition-all duration-200 animate-fade-in-up ${
                      isActive
                        ? 'text-primary-container font-bold bg-primary-fixed/30 border-l-4 border-primary-container'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary border-l-4 border-transparent'
                    }`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </>
      )}
    </header>
  )
}
