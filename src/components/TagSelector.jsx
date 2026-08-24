import { TAG_OPTIONS } from '../lib/tagOptions.js'

export default function TagSelector({ tags, onChange, options }) {
  function toggleTag(tag) {
    if (tags.includes(tag)) onChange(tags.filter((t) => t !== tag))
    else onChange([...tags, tag])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const selected = tags.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              selected
                ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-cream'
                : 'bg-white border-coffee-200 text-coffee-600 hover:border-[var(--color-primary-light)]'
            }`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}