import { useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import StarRating from '../components/StarRating.jsx'

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'

const emptyForm = { nombre: '', calificacion: 0, notas: '' }

export default function Moteles() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useSupabaseTable('moteles')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = items.filter((i) => i.nombre?.toLowerCase().includes(search.toLowerCase()))

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
    setForm({ nombre: item.nombre, calificacion: item.calificacion || 0, notas: item.notas || '' })
    setEditingId(item.id)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl text-burgundy-700 mb-2">Moteles</h1>
      <p className="text-coffee-600 mb-6">Calificación y notas de los moteles donde nos hemos quedado.</p>

      <form onSubmit={handleSubmit} className="bg-burgundy-50 rounded-2xl p-6 mb-8 space-y-4">
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
          <label className="block text-sm text-coffee-700 mb-1">Calificación</label>
          <StarRating value={form.calificacion} onChange={(v) => setForm({ ...form, calificacion: v })} />
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
            {editingId ? 'Guardar cambios' : 'Agregar motel'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-coffee-300 text-coffee-700">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <input
        type="text"
        placeholder="Buscar motel..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`${inputClass} sm:max-w-xs mb-6`}
      />

      {error && <p className="text-burgundy-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-coffee-500">Cargando...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-burgundy-50 border-2 border-dashed border-burgundy-200 p-10 text-center text-burgundy-400">
          No hay moteles todavía.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 border border-burgundy-100 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-coffee-800">{item.nombre}</h3>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => startEdit(item)} className="text-coffee-500 hover:text-[var(--color-primary)]">Editar</button>
                  <button onClick={() => deleteItem(item.id)} className="text-coffee-500 hover:text-burgundy-500">Eliminar</button>
                </div>
              </div>
              <div className="mt-1">
                <StarRating value={item.calificacion || 0} readOnly />
              </div>
              {item.notas && <p className="text-sm text-coffee-600 mt-2">{item.notas}</p>}
              <p className="text-xs text-coffee-300 mt-2">— {item.creado_por}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}