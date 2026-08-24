export default function FilterChipGroup({ title, options, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-medium text-coffee-700 mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(selected ? '' : opt.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selected
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-cream'
                  : 'bg-white border-coffee-200 text-coffee-600 hover:border-[var(--color-primary-light)]'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}