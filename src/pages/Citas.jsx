import { useMemo, useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import TagSelector from '../components/TagSelector.jsx'
import FilterMenu from '../components/FilterMenu.jsx'
import FilterChipGroup from '../components/FilterChipGroup.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { TAG_OPTIONS } from '../lib/tagOptions.js'

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'

const emptyForm = { lugar: '', fecha: '', tags: [], notas: '', tipo: 'sin_sexo' }

const TIPO_OPTIONS = [
  { value: 'sin_sexo', label: 'Cita normal' },
  { value: 'con_sexo', label: 'Cita íntima' },
]

export default function Citas() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useSupabaseTable('citas')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [tipoFilter, setTipoFilter] = useState('')
  const [saving, setSaving] = useState(false)

  const allTags = useMemo(() => {
    const set = new Set()
    items.forEach((i) => (i.tags || []).forEach((t) => set.add(t)))
    return [...set].sort()
  }, [items])

  const filtered = items.filter((i) => {
    const matchesSearch = i.lugar?.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !tagFilter || (i.tags || []).includes(tagFilter)
    const matchesTipo = !tipoFilter || i.tipo === tipoFilter
    return matchesSearch && matchesTag && matchesTipo
  })

  const activeFilterCount = (tagFilter ? 1 : 0) + (tipoFilter ? 1 : 0)

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) await updateItem(editingId, form)
      else await addItem(form)
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  function startEdit(item) {
    setForm({
      lugar: item.lugar,
      fecha: item.fecha || '',
      tags: item.tags || [],
      notas: item.notas || '',
      tipo: item.tipo || 'sin_sexo',
    })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function toggleTipo(item) {
    await updateItem(item.id, { tipo: item.tipo === 'con_sexo' ? 'sin_sexo' : 'con_sexo' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl text-coffee-800 mb-2">Citas</h1>
      <p className="text-coffee-600 mb-6">
        Registro de nuestras citas: dónde fuimos, cuándo, y cómo nos fue.
      </p>

      <form onSubmit={handleSubmit} className="bg-coffee-50 rounded-2xl p-6 mb-8 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-coffee-700 mb-1">Lugar</label>
            <input
              type="text"
              required
              value={form.lugar}
              onChange={(e) => setForm({ ...form, lugar: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-coffee-700 mb-1">Fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-coffee-700 mb-1">Tipo de cita</label>
          <div className="flex gap-3">
            {TIPO_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, tipo: opt.value })}
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                  form.tipo === opt.value
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
          <label className="block text-sm text-coffee-700 mb-1">Tags</label>
          <TagSelector tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} options={TAG_OPTIONS} />
        </div>

        <div>
          <label className="block text-sm text-coffee-700 mb-1">Notas</label>
          <textarea
            value={form.notas}
            onChange={(e) => setForm({ ...form, notas: e.target.value })}
            rows={2}
            className={inputClass}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-cream font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {editingId ? 'Guardar cambios' : 'Agregar cita'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-coffee-300 text-coffee-700">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por lugar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} sm:max-w-xs`}
        />
        <FilterMenu activeCount={activeFilterCount}>
          <FilterChipGroup
            title="Tipo de cita"
            options={TIPO_OPTIONS}
            value={tipoFilter}
            onChange={setTipoFilter}
          />
          <FilterChipGroup
            title="Tags"
            options={allTags.map((t) => ({ value: t, label: t }))}
            value={tagFilter}
            onChange={setTagFilter}
          />
        </FilterMenu>
      </div>

      {error && <p className="text-burgundy-500 mb-4">{error}</p>}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 p-10 text-center text-coffee-500">
          No hay citas todavía.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="card-hover bg-white rounded-xl p-4 border border-coffee-100 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-coffee-800">{item.lugar}</h3>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => startEdit(item)} className="text-coffee-500 hover:text-[var(--color-primary)]">Editar</button>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar la cita en "${item.lugar}"?`)) deleteItem(item.id)
                    }}
                    className="text-coffee-500 hover:text-burgundy-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              {item.fecha && <p className="text-xs text-coffee-400 mt-1">{item.fecha}</p>}

              {/* Tipo badge */}
              <button
                onClick={() => toggleTipo(item)}
                className={`mt-2 text-xs px-2 py-0.5 rounded-full ${
                  item.tipo === 'con_sexo'
                    ? 'bg-burgundy-500 text-cream'
                    : 'bg-coffee-500 text-cream'
                }`}
              >
                {item.tipo === 'con_sexo' ? '♥ Cita íntima' : '♥ Cita normal'}
              </button>

              {item.notas && <p className="text-sm text-coffee-600 mt-2">{item.notas}</p>}
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((t) => (
                    <span key={t} className="text-xs bg-coffee-100 text-coffee-600 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              )}
              <p className="text-xs text-coffee-300 mt-2">— {item.creado_por}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
