import { useMemo, useState } from 'react'
import { useIsAdmin } from '../hooks/useIsAdmin.js'
import Slideshow from '../components/Slideshow.jsx'
import SlideshowManager from '../components/SlideshowManager.jsx'
import Tablero from '../components/Tablero.jsx'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import { useRandomBackground } from '../hooks/useRandomBackground.js'

function Recomendaciones() {
  const { items, loading } = useSupabaseTable('lugares')
  const [seed, setSeed] = useState(0)

  const porVisitar = useMemo(() => items.filter((i) => i.estado === 'por_visitar'), [items])

  const sugeridos = useMemo(() => {
    const shuffled = [...porVisitar].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [porVisitar, seed])

  if (loading) return <p className="text-coffee-500">Cargando recomendaciones...</p>

  if (porVisitar.length === 0) {
    return (
      <div className="rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 p-6 text-coffee-500">
        Agrega lugares marcados como "Por visitar" para ver recomendaciones aquí.
      </div>
    )
  }

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        {sugeridos.map((lugar) => (
          <div key={lugar.id} className="bg-white rounded-xl p-4 border border-coffee-100 shadow-sm">
            <h3 className="font-medium text-coffee-800">{lugar.nombre}</h3>
            {lugar.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {lugar.tags.map((t) => (
                  <span key={t} className="text-xs bg-coffee-100 text-coffee-600 px-2 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => setSeed((s) => s + 1)}
        className="px-4 py-2 rounded-lg border border-coffee-300 text-coffee-700 text-sm hover:bg-coffee-50"
      >
        Ver otras opciones
      </button>
    </div>
  )
}

export default function Home() {
  const background = useRandomBackground()
  const { isAdmin } = useIsAdmin()

  return (
    <div className="relative">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(228, 247, 233, 0.25), rgba(247,239,228,0.25)), url(${background})`,
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <section className="text-center py-6">
          <h1 className="text-4xl text-coffee-800 mb-2">Bienvenidos a NuezBandida</h1>
          <p className="text-coffee-600">Nuestro rincón privado.</p>
        </section>

        <section>
          <Slideshow />
          {isAdmin && <SlideshowManager />}
        </section>

        <section>
          <h2 className="text-2xl text-coffee-800 mb-4">A dónde ir después</h2>
          <Recomendaciones />
        </section>

        <section>
          <h2 className="text-2xl text-coffee-800 mb-4">Tablero</h2>
          <Tablero />
        </section>
      </div>
    </div>
  )
}