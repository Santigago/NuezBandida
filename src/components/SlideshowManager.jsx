import { useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import { deleteImageByUrl } from '../lib/imageUpload.js'
import ImageUploader from './ImageUploader.jsx'

export default function SlideshowManager() {
  const { items, addItem, deleteItem } = useSupabaseTable('fotos_slideshow', {
    orderBy: 'orden',
    ascending: true,
  })
  const [descripcion, setDescripcion] = useState('')
  const [open, setOpen] = useState(false)

  async function handleUploaded(url) {
    await addItem({ url, descripcion, orden: items.length })
    setDescripcion('')
  }

  async function handleDelete(foto) {
    await deleteItem(foto.id)
    deleteImageByUrl(foto.url).catch(() => {})
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-cream hover:opacity-90 transition-opacity shadow-sm"
      >
        {open ? 'Ocultar administrador de fotos' : '+ Agregar o quitar fotos'}
      </button>

      {open && (
        <div className="mt-3 bg-coffee-50 rounded-2xl p-4 space-y-3">
          <div>
            <label className="block text-sm text-coffee-700 mb-1">Descripción (opcional)</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Nuestro primer viaje..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <ImageUploader folder="slideshow" onUploaded={handleUploaded} />

          {items.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
              {items.map((foto) => (
                <div key={foto.id} className="relative group">
                  <img src={foto.url} alt={foto.descripcion || ''} className="w-full h-20 object-cover rounded-lg" />
                  <button
                    onClick={() => {
                      if (window.confirm('¿Eliminar esta foto del slideshow?')) handleDelete(foto)
                    }}
                    className="absolute top-1 right-1 bg-burgundy-500 text-cream text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Eliminar foto"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
