import { useSupabaseTable } from '../hooks/useSupabaseTable.js'
import { supabase } from '../lib/supabaseClient.js'
import { deleteImageByUrl, copyImage } from '../lib/imageUpload.js'
import { useState, useEffect } from 'react'
import ImageUploader from './ImageUploader.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const emptyForm = { texto: '', foto_url: '' }
const REACTION_EMOJIS = ['❤️', '😂', '😮', '👍', '🔥']

export default function Tablero() {
  const { items, loading, refresh } = useSupabaseTable('tablero')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data?.user?.user_metadata?.nombre || data?.user?.email)
    })
  }, [])

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
        .upsert(
          { ...form, creado_por, created_at: new Date().toISOString(), reacciones: {} },
          { onConflict: 'creado_por' }
        )
      if (upsertError) throw upsertError

      if (previous?.foto_url && previous.foto_url !== form.foto_url) {
        deleteImageByUrl(previous.foto_url).catch(() => {})
      }

      // Archivar una copia permanente para el anuario de fin de año,
      // independiente del post en vivo (que se reemplaza cada vez que alguien publica).
      const archivedUrl = form.foto_url ? await copyImage(form.foto_url, 'recuerdos') : null
      const { error: archiveError } = await supabase
        .from('recuerdos')
        .insert([{ texto: form.texto || null, foto_url: archivedUrl, creado_por }])
      if (archiveError) throw archiveError

      setForm(emptyForm)
      setFormOpen(false)
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

  async function toggleReaction(post, emoji) {
    if (!currentUser) return
    const reacciones = { ...(post.reacciones || {}) }
    const current = reacciones[emoji] || []
    const alreadyReacted = current.includes(currentUser)

    reacciones[emoji] = alreadyReacted
      ? current.filter((u) => u !== currentUser)
      : [...current, currentUser]

    if (reacciones[emoji].length === 0) delete reacciones[emoji]

    const { error: updateError } = await supabase
      .from('tablero')
      .update({ reacciones })
      .eq('id', post.id)

    if (updateError) return setError(updateError.message)
    await refresh()
  }

  return (
    <div>
      {error && <p className="text-burgundy-500 mb-4">{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-coffee-100 border-2 border-dashed border-coffee-300 p-10 text-center text-coffee-500">
          Tablero vacío :(
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {items.map((post) => (
            <div key={post.id} className="card-hover bg-white rounded-xl p-4 border border-coffee-100 shadow-sm">
              {post.foto_url && <img src={post.foto_url} alt="" className="w-full h-40 object-cover rounded-lg mb-3" />}
              {post.texto && <p className="text-sm text-coffee-700">{post.texto}</p>}

              <div className="flex flex-wrap gap-1.5 mt-3">
                {REACTION_EMOJIS.map((emoji) => {
                  const reactedBy = post.reacciones?.[emoji] || []
                  const iReacted = currentUser && reactedBy.includes(currentUser)
                  return (
                    <button
                      key={emoji}
                      onClick={() => toggleReaction(post, emoji)}
                      className={`text-sm px-2 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                        iReacted
                          ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                          : 'bg-white border-coffee-200 hover:border-coffee-400'
                      }`}
                    >
                      <span>{emoji}</span>
                      {reactedBy.length > 0 && (
                        <span className={`text-xs ${iReacted ? 'text-cream' : 'text-coffee-500'}`}>
                          {reactedBy.length}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

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

      {!formOpen ? (
        <button
          onClick={() => setFormOpen(true)}
          className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-cream text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          + Publicar en el tablero
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-coffee-50 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-coffee-700">Nueva publicación</p>
            <button
              type="button"
              onClick={() => { setFormOpen(false); setForm(emptyForm) }}
              className="text-coffee-400 hover:text-coffee-700 text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div>
            <label className="block text-sm text-coffee-700 mb-1">Nota</label>
            <textarea
              value={form.texto}
              onChange={(e) => setForm({ ...form, texto: e.target.value })}
              rows={2}
              placeholder="Dime algo..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-sm text-coffee-700 mb-1">Foto (opcional)</label>
            <ImageUploader folder="tablero" onUploaded={(url) => setForm((f) => ({ ...f, foto_url: url }))} />
            {form.foto_url && <img src={form.foto_url} alt="Vista previa" className="mt-2 h-24 rounded-lg object-cover" />}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-cream font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? 'Publicando...' : 'Publicar'}
            </button>
            <button
              type="button"
              onClick={() => { setFormOpen(false); setForm(emptyForm) }}
              className="px-4 py-2 rounded-lg border border-coffee-300 text-coffee-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
