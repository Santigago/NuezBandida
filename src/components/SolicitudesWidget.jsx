import { useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'

export default function SolicitudesWidget() {
  const { items, loading, updateItem } = useSupabaseTable('peliculas_series')
  const [open, setOpen] = useState(false)

  const solicitadas = items.filter((i) => i.jellyfin_solicitado)

  if (loading || solicitadas.length === 0) return null

  async function handleResolved(item) {
    await updateItem(item.id, { jellyfin_solicitado: false })
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="mb-2 w-72 max-w-[85vw] bg-white rounded-2xl border border-coffee-200 shadow-lg p-4 max-h-80 overflow-y-auto">
          <p className="text-sm font-medium text-coffee-700 mb-3">Solicitadas para Jellyfin</p>
          <div className="space-y-2">
            {solicitadas.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2 bg-coffee-50 rounded-lg p-2">
                <div className="min-w-0">
                  <p className="text-sm text-coffee-800 truncate">{item.titulo}</p>
                  <p className="text-xs text-coffee-400">{item.tipo === 'serie' ? 'Serie' : 'Película'}</p>
                </div>
                <button
                  onClick={() => handleResolved(item)}
                  className="text-xs px-2 py-1 rounded-full bg-[var(--color-primary)] text-cream hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Ya agregada
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-11 h-11 rounded-full bg-[var(--color-primary)] text-cream shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label="Ver solicitudes de Jellyfin"
      >
        <span className="text-lg leading-none">🎬</span>
        <span className="absolute -top-1 -right-1 bg-burgundy-500 text-cream text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
          {solicitadas.length}
        </span>
      </button>
    </div>
  )
}
