import { useState } from 'react'
import { getInstagramShortcode, getInstagramEmbedUrl } from '../lib/instagram.js'

export default function InstagramEmbed({ url, title }) {
  const [loadError, setLoadError] = useState(false)
  const shortcode = getInstagramShortcode(url)
  const embedUrl = getInstagramEmbedUrl(url)

  if (!shortcode || loadError) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="block mb-3 p-5 rounded-lg bg-gradient-to-br from-coffee-50 via-white to-burgundy-50 border border-coffee-200/80 hover:border-[var(--color-primary)] transition-all text-center group shadow-xs"
      >
        <div className="w-11 h-11 mx-auto mb-2 rounded-full bg-white border border-coffee-200 shadow-xs flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
          🎬
        </div>
        <p className="text-xs font-medium text-coffee-800 group-hover:text-[var(--color-primary)] transition-colors">
          Ver en Instagram
        </p>
        <p className="text-[11px] text-coffee-400 mt-0.5 flex items-center justify-center gap-0.5">
          <span>Abrir video</span>
          <span className="transition-transform group-hover:translate-x-0.5">↗</span>
        </p>
      </a>
    )
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-coffee-50 border border-coffee-100 mb-3 flex items-center justify-center">
      <iframe
        src={embedUrl}
        title={title || 'Instagram Reel'}
        className="w-full aspect-[9/16] max-h-[460px] rounded-lg border-0 bg-transparent"
        scrolling="no"
        allowTransparency="true"
        loading="lazy"
        onError={() => setLoadError(true)}
      />
    </div>
  )
}
