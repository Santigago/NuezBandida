import { useState } from 'react'
import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import { supabase } from '../lib/supabaseClient.js'
import { deleteImageByUrl } from '../lib/imageUpload.js'
import ImageUploader from './ImageUploader.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const emptyForm = { texto: '', foto_url: '' }

export default function Tablero() {
  const { items, loading, refresh } = useSupabaseTable('tablero')
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
      const previous = items.find((i) => i.creado_por === creado_por)

      const { error: upsertError } = await supabase
        .from('tablero')
        .upsert({ ...form, creado_por, created_at: new Date().toISOString() }, { onConflict: 'creado_por' })
      if (upsertError) throw upsertError

      if (previous?.foto_url && previous.foto_url !== form.foto_url) {
        deleteImageByUrl(previous.foto_url).catch(() => {})
      }

      setForm(emptyForm)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(post) {
    const { error: deleteError } = await supabase.from('tablero').delete().eq('id', post.id)
    if (deleteError) return setError(deleteError.message)
    if (post.foto_url) deleteImageByUrl(post.foto_url).catch(() => {})
    await refresh()
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
            className="w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="block text-sm text-coffee-700 mb-1">Foto (opcional)</label>
          <ImageUploader folder="tablero" onUploaded={(url) => setForm((f) => ({ ...f, foto_url: url }))} />
          {form.foto_url && <img src={form.foto_url} alt="Vista previa" className="mt-2 h-24 rounded-lg object-cover" />}
        </div>
        <p className="text-xs text-coffee-400">Publicar reemplaza tu post anterior en el tablero.</p>
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
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 p-10 text-center text-coffee-500">
          El tablero está vacío. Sé el primero en dejar algo.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((post) => (
            <div key={post.id} className="card-hover bg-white rounded-xl p-4 border border-coffee-100 shadow-sm">
              {post.foto_url && <img src={post.foto_url} alt="" className="w-full h-40 object-cover rounded-lg mb-3" />}
              {post.texto && <p className="text-sm text-coffee-700">{post.texto}</p>}
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-coffee-300">— {post.creado_por}</p>
                <button onClick={() => handleDelete(post)} className="text-xs text-coffee-400 hover:text-burgundy-500">
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