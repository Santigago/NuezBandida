import { useMemo, useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function Calendario() {
  const { items: citas, loading } = useSupabaseTable('citas')
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(null)

  const citasByDate = useMemo(() => {
    const map = {}
    citas.forEach((c) => {
      if (!c.fecha) return
      if (!map[c.fecha]) map[c.fecha] = []
      map[c.fecha].push(c)
    })
    return map
  }, [citas])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOffset = getFirstDayOfWeek(year, month)
  const todayStr = today.toISOString().slice(0, 10)

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelected(null)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  function dateStr(day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  // For a date, determine the "dominant" tipo to decide heart color
  // If any cita that day is con_sexo → burgundy, otherwise coffee
  function heartColor(ds) {
    const list = citasByDate[ds] || []
    const hasIntima = list.some((c) => c.tipo === 'con_sexo')
    return hasIntima ? 'text-burgundy-500' : 'text-coffee-500'
  }

  const selectedCitas = selected ? (citasByDate[selected] || []) : []

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl text-coffee-800 mb-2">Calendario</h1>
      <p className="text-coffee-600 mb-6">Todas nuestras citas en el tiempo.</p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="px-3 py-1.5 rounded-lg border border-coffee-300 text-coffee-700 hover:bg-coffee-50 text-sm"
            >
              ← Anterior
            </button>
            <h2 className="text-xl text-coffee-800">
              {MESES[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="px-3 py-1.5 rounded-lg border border-coffee-300 text-coffee-700 hover:bg-coffee-50 text-sm"
            >
              Siguiente →
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-coffee-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 border-b border-coffee-100">
              {DIAS.map((d) => (
                <div key={d} className="text-center text-xs text-coffee-400 py-2 font-medium">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {Array.from({ length: firstDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="h-14 border-b border-r border-coffee-50" />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const ds = dateStr(day)
                const hasCita = Boolean(citasByDate[ds]?.length)
                const isToday = ds === todayStr
                const isSelected = ds === selected
                const hColor = hasCita ? heartColor(ds) : ''

                return (
                  <button
                    key={day}
                    onClick={() => setSelected(isSelected ? null : ds)}
                    className={`h-14 border-b border-r border-coffee-50 flex flex-col items-center justify-start pt-1.5 gap-0.5 transition-colors
                      ${isSelected ? 'bg-coffee-100' : 'hover:bg-coffee-50/60'}
                    `}
                  >
                    <span
                      className={`text-sm w-7 h-7 flex items-center justify-center rounded-full
                        ${isToday ? 'bg-[var(--color-primary)] text-cream font-medium' : 'text-coffee-700'}
                      `}
                    >
                      {day}
                    </span>
                    {hasCita && (
                      <span className={`text-base leading-none ${hColor}`}>♥</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {selected && (
            <div className="mt-4 bg-coffee-50 rounded-2xl p-4">
              <p className="text-sm font-medium text-coffee-700 mb-3">
                {new Date(selected + 'T12:00:00').toLocaleDateString('es', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              {selectedCitas.length === 0 ? (
                <p className="text-sm text-coffee-500">Sin citas este día.</p>
              ) : (
                <div className="space-y-2">
                  {selectedCitas.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl p-3 border border-coffee-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-coffee-800 text-sm">{c.lugar}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            c.tipo === 'con_sexo'
                              ? 'bg-burgundy-500 text-cream'
                              : 'bg-coffee-500 text-cream'
                          }`}
                        >
                          {c.tipo === 'con_sexo' ? '♥ Íntima' : '♥ Normal'}
                        </span>
                      </div>
                      {c.notas && <p className="text-xs text-coffee-600 mt-1">{c.notas}</p>}
                      {c.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {c.tags.map((t) => (
                            <span key={t} className="text-xs bg-coffee-100 text-coffee-600 px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-coffee-300 mt-1">— {c.creado_por}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 text-xs text-coffee-500">
            <span className="flex items-center gap-1.5">
              <span className="text-coffee-500 text-sm">♥</span> Cita normal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-burgundy-500 text-sm">♥</span> Cita íntima
            </span>
          </div>
        </>
      )}
    </div>
  )
}