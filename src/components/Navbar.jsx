import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/citas', label: 'Citas' },
  { to: '/lugares-por-visitar', label: 'Lugares por Visitar' },
  { to: '/recetas', label: 'Recetas' },
  { to: '/videos-y-links', label: 'Videos y Links' },
  { to: '/tips', label: 'Tips' },
  { to: '/moteles', label: 'Moteles' },
  { to: '/peliculas-y-series', label: 'Películas y Series' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
      isActive
        ? 'bg-[var(--color-accent)] text-cream'
        : 'text-cream/90 hover:bg-white/10'
    }`

  return (
    <header className="bg-[var(--color-primary)] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="font-display text-2xl text-cream tracking-wide">
            NuezBandida
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-cream p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Abrir menú"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="lg:hidden flex flex-col gap-1 px-4 pb-4">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
