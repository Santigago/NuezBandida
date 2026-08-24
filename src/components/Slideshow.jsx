import { useEffect, useMemo, useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'

const INTERVAL_MS = 5000

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function Slideshow() {
  const { items, loading, error } = useSupabaseTable('fotos_slideshow', {
    orderBy: 'orden',
    ascending: true,
  })
  const [index, setIndex] = useState(0)

  // Se mezcla una sola vez por carga/visita, no en cada render
  const shuffled = useMemo(() => shuffle(items), [items.length])

  useEffect(() => {
    if (shuffled.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % shuffled.length), INTERVAL_MS)
    return () => clearInterval(id)
  }, [shuffled.length])

  if (loading) {
    return (
      <div className="h-64 sm:h-96 rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 flex items-center justify-center text-coffee-500">
        Cargando fotos...
      </div>
    )
  }

  if (error || shuffled.length === 0) {
    return (
      <div className="h-64 sm:h-96 rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 flex items-center justify-center text-coffee-500 text-center px-4">
        Agregar imagenes
      </div>
    )
  }

  return (
    <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-coffee-900">
      {shuffled.map((foto, i) => (
        <img
          key={foto.id}
          src={foto.url}
          alt={foto.descripcion || 'Foto de nosotros'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {shuffled.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {shuffled.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir a la foto ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-cream' : 'bg-cream/40'}`}
            />
          ))}
        </div>
      )}

      {shuffled[index]?.descripcion && (
        <p className="absolute bottom-8 left-0 right-0 text-center text-cream text-sm px-4">
          {shuffled[index].descripcion}
        </p>
      )}
    </div>
  )
}