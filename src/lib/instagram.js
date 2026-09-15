/**
 * Extrae el shortcode/ID de un enlace de Instagram (Reels, Posts, IGTV).
 * Soporta formatos:
 * - https://www.instagram.com/reel/CODE/...
 * - https://www.instagram.com/p/CODE/...
 * - https://www.instagram.com/tv/CODE/...
 * - https://instagr.am/reel/CODE/
 * - https://www.instagram.com/reels/CODE/
 */
export function getInstagramShortcode(url) {
  if (!url || typeof url !== 'string') return null
  const match = url.trim().match(/(?:instagram\.com|instagr\.am)\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i)
  return match ? match[1] : null
}

/**
 * Devuelve la URL oficial de embed para un Reel o publicación de Instagram.
 */
export function getInstagramEmbedUrl(urlOrShortcode) {
  if (!urlOrShortcode) return null
  const shortcode = urlOrShortcode.includes('/') ? getInstagramShortcode(urlOrShortcode) : urlOrShortcode
  if (!shortcode) return null
  return `https://www.instagram.com/reel/${shortcode}/embed/`
}
