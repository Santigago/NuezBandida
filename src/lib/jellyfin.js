const JELLYFIN_URL = import.meta.env.VITE_JELLYFIN_URL
const API_KEY = import.meta.env.VITE_JELLYFIN_API_KEY

let cachedServerId = null

async function getServerId() {
  if (cachedServerId) return cachedServerId
  const res = await fetch(`${JELLYFIN_URL}/System/Info/Public`)
  if (!res.ok) throw new Error('No se pudo conectar con Jellyfin')
  const data = await res.json()
  cachedServerId = data.Id
  return cachedServerId
}

export function jellyfinHomeUrl() {
  return JELLYFIN_URL
}

export async function searchJellyfin(titulo, tipo) {
  if (!JELLYFIN_URL || !API_KEY) {
    throw new Error('Falta configurar VITE_JELLYFIN_URL o VITE_JELLYFIN_API_KEY')
  }

  const itemType = tipo === 'serie' ? 'Series' : 'Movie'
  const url = `${JELLYFIN_URL}/Items?searchTerm=${encodeURIComponent(titulo)}&IncludeItemTypes=${itemType}&Recursive=true&Limit=5&api_key=${API_KEY}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Jellyfin error ${res.status}`)
  const data = await res.json()
  const items = data.Items || []
  if (items.length === 0) return null

  const serverId = await getServerId()
  const match = items[0]

  return {
    id: match.Id,
    nombre: match.Name,
    url: `${JELLYFIN_URL}/web/index.html#!/details?id=${match.Id}&serverId=${serverId}`,
  }
}
