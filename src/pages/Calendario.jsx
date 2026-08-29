import { useMemo, useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import TagSelector from '../components/TagSelector.jsx'
import { TAG_OPTIONS } from '../lib/tagOptions.js'
import { mapsSearchUrl } from '../lib/googleMaps.js'

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

const TIPO_OPTIONS = [
  { value: 'sin_sexo', label: 'Cita normal' },
  { value: 'con_sexo', label: 'Cita íntima' },
]

const emptyQuickForm = { lugar: '', tags: [], notas: '', tipo: 'sin_sexo' }

export default function Calendario() {
  const { items: citas, loading, addItem } = useSupabaseTable('citas')
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(null)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [quickForm, setQuickForm] = useState(emptyQuickForm)
  const [saving, setSaving] = useState(false)

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
    setQuickAddOpen(false)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null)
    setQuickAddOpen(false)
  }

  function dateStr(day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function heartColor(ds) {
    const list = citasByDate[ds] || []
    const hasIntima = list.some((c) => c.tipo === 'con_sexo')
    return hasIntima ? 'text-burgundy-500' : 'text-coffee-500'
  }

  function selectDay(ds) {
    const isSame = ds === selected
    setSelected(isSame ? null : ds)
    setQuickAddOpen(false)
    setQuickForm(emptyQuickForm)
  }

  async function handleQuickAdd(e) {
    e.preventDefault()
    if (!quickForm.lugar.trim()) return
    setSaving(true)
    try {
      await addItem({ ...quickForm, fecha: selected })
      setQuickForm(emptyQuickForm)
      setQuickAddOpen(false)
    } finally {
      setSaving(false)
    }
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
                    onClick={() => selectDay(ds)}
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
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-sm text-coffee-500">Sin citas este día.</p>
                  {!quickAddOpen && (
                    <button
                      onClick={() => setQuickAddOpen(true)}
                      className="text-xs px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-cream hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                      + Agregar cita
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2 mb-3">
                  {selectedCitas.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl p-3 border border-coffee-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <a
                          href={mapsSearchUrl(c.lugar)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-coffee-800 text-sm hover:text-[var(--color-primary)] hover:underline flex items-center gap-1"
                        >
                          <span>📍</span> {c.lugar}
                        </a>
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

              {quickAddOpen && (
                <form onSubmit={handleQuickAdd} className="bg-white rounded-xl p-4 border border-coffee-100 space-y-3">
                  <div>
                    <label className="block text-xs text-coffee-700 mb-1">Lugar</label>
                    <input
                      type="text"
                      required
                      value={quickForm.lugar}
                      onChange={(e) => setQuickForm({ ...quickForm, lugar: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-coffee-700 mb-1">Tipo</label>
                    <div className="flex gap-2">
                      {TIPO_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setQuickForm({ ...quickForm, tipo: opt.value })}
                          className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                            quickForm.tipo === opt.value
                              ? opt.value === 'con_sexo'
                                ? 'bg-burgundy-500 border-burgundy-500 text-cream'
                                : 'bg-coffee-700 border-coffee-700 text-cream'
                              : 'bg-white border-coffee-200 text-coffee-600 hover:border-coffee-400'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-coffee-700 mb-1">Tags</label>
                    <TagSelector
                      tags={quickForm.tags}
                      onChange={(tags) => setQuickForm({ ...quickForm, tags })}
                      options={TAG_OPTIONS}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-coffee-700 mb-1">Notas</label>
                    <textarea
                      value={quickForm.notas}
                      onChange={(e) => setQuickForm({ ...quickForm, notas: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-cream text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {saving ? 'Guardando...' : 'Guardar cita'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setQuickAddOpen(false); setQuickForm(emptyQuickForm) }}
                      className="px-3 py-1.5 rounded-lg border border-coffee-300 text-coffee-700 text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
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
