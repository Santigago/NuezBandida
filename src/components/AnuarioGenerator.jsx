import { useMemo, useRef, useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const PAGE_STYLE = {
  width: '794px',
  height: '1123px',
  position: 'relative',
  overflow: 'hidden',
  fontFamily: '"JetBrains Mono", monospace',
}

function topEntry(counts) {
  const entries = Object.entries(counts)
  if (entries.length === 0) return null
  return entries.sort((a, b) => b[1] - a[1])[0]
}

function inYear(dateStr, year) {
  return typeof dateStr === 'string' && dateStr.startsWith(String(year))
}

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function AnuarioGenerator() {
  const { items: citas } = useSupabaseTable('citas')
  const { items: lugares } = useSupabaseTable('lugares')
  const { items: peliculas } = useSupabaseTable('peliculas_series')
  const { items: moteles } = useSupabaseTable('moteles')
  const { items: recuerdos } = useSupabaseTable('recuerdos')

  const [open, setOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const page1Ref = useRef(null)
  const page2Ref = useRef(null)
  const page3Ref = useRef(null)
  const page4Ref = useRef(null)
  const page5Ref = useRef(null)

  const availableYears = useMemo(() => {
    const years = new Set(
      citas.filter((c) => c.fecha).map((c) => Number(c.fecha.slice(0, 4)))
    )
    years.add(new Date().getFullYear())
    return [...years].sort((a, b) => b - a)
  }, [citas])

  const stats = useMemo(() => {
    const citasYear = citas.filter((c) => inYear(c.fecha, selectedYear))
    const citasIntimas = citasYear.filter((c) => c.tipo === 'con_sexo').length
    const citasNormales = citasYear.length - citasIntimas

    const tagCounts = {}
    citasYear.forEach((c) => (c.tags || []).forEach((t) => (tagCounts[t] = (tagCounts[t] || 0) + 1)))
    const topTag = topEntry(tagCounts)

    const monthCounts = {}
    citasYear.forEach((c) => {
      const m = Number(c.fecha.slice(5, 7)) - 1
      monthCounts[m] = (monthCounts[m] || 0) + 1
    })
    const topMonthEntry = topEntry(monthCounts)
    const topMonth = topMonthEntry ? MESES[Number(topMonthEntry[0])] : null

    const lugaresVisitadosYear = lugares.filter(
      (l) => l.estado === 'visitado' && inYear(l.created_at, selectedYear)
    ).length

    const motelesYear = moteles.filter((m) => inYear(m.created_at, selectedYear))
    const motelesPromedio = motelesYear.length
      ? (motelesYear.reduce((sum, m) => sum + (m.calificacion || 0), 0) / motelesYear.length).toFixed(1)
      : null

    const peliculasVistasYear = peliculas.filter(
      (p) => p.visto && inYear(p.created_at, selectedYear) && p.tipo === 'pelicula'
    ).length
    const seriesVistasYear = peliculas.filter(
      (p) => p.visto && inYear(p.created_at, selectedYear) && p.tipo === 'serie'
    ).length

    const recuerdosYear = recuerdos.filter((r) => inYear(r.created_at, selectedYear))
    const fotosDelAno = shuffle(recuerdosYear.filter((r) => r.foto_url))
    const coverPhoto = fotosDelAno[0]?.foto_url || null
    const collageFotos = fotosDelAno.slice(1, 5)

    return {
      totalCitas: citasYear.length,
      citasIntimas,
      citasNormales,
      topTag: topTag ? topTag[0] : null,
      topMonth,
      topMonthCount: topMonthEntry ? topMonthEntry[1] : 0,
      lugaresVisitadosYear,
      motelesCount: motelesYear.length,
      motelesPromedio,
      peliculasVistasYear,
      seriesVistasYear,
      tableroCount: recuerdosYear.length,
      collageFotos,
      coverPhoto,
    }
  }, [citas, lugares, moteles, peliculas, recuerdos, selectedYear])

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])

      // Dar tiempo a que las imágenes terminen de cargar
      await new Promise((resolve) => setTimeout(resolve, 300))

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const refs = [page1Ref, page2Ref, page3Ref, page4Ref, page5Ref]

      for (let i = 0; i < refs.length; i++) {
        const canvas = await html2canvas(refs[i].current, {
          useCORS: true,
          allowTaint: true,
          scale: 2,
          backgroundColor: '#f7efe4',
        })
        const img = canvas.toDataURL('image/jpeg', 0.92)
        if (i > 0) pdf.addPage()
        pdf.addImage(img, 'JPEG', 0, 0, 210, 297)
      }

      pdf.save(`Anuario-NuezBandida-${selectedYear}.pdf`)
    } catch (err) {
      setError('No se pudo generar el PDF: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-cream text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
      >
        🎉 Generar Anuario
      </button>

      {open && (
        <div className="mt-3 bg-coffee-50 rounded-2xl p-4 flex flex-wrap items-center gap-3">
          <label className="text-sm text-coffee-700">Año:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg border border-[var(--color-primary-light)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-1.5 rounded-lg bg-[var(--color-primary)] text-cream text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {generating ? 'Generando...' : 'Descargar PDF'}
          </button>
          {error && <p className="text-xs text-burgundy-500 w-full">{error}</p>}
        </div>
      )}

      {/* Páginas ocultas usadas para generar el PDF */}
      <div style={{ position: 'fixed', top: 0, left: '-10000px' }}>
        {/* Página 1 — Portada */}
        <div
          ref={page1Ref}
          style={{
            ...PAGE_STYLE,
            background: 'linear-gradient(160deg, #6d071a 0%, #4b3621 55%, #2a1e12 100%)',
            color: '#f7efe4',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 28, letterSpacing: 4, opacity: 0.85 }}>♥ ♥ ♥</p>
          <h1 style={{ fontSize: 64, margin: '20px 0 0' }}>Anuario</h1>
          <p style={{ fontSize: 96, fontWeight: 700, margin: '10px 0' }}>{selectedYear}</p>
          <p style={{ fontSize: 22, opacity: 0.85, marginBottom: 40 }}>NuezBandida</p>

          {stats.coverPhoto && (
            <div
              style={{
                background: '#fff',
                padding: 12,
                borderRadius: 8,
                transform: 'rotate(-3deg)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }}
            >
              <img
                src={stats.coverPhoto}
                crossOrigin="anonymous"
                alt=""
                style={{ width: 320, height: 320, objectFit: 'cover', borderRadius: 2 }}
              />
            </div>
          )}

          <p style={{ position: 'absolute', bottom: 50, fontSize: 16, opacity: 0.6 }}>
            un año más, juntos
          </p>
        </div>

        {/* Página 2 — Citas */}
        <div
          ref={page2Ref}
          style={{ ...PAGE_STYLE, background: '#f7efe4', color: '#3b2b1a', padding: 60 }}
        >
          <p style={{ fontSize: 16, color: '#6f4e37', letterSpacing: 2 }}>{selectedYear}</p>
          <h2 style={{ fontSize: 44, margin: '4px 0 40px' }}>Nuestro año en citas 💕</h2>

          <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: 30, textAlign: 'center' }}>
              <p style={{ fontSize: 72, fontWeight: 700, color: '#6d071a', margin: 0 }}>{stats.totalCitas}</p>
              <p style={{ fontSize: 16, color: '#6f4e37' }}>citas en total</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
            <div style={{ flex: 1, background: '#e9dccb', borderRadius: 20, padding: 24, textAlign: 'center' }}>
              <p style={{ fontSize: 40, fontWeight: 700, color: '#4b3621', margin: 0 }}>{stats.citasNormales}</p>
              <p style={{ fontSize: 14, color: '#6f4e37' }}>♥ citas normales</p>
            </div>
            <div style={{ flex: 1, background: '#f0c3cd', borderRadius: 20, padding: 24, textAlign: 'center' }}>
              <p style={{ fontSize: 40, fontWeight: 700, color: '#6d071a', margin: 0 }}>{stats.citasIntimas}</p>
              <p style={{ fontSize: 14, color: '#6d071a' }}>♥ citas íntimas</p>
            </div>
          </div>

          {stats.topMonth && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: '#8a6242', margin: 0 }}>Mes más activo</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: '#3b2b1a', margin: '4px 0' }}>
                {stats.topMonth} — {stats.topMonthCount} {stats.topMonthCount === 1 ? 'cita' : 'citas'}
              </p>
            </div>
          )}

          {stats.topTag && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 24 }}>
              <p style={{ fontSize: 14, color: '#8a6242', margin: 0 }}>Tag favorito</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: '#3b2b1a', margin: '4px 0' }}>
                #{stats.topTag}
              </p>
            </div>
          )}
        </div>

        {/* Página 3 — Descubrimientos */}
        <div
          ref={page3Ref}
          style={{ ...PAGE_STYLE, background: '#f7efe4', color: '#3b2b1a', padding: 60 }}
        >
          <p style={{ fontSize: 16, color: '#6f4e37', letterSpacing: 2 }}>{selectedYear}</p>
          <h2 style={{ fontSize: 44, margin: '4px 0 40px' }}>Lo que exploramos 🧭</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 30, display: 'flex', alignItems: 'center', gap: 24 }}>
              <p style={{ fontSize: 56, fontWeight: 700, color: '#6d071a', margin: 0, minWidth: 100 }}>
                {stats.lugaresVisitadosYear}
              </p>
              <p style={{ fontSize: 18, color: '#4b3621' }}>lugares nuevos visitados</p>
            </div>

            <div style={{ background: '#fff', borderRadius: 20, padding: 30, display: 'flex', alignItems: 'center', gap: 24 }}>
              <p style={{ fontSize: 56, fontWeight: 700, color: '#6d071a', margin: 0, minWidth: 100 }}>
                {stats.motelesCount}
              </p>
              <div>
                <p style={{ fontSize: 18, color: '#4b3621', margin: 0 }}>moteles calificados</p>
                {stats.motelesPromedio && (
                  <p style={{ fontSize: 14, color: '#8a6242', margin: '4px 0 0' }}>
                    promedio: {'★'.repeat(Math.round(stats.motelesPromedio))} ({stats.motelesPromedio})
                  </p>
                )}
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 20, padding: 30, display: 'flex', alignItems: 'center', gap: 24 }}>
              <p style={{ fontSize: 56, fontWeight: 700, color: '#6d071a', margin: 0, minWidth: 100 }}>
                {stats.peliculasVistasYear + stats.seriesVistasYear}
              </p>
              <p style={{ fontSize: 18, color: '#4b3621' }}>
                películas y series vistas
                <br />
                <span style={{ fontSize: 14, color: '#8a6242' }}>
                  {stats.peliculasVistasYear} películas · {stats.seriesVistasYear} series
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Página 4 — Tablero */}
        <div
          ref={page4Ref}
          style={{ ...PAGE_STYLE, background: '#f7efe4', color: '#3b2b1a', padding: 60 }}
        >
          <p style={{ fontSize: 16, color: '#6f4e37', letterSpacing: 2 }}>{selectedYear}</p>
          <h2 style={{ fontSize: 44, margin: '4px 0 40px' }}>Nuestro tablero 📌</h2>

          <div style={{ background: '#fff', borderRadius: 20, padding: 30, textAlign: 'center', marginBottom: 30 }}>
            <p style={{ fontSize: 72, fontWeight: 700, color: '#6d071a', margin: 0 }}>{stats.tableroCount}</p>
            <p style={{ fontSize: 16, color: '#6f4e37' }}>publicaciones este año</p>
          </div>

          {stats.collageFotos.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {stats.collageFotos.map((recuerdo, i) => (
                <img
                  key={recuerdo.id || i}
                  src={recuerdo.foto_url}
                  crossOrigin="anonymous"
                  alt=""
                  style={{
                    width: '100%',
                    height: 260,
                    objectFit: 'cover',
                    borderRadius: 16,
                    transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Página 5 — Cierre */}
        <div
          ref={page5Ref}
          style={{
            ...PAGE_STYLE,
            background: 'linear-gradient(160deg, #2a1e12 0%, #4b3621 55%, #6d071a 100%)',
            color: '#f7efe4',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 60,
          }}
        >
          <p style={{ fontSize: 28, letterSpacing: 4, opacity: 0.85, marginBottom: 20 }}>♥ ♥ ♥</p>
          <h2 style={{ fontSize: 42, marginBottom: 20 }}>Gracias por otro año juntos</h2>
          <p style={{ fontSize: 18, opacity: 0.85, maxWidth: 480, lineHeight: 1.6 }}>
            Por cada cita, cada lugar nuevo, cada noche de película y cada nota en el tablero.
            Aquí vamos por más.
          </p>
          <p style={{ marginTop: 60, fontSize: 16, opacity: 0.6 }}>NuezBandida · {selectedYear}</p>
        </div>
      </div>
    </div>
  )
}
