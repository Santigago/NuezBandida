export default function MapEmbed({ query }) {
  if (!query) return null

  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`

  return (
    <iframe
      src={src}
      className="w-full h-48 rounded-lg border-0 mt-2"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={`Mapa de ${query}`}
    />
  )
}