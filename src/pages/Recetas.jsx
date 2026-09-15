import { useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import TagSelector from '../components/TagSelector.jsx'
import FilterMenu from '../components/FilterMenu.jsx'
import FilterChipGroup from '../components/FilterChipGroup.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import InstagramEmbed from '../components/InstagramEmbed.jsx'
import { RECETA_TAG_OPTIONS } from '../lib/tagOptionsRecetas.js'

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'

const emptyForm = { nombre: '', url: '', tags: [] }

export default function Recetas() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useSupabaseTable('recetas')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState([])
  const [tagMatchMode, setTagMatchMode] = useState('or')
  const [saving, setSaving] = useState(false)

  const filtered = items.filter((i) => {
    const matchesSearch = i.nombre?.toLowerCase().includes(search.toLowerCase())
    const itemTags = i.tags || []
    const matchesTag =
      tagFilter.length === 0 ||
      (tagMatchMode === 'and'
        ? tagFilter.every((t) => itemTags.includes(t))
        : tagFilter.some((t) => itemTags.includes(t)))
    return matchesSearch && matchesTag
  })

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
    setForm({ nombre: item.nombre, url: item.url || '', tags: item.tags || [] })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl text-coffee-800 mb-2">Recetas</h1>
      <p className="text-coffee-600 mb-6">Recetas de Instagram que queremos probar o ya cocinamos.</p>

      <form onSubmit={handleSubmit} className="bg-coffee-50 rounded-2xl p-6 mb-8 space-y-4">
        <div>
          <label className="block text-sm text-coffee-700 mb-1">Nombre</label>
          <input
            type="text"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm text-coffee-700 mb-1">Link de Instagram</label>
          <input
            type="url"
            required
            placeholder="https://www.instagram.com/reel/..."
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm text-coffee-700 mb-1">Tags</label>
          <TagSelector tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} options={RECETA_TAG_OPTIONS} />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-cream font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {editingId ? 'Guardar cambios' : 'Agregar receta'}
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
          placeholder="Buscar receta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} sm:max-w-xs`}
        />
        <FilterMenu activeCount={tagFilter.length}>
          <FilterChipGroup
            title="Tags"
            options={RECETA_TAG_OPTIONS.map((t) => ({ value: t, label: t }))}
            value={tagFilter}
            onChange={setTagFilter}
            matchMode={tagMatchMode}
            onMatchModeChange={setTagMatchMode}
          />
        </FilterMenu>
      </div>

      {error && <p className="text-burgundy-500 mb-4">{error}</p>}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 p-10 text-center text-coffee-500">
          No hay recetas todavía.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 items-start">
          {filtered.map((item) => (
            <div key={item.id} className="card-hover bg-white rounded-xl p-4 border border-coffee-100 shadow-sm flex flex-col justify-between">
              <div>
                {item.url && <InstagramEmbed url={item.url} title={item.nombre} />}

                <div className="flex justify-between items-start gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[var(--color-primary)] hover:underline flex items-center gap-1 text-base group"
                  >
                    <span>{item.nombre}</span>
                    <span className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </a>
                  <div className="flex gap-2 text-sm flex-shrink-0">
                    <button onClick={() => startEdit(item)} className="text-coffee-500 hover:text-[var(--color-primary)]">Editar</button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar la receta "${item.nombre}"?`)) deleteItem(item.id)
                      }}
                      className="text-coffee-500 hover:text-burgundy-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {item.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((t) => (
                      <span key={t} className="text-xs bg-coffee-100 text-coffee-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-coffee-300 mt-3 pt-2 border-t border-coffee-50">— {item.creado_por}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}