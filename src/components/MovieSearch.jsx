import { useEffect, useRef, useState } from 'react'
import { searchTitles, posterUrl } from '../lib/tmdb.js'

const DEBOUNCE_MS = 400

export default function MovieSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setResults([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await searchTitles(query)
        setResults(data)
        setOpen(true)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  function handleSelect(result) {
    onSelect(result)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm text-coffee-700 mb-1">Buscar en TMDB</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Escribe un título de película o serie..."
        className="w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      />

      {loading && <p className="text-xs text-coffee-400 mt-1">Buscando...</p>}
      {error && <p className="text-xs text-burgundy-500 mt-1">{error}</p>}

      {open && results.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-coffee-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {results.map((r) => (
            <button
              key={`${r.tipo}-${r.tmdb_id}`}
              type="button"
              onClick={() => handleSelect(r)}
              className="w-full flex items-center gap-3 p-2 hover:bg-coffee-50 text-left border-b border-coffee-50 last:border-0"
            >
              {posterUrl(r.poster_path) ? (
                <img src={posterUrl(r.poster_path)} alt="" className="w-10 h-14 object-cover rounded" />
              ) : (
                <div className="w-10 h-14 bg-coffee-100 rounded flex-shrink-0" />
              )}
              <div>
                <p className="text-sm text-coffee-800">{r.titulo}</p>
                <p className="text-xs text-coffee-400">
                  {r.tipo === 'serie' ? 'Serie' : 'Película'}{r.anio ? ` · ${r.anio}` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
