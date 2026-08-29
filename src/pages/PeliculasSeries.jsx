import { useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import TagSelector from '../components/TagSelector.jsx'
import FilterMenu from '../components/FilterMenu.jsx'
import FilterChipGroup from '../components/FilterChipGroup.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import MovieSearch from '../components/MovieSearch.jsx'
import JellyfinStatus from '../components/JellyfinStatus.jsx'
import { posterUrl } from '../lib/tmdb.js'
import { jellyfinHomeUrl } from '../lib/jellyfin.js'
import { PELICULA_TAG_OPTIONS } from '../lib/tagOptionsPeliculas.js'

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'

const emptyForm = {
  titulo: '',
  tipo: 'pelicula',
  visto: false,
  tags: [],
  notas: '',
  poster_url: '',
  tmdb_id: null,
  anio: '',
}

const TIPO_OPTIONS = [
  { value: 'pelicula', label: 'Película' },
  { value: 'serie', label: 'Serie' },
]

const VISTO_OPTIONS = [
  { value: 'visto', label: 'Vista' },
  { value: 'no_visto', label: 'Pendiente' },
]

export default function PeliculasSeries() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useSupabaseTable('peliculas_series')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState('')
  const [vistoFilter, setVistoFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = items.filter((i) => {
    const matchesSearch = i.titulo?.toLowerCase().includes(search.toLowerCase())
    const matchesTipo = !tipoFilter || i.tipo === tipoFilter
    const matchesVisto = !vistoFilter || (vistoFilter === 'visto' ? i.visto : !i.visto)
    const matchesTag = !tagFilter || (i.tags || []).includes(tagFilter)
    return matchesSearch && matchesTipo && matchesVisto && matchesTag
  })

  const activeFilterCount = (tipoFilter ? 1 : 0) + (vistoFilter ? 1 : 0) + (tagFilter ? 1 : 0)

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
      titulo: item.titulo,
      tipo: item.tipo || 'pelicula',
      visto: item.visto,
      tags: item.tags || [],
      notas: item.notas || '',
      poster_url: item.poster_url || '',
      tmdb_id: item.tmdb_id || null,
      anio: item.anio || '',
    })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function toggleVisto(item) {
    await updateItem(item.id, { visto: !item.visto })
  }

  async function markSolicitado(item) {
    await updateItem(item.id, { jellyfin_solicitado: true })
  }

  function handleTmdbSelect(result) {
    setForm((f) => ({
      ...f,
      titulo: result.titulo,
      tipo: result.tipo,
      anio: result.anio,
      tmdb_id: result.tmdb_id,
      poster_url: posterUrl(result.poster_path) || '',
    }))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-3xl text-coffee-800">Películas y Series</h1>
        <a
          href={jellyfinHomeUrl()}
          target="_blank"
          rel="noreferrer"
          className="text-sm px-3 py-1.5 rounded-lg border border-coffee-300 text-coffee-700 hover:bg-coffee-50"
        >
          Abrir Jellyfin ↗
        </a>
      </div>
      <p className="text-coffee-600 mb-6">Lo que hemos visto y lo que queremos ver.</p>

      <form onSubmit={handleSubmit} className="bg-coffee-50 rounded-2xl p-6 mb-8 space-y-4">
        <MovieSearch onSelect={handleTmdbSelect} />

        {form.poster_url && (
          <div className="flex items-center gap-3 bg-white rounded-lg p-2 border border-coffee-100">
            <img src={form.poster_url} alt="" className="w-12 h-16 object-cover rounded" />
            <div>
              <p className="text-sm text-coffee-800">{form.titulo}{form.anio ? ` (${form.anio})` : ''}</p>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, poster_url: '', tmdb_id: null, anio: '' }))}
                className="text-xs text-coffee-400 hover:text-burgundy-500"
              >
                Quitar selección de TMDB
              </button>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-coffee-700 mb-1">Título</label>
            <input
              type="text"
              required
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-coffee-700 mb-1">Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className={inputClass}>
              <option value="pelicula">Película</option>
              <option value="serie">Serie</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-coffee-700 mb-1">Géneros</label>
          <TagSelector tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} options={PELICULA_TAG_OPTIONS} />
        </div>

        <label className="flex items-center gap-2 text-sm text-coffee-700">
          <input
            type="checkbox"
            checked={form.visto}
            onChange={(e) => setForm({ ...form, visto: e.target.checked })}
          />
          Ya la vimos
        </label>

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
            {editingId ? 'Guardar cambios' : 'Agregar'}
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
          placeholder="Buscar título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} sm:max-w-xs`}
        />
        <FilterMenu activeCount={activeFilterCount}>
          <FilterChipGroup title="Tipo" options={TIPO_OPTIONS} value={tipoFilter} onChange={setTipoFilter} />
          <FilterChipGroup title="Estado" options={VISTO_OPTIONS} value={vistoFilter} onChange={setVistoFilter} />
          <FilterChipGroup
            title="Géneros"
            options={PELICULA_TAG_OPTIONS.map((t) => ({ value: t, label: t }))}
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
          Nada por aquí todavía.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="card-hover bg-white rounded-xl p-4 border border-coffee-100 shadow-sm flex gap-3">
              {item.poster_url && (
                <img src={item.poster_url} alt="" className="w-16 h-24 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-coffee-800">
                    {item.titulo}{item.anio ? <span className="text-coffee-400 font-normal"> ({item.anio})</span> : ''}
                  </h3>
                  <div className="flex gap-2 text-sm flex-shrink-0">
                    <button onClick={() => startEdit(item)} className="text-coffee-500 hover:text-[var(--color-primary)]">Editar</button>
                    <button onClick={() => deleteItem(item.id)} className="text-coffee-500 hover:text-burgundy-500">Eliminar</button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs bg-coffee-100 text-coffee-600 px-2 py-0.5 rounded-full">
                    {item.tipo === 'serie' ? 'Serie' : 'Película'}
                  </span>
                  <button
                    onClick={() => toggleVisto(item)}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.visto ? 'bg-coffee-500 text-cream' : 'bg-coffee-100 text-coffee-600'
                    }`}
                  >
                    {item.visto ? 'Vista ✓' : 'Pendiente'}
                  </button>
                </div>
                {item.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((t) => (
                      <span key={t} className="text-xs bg-coffee-100 text-coffee-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
                {item.notas && <p className="text-sm text-coffee-600 mt-2">{item.notas}</p>}
                <div className="mt-2">
                  <JellyfinStatus
                    titulo={item.titulo}
                    tipo={item.tipo}
                    solicitado={item.jellyfin_solicitado}
                    onMarkSolicitado={() => markSolicitado(item)}
                  />
                </div>
                <p className="text-xs text-coffee-300 mt-2">— {item.creado_por}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
