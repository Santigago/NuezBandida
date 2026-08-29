import { useState } from 'react'
import { searchJellyfin } from '../lib/jellyfin.js'

export default function JellyfinStatus({ titulo, tipo, solicitado, onMarkSolicitado }) {
  const [status, setStatus] = useState('idle') // idle | loading | found | not_found | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleCheck() {
    setStatus('loading')
    setError(null)
    try {
      const match = await searchJellyfin(titulo, tipo)
      if (match) {
        setResult(match)
        setStatus('found')
      } else {
        setStatus('not_found')
      }
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  if (status === 'idle') {
    return (
      <button onClick={handleCheck} className="text-xs text-coffee-500 hover:text-[var(--color-primary)] underline">
        🎬 Buscar en Jellyfin
      </button>
    )
  }

  if (status === 'loading') {
    return <p className="text-xs text-coffee-400">Buscando en Jellyfin...</p>
  }

  if (status === 'error') {
    return <p className="text-xs text-burgundy-500">{error}</p>
  }

  if (status === 'found') {
    return (
      <a
        href={result.url}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-[var(--color-primary)] hover:underline font-medium"
      >
        ▶ Ver en Jellyfin
      </a>
    )
  }

  // not_found
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-coffee-400">No está en Jellyfin</span>
      {solicitado ? (
        <span className="text-xs bg-coffee-100 text-coffee-600 px-2 py-0.5 rounded-full">Solicitado ✓</span>
      ) : (
        <button
          onClick={onMarkSolicitado}
          className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-cream hover:opacity-90 transition-opacity"
        >
          + Solicitar
        </button>
      )}
    </div>
  )
}
