export default function Footer() {
  return (
    <footer className="bg-surface-container border-t border-outline-variant">
      <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-8 md:flex-row justify-between items-start">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="text-headline-sm font-bold text-primary">
            MedFuzzy
          </div>
          <p className="text-on-surface text-sm">
            © 2026 MedFuzzy. Clinical Decision-Support System. Academic credits
            to Universidad Autónoma de Querétaro — Facultad de Informática. All
            rights reserved. Disclaimer: For academic use only.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <a
            className="text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Aviso Legal
          </a>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Privacidad
          </a>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Créditos Académicos
          </a>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Contacto
          </a>
        </div>
      </div>
    </footer>
  )
}
