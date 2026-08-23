export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <section>
        <h1 className="text-4xl text-coffee-800 mb-2">Bienvenidos a NuezBandida</h1>
        <p className="text-coffee-600">
          Nuestro rincón privado. Aquí va el slideshow de fotos y el fondo
          aleatorio (Fase 4).
        </p>
        <div className="mt-4 h-64 rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 flex items-center justify-center text-coffee-500">
          Slideshow de fotos — próximamente
        </div>
      </section>

      <section>
        <h2 className="text-2xl text-coffee-800 mb-2">A dónde ir después</h2>
        <div className="rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 p-6 text-coffee-500">
          Recomendaciones basadas en "Por visitar" — próximamente
        </div>
      </section>

      <section>
        <h2 className="text-2xl text-coffee-800 mb-2">Tablero</h2>
        <div className="rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 p-6 text-coffee-500">
          Tablero compartido de fotos y notas — próximamente
        </div>
      </section>
    </div>
  )
}
