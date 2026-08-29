import { useMemo, useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import StarRating from '../components/StarRating.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import TagSelector from '../components/TagSelector.jsx'
import FilterMenu from '../components/FilterMenu.jsx'
import FilterChipGroup from '../components/FilterChipGroup.jsx'
import { JUEGO_TAG_OPTIONS } from '../lib/tagOptionsJuegos.js'

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'

// ─── Productos ───────────────────────────────────────────────────────────────

const emptyProducto = { nombre: '', tipo: '', calificacion: 0, notas: '' }

const TIPO_OPTIONS = [
  'vibrador', 'dildo', 'lubricante', 'aceite', 'juego', 'lencería', 'otro',
]

function Productos() {
  const { items, loading, error, addItem, updateItem, deleteItem } =
    useSupabaseTable('productos_intimos')
  const [form, setForm] = useState(emptyProducto)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = items.filter((i) =>
    i.nombre?.toLowerCase().includes(search.toLowerCase())
  )

  function resetForm() { setForm(emptyProducto); setEditingId(null) }

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
        nombre: item.nombre,
        tipo: item.tipo || '',
        calificacion: item.calificacion || 0,
        notas: item.notas || '',
    })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-burgundy-50 rounded-2xl p-6 space-y-4">
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
            <label className="block text-sm text-coffee-700 mb-1">Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className={inputClass}
            >
              <option value="">Sin categoría</option>
              {TIPO_OPTIONS.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
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
            {editingId ? 'Guardar cambios' : 'Agregar producto'}
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
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`${inputClass} sm:max-w-xs`}
      />

      {error && <p className="text-burgundy-500">{error}</p>}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-burgundy-50 border-2 border-dashed border-burgundy-200 p-10 text-center text-burgundy-400">
          No hay productos todavía.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="card-hover bg-white rounded-xl p-4 border border-burgundy-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-coffee-800">{item.nombre}</h3>
                  {item.tipo && (
                    <span className="text-xs bg-burgundy-50 text-burgundy-500 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {item.tipo}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => startEdit(item)} className="text-coffee-500 hover:text-[var(--color-primary)]">Editar</button>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar "${item.nombre}"?`)) deleteItem(item.id)
                    }}
                    className="text-coffee-500 hover:text-burgundy-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="mt-2">
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

// ─── Posiciones ──────────────────────────────────────────────────────────────

const CATEGORIA_OPTIONS = [
  { value: 'oral', label: 'Oral' },
  { value: 'vaginal', label: 'Vaginal' },
  { value: 'anal', label: 'Anal' },
  { value: 'otros', label: 'Otros' },
]

const emptyPosicion = { nombre: '', categoria: 'otros', calificacion: 0, notas: '' }

function Posiciones() {
  const { items, loading, error, addItem, updateItem, deleteItem } =
    useSupabaseTable('posiciones')
  const [form, setForm] = useState(emptyPosicion)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = items.filter((i) =>
    i.nombre?.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = CATEGORIA_OPTIONS.map((cat) => ({
    ...cat,
    items: filtered.filter((i) => (i.categoria || 'otros') === cat.value),
  })).filter((g) => g.items.length > 0)

  function resetForm() { setForm(emptyPosicion); setEditingId(null) }

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
        nombre: item.nombre,
        categoria: item.categoria || 'otros',
        calificacion: item.calificacion || 0,
        notas: item.notas || '',
    })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-burgundy-50 rounded-2xl p-6 space-y-4">
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
            <label className="block text-sm text-coffee-700 mb-1">Categoría</label>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className={inputClass}
            >
              {CATEGORIA_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
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
            {editingId ? 'Guardar cambios' : 'Agregar posición'}
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
        placeholder="Buscar posición..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`${inputClass} sm:max-w-xs`}
      />

      {error && <p className="text-burgundy-500">{error}</p>}
      {loading ? (
        <LoadingSpinner />
      ) : grouped.length === 0 ? (
        <div className="rounded-2xl bg-burgundy-50 border-2 border-dashed border-burgundy-200 p-10 text-center text-burgundy-400">
          No hay posiciones todavía.
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.value}>
              <h3 className="text-lg font-medium text-burgundy-700 mb-3">{group.label}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {group.items.map((item) => (
                  <div key={item.id} className="card-hover bg-white rounded-xl p-4 border border-burgundy-100 shadow-sm">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-coffee-800">{item.nombre}</h3>
                      <div className="flex gap-2 text-sm">
                        <button onClick={() => startEdit(item)} className="text-coffee-500 hover:text-[var(--color-primary)]">Editar</button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar "${item.nombre}"?`)) deleteItem(item.id)
                          }}
                          className="text-coffee-500 hover:text-burgundy-500"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <StarRating value={item.calificacion || 0} readOnly />
                    </div>
                    {item.notas && <p className="text-sm text-coffee-600 mt-2">{item.notas}</p>}
                    <p className="text-xs text-coffee-300 mt-2">— {item.creado_por}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Juegos ──────────────────────────────────────────────────────────────────

const emptyJuego = { nombre: '', tags: [], calificacion: 0, notas: '' }

function Juegos() {
  const { items, loading, error, addItem, updateItem, deleteItem } =
    useSupabaseTable('juegos')
  const [form, setForm] = useState(emptyJuego)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = items.filter((i) => {
    const matchesSearch = i.nombre?.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !tagFilter || (i.tags || []).includes(tagFilter)
    return matchesSearch && matchesTag
  })

  function resetForm() { setForm(emptyJuego); setEditingId(null) }

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
      nombre: item.nombre,
      tags: item.tags || [],
      calificacion: item.calificacion || 0,
      notas: item.notas || '',
    })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-burgundy-50 rounded-2xl p-6 space-y-4">
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
          <label className="block text-sm text-coffee-700 mb-1">Tags</label>
          <TagSelector tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} options={JUEGO_TAG_OPTIONS} />
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
            {editingId ? 'Guardar cambios' : 'Agregar juego'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-coffee-300 text-coffee-700">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar juego..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} sm:max-w-xs`}
        />
        <FilterMenu activeCount={tagFilter ? 1 : 0}>
          <FilterChipGroup
            title="Tags"
            options={JUEGO_TAG_OPTIONS.map((t) => ({ value: t, label: t }))}
            value={tagFilter}
            onChange={setTagFilter}
          />
        </FilterMenu>
      </div>

      {error && <p className="text-burgundy-500">{error}</p>}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-burgundy-50 border-2 border-dashed border-burgundy-200 p-10 text-center text-burgundy-400">
          No hay juegos todavía.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="card-hover bg-white rounded-xl p-4 border border-burgundy-100 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-coffee-800">{item.nombre}</h3>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => startEdit(item)} className="text-coffee-500 hover:text-[var(--color-primary)]">Editar</button>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar "${item.nombre}"?`)) deleteItem(item.id)
                    }}
                    className="text-coffee-500 hover:text-burgundy-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <StarRating value={item.calificacion || 0} readOnly />
              </div>
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((t) => (
                    <span key={t} className="text-xs bg-burgundy-50 text-burgundy-500 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              )}
              {item.notas && <p className="text-sm text-coffee-600 mt-2">{item.notas}</p>}
              <p className="text-xs text-coffee-300 mt-2">— {item.creado_por}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'productos', label: 'Productos' },
  { id: 'posiciones', label: 'Posiciones' },
  { id: 'juegos', label: 'Juegos' },
]

export default function Intimo() {
  const [activeTab, setActiveTab] = useState('productos')

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl text-burgundy-700 mb-2">Íntimo</h1>
      <p className="text-coffee-600 mb-6">Nuestro espacio privado.</p>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-8 border-b border-burgundy-100">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-coffee-500 hover:text-coffee-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'productos' && <Productos />}
      {activeTab === 'posiciones' && <Posiciones />}
      {activeTab === 'juegos' && <Juegos />}
    </div>
  )
}
