import { useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import { supabase } from '../lib/supabaseClient.js'

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'

const emptyForm = { texto: '', foto_url: '' }

export default function Tablero() {
  const { items, loading, deleteItem, refresh } = useSupabaseTable('tablero')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.texto.trim() && !form.foto_url.trim()) return
    setSaving(true)
    setError(null)
    try {
      const { data: userData } = await supabase.auth.getUser()
      const creado_por = userData?.user?.user_metadata?.nombre || userData?.user?.email

      // Upsert: si esta persona ya tiene un post, lo reemplaza; si no, crea uno nuevo.
      const { error: upsertError } = await supabase
        .from('tablero')
        .upsert(
          { ...form, creado_por, created_at: new Date().toISOString() },
          { onConflict: 'creado_por' }
        )

      if (upsertError) throw upsertError

      setForm(emptyForm)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-coffee-50 rounded-2xl p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm text-coffee-700 mb-1">Nota</label>
          <textarea
            value={form.texto}
            onChange={(e) => setForm({ ...form, texto: e.target.value })}
            rows={2}
            placeholder="Deja una nota para el otro..."
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm text-coffee-700 mb-1">URL de foto (opcional)</label>
          <input
            type="url"
            placeholder="https://..."
            value={form.foto_url}
            onChange={(e) => setForm({ ...form, foto_url: e.target.value })}
            className={inputClass}
          />
          <p className="text-xs text-coffee-400 mt-1">
            Subida directa de fotos llega en la Fase 5 — por ahora pega un link.
          </p>
        </div>
        <p className="text-xs text-coffee-400">
          Publicar reemplaza tu post anterior en el tablero.
        </p>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-cream font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? 'Publicando...' : 'Publicar en el tablero'}
        </button>
      </form>

      {error && <p className="text-burgundy-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-coffee-500">Cargando...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 p-10 text-center text-coffee-500">
          El tablero está vacío. Sé el primero en dejar algo.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((post) => (
            <div key={post.id} className="bg-white rounded-xl p-4 border border-coffee-100 shadow-sm">
              {post.foto_url && (
                <img src={post.foto_url} alt="" className="w-full h-40 object-cover rounded-lg mb-3" />
              )}
              {post.texto && <p className="text-sm text-coffee-700">{post.texto}</p>}
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-coffee-300">— {post.creado_por}</p>
                <button onClick={() => deleteItem(post.id)} className="text-xs text-coffee-400 hover:text-burgundy-500">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}