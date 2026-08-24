import { useMemo, useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import TagInput from '../components/TagInput.jsx'

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'

const emptyForm = { nombre: '', tags: [], estado: 'por_visitar', notas: '' }

export default function LugaresPorVisitar() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useSupabaseTable('lugares')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')
  const [saving, setSaving] = useState(false)

  const allTags = useMemo(() => {
    const set = new Set()
    items.forEach((i) => (i.tags || []).forEach((t) => set.add(t)))
    return [...set].sort()
  }, [items])

  const filtered = items.filter((i) => {
    const matchesSearch = i.nombre?.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !tagFilter || (i.tags || []).includes(tagFilter)
    const matchesEstado = !estadoFilter || i.estado === estadoFilter
    return matchesSearch && matchesTag && matchesEstado
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
    setForm({ nombre: item.nombre, tags: item.tags || [], estado: item.estado, notas: item.notas || '' })
    setEditingId(item.id)
  }

  async function toggleEstado(item) {
    await updateItem(item.id, { estado: item.estado === 'visitado' ? 'por_visitar' : 'visitado' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl text-coffee-800 mb-2">Lugares por Visitar</h1>
      <p className="text-coffee-600 mb-6">
        Lugares que queremos conocer juntos, con tags y estado.
      </p>

      <form onSubmit={handleSubmit} className="bg-coffee-50 rounded-2xl p-6 mb-8 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
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
            <label className="block text-sm text-coffee-700 mb-1">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className={inputClass}
            >
              <option value="por_visitar">Por visitar</option>
              <option value="visitado">Visitado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-coffee-700 mb-1">Tags</label>
          <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
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
            {editingId ? 'Guardar cambios' : 'Agregar lugar'}
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
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} sm:max-w-xs`}
        />
        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className={`${inputClass} sm:max-w-xs`}>
          <option value="">Todos los tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className={`${inputClass} sm:max-w-xs`}>
          <option value="">Todos los estados</option>
          <option value="por_visitar">Por visitar</option>
          <option value="visitado">Visitado</option>
        </select>
      </div>

      {error && <p className="text-burgundy-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-coffee-500">Cargando...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 p-10 text-center text-coffee-500">
          No hay lugares todavía.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 border border-coffee-100 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-coffee-800">{item.nombre}</h3>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => startEdit(item)} className="text-coffee-500 hover:text-[var(--color-primary)]">Editar</button>
                  <button onClick={() => deleteItem(item.id)} className="text-coffee-500 hover:text-burgundy-500">Eliminar</button>
                </div>
              </div>
              <button
                onClick={() => toggleEstado(item)}
                className={`mt-2 text-xs px-2 py-0.5 rounded-full ${
                  item.estado === 'visitado'
                    ? 'bg-coffee-500 text-cream'
                    : 'bg-coffee-100 text-coffee-600'
                }`}
              >
                {item.estado === 'visitado' ? 'Visitado ✓' : 'Por visitar'}
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