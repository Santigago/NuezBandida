import { useState } from 'react'

export default function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('')

  function addTag() {
    const t = input.trim().toLowerCase()
    if (t && !tags.includes(t)) onChange([...tags, t])
    setInput('')
  }

  function removeTag(tag) {
    onChange(tags.filter((t) => t !== tag))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-coffee-100 text-coffee-700 text-xs px-2 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-coffee-500 hover:text-burgundy-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              addTag()
            }
          }}
          placeholder="Agregar tag y presiona Enter"
          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-[var(--color-primary-light)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 rounded-lg bg-coffee-200 text-coffee-800 text-sm shrink-0"
        >
          Agregar
        </button>
      </div>
    </div>
  )
}