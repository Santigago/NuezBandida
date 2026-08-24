import { useRef, useState } from 'react'
import { uploadImage } from '../lib/imageUpload.js'

export default function ImageUploader({ folder, onUploaded }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function handleChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadImage(file, folder)
      onUploaded(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
        className="block w-full text-sm text-coffee-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:text-cream file:cursor-pointer hover:file:opacity-90 disabled:opacity-60"
      />
      {uploading && <p className="text-xs text-coffee-400 mt-1">Subiendo y optimizando imagen...</p>}
      {error && <p className="text-xs text-burgundy-500 mt-1">{error}</p>}
    </div>
  )
}