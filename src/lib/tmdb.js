const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w200'

export function posterUrl(posterPath) {
  return posterPath ? `${IMAGE_BASE}${posterPath}` : null
}

export async function searchTitles(query) {
  if (!API_KEY) {
    throw new Error('Falta VITE_TMDB_API_KEY en tu archivo .env')
  }
  if (!query.trim()) return []

  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&include_adult=false`
  const res = await fetch(url)
  if (!res.ok) {
    let detail = ''
    try {
      const body = await res.json()
      detail = body.status_message || ''
    } catch {
      // response wasn't JSON, ignore
    }
    throw new Error(`TMDB error ${res.status}${detail ? `: ${detail}` : ''}`)
  }
  const data = await res.json()

  return (data.results || [])
    .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
    .slice(0, 8)
    .map((r) => ({
      tmdb_id: r.id,
      titulo: r.media_type === 'movie' ? r.title : r.name,
      tipo: r.media_type === 'movie' ? 'pelicula' : 'serie',
      anio: (r.release_date || r.first_air_date || '').slice(0, 4),
      poster_path: r.poster_path,
    }))
}
