import { useMemo, useState } from 'react'
import Slideshow from '../components/Slideshow.jsx'
import SlideshowManager from '../components/SlideshowManager.jsx'
import Tablero from '../components/Tablero.jsx'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import { useRandomBackground } from '../hooks/useRandomBackground.js'
import { useIsAdmin } from '../hooks/useIsAdmin.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const POOL_SIZE = 6
const SUGGESTED_COUNT = 3
const NEVER_DONE_DAYS = 9999

function daysSince(dateStr) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return null
  return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
}

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function Recomendaciones() {
  const { items: lugares, loading: loadingLugares } = useSupabaseTable('lugares')
  const { items: citas, loading: loadingCitas } = useSupabaseTable('citas')
  const [seed, setSeed] = useState(0)

  const loading = loadingLugares || loadingCitas

  // Última vez (en días) que cada tag apareció en una cita
  const tagLastVisitDays = useMemo(() => {
    const lastDate = {}
    citas.forEach((cita) => {
      if (!cita.fecha) return
      ;(cita.tags || []).forEach((tag) => {
        if (!lastDate[tag] || new Date(cita.fecha) > new Date(lastDate[tag])) {
          lastDate[tag] = cita.fecha
        }
      })
    })
    const days = {}
    Object.entries(lastDate).forEach(([tag, fecha]) => {
      days[tag] = daysSince(fecha)
    })
    return days
  }, [citas])

  const scored = useMemo(() => {
    const porVisitar = lugares.filter((l) => l.estado === 'por_visitar')

    return porVisitar
      .map((lugar) => {
        const tags = lugar.tags || []
        if (tags.length === 0) {
          return { lugar, score: 0, reason: null }
        }

        const stalenessPerTag = tags.map((t) => ({
          tag: t,
          staleness: tagLastVisitDays[t] ?? NEVER_DONE_DAYS,
        }))

        const score =
          stalenessPerTag.reduce((sum, t) => sum + t.staleness, 0) / stalenessPerTag.length

        const staleTag = stalenessPerTag.reduce((a, b) => (b.staleness > a.staleness ? b : a))
        const reason =
          staleTag.staleness >= NEVER_DONE_DAYS
            ? `Nunca hemos ido a algo de "${staleTag.tag}"`
            : staleTag.staleness > 30
            ? `Hace ${Math.round(staleTag.staleness)} días no hacemos algo de "${staleTag.tag}"`
            : null

        return { lugar, score, reason }
      })
      .sort((a, b) => b.score - a.score)
  }, [lugares, tagLastVisitDays])

  const pool = useMemo(() => scored.slice(0, POOL_SIZE), [scored])

  const sugeridos = useMemo(() => pickRandom(pool, SUGGESTED_COUNT), [pool, seed])

  if (loading) return <LoadingSpinner label="Cargando recomendaciones..." />

  if (scored.length === 0) {
    return (
      <div className="rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 p-6 text-coffee-500">
        Agrega lugares marcados como "Por visitar" para ver recomendaciones aquí.
      </div>
    )
  }

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        {sugeridos.map(({ lugar, reason }) => (
          <div key={lugar.id} className="card-hover bg-white rounded-xl p-4 border border-coffee-100 shadow-sm">
            <h3 className="font-medium text-coffee-800">{lugar.nombre}</h3>
            {reason && <p className="text-xs text-[var(--color-primary)] mt-1">{reason}</p>}
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
          backgroundImage: `linear-gradient(rgba(247,239,228,0.35), rgba(247,239,228,0.35)), url(${background})`,
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <section>
          <Slideshow />
          {isAdmin && <SlideshowManager />}
        </section>

        <section>
          <h2 className="text-2xl text-coffee-800 mb-4">Donde vamos?</h2>
          <Recomendaciones />
        </section>

        <section>
          <h2 className="text-2xl text-coffee-800 mb-4">Nosotros</h2>
          <Tablero />
        </section>
      </div>
    </div>
  )
}