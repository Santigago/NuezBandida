export default function FilterChipGroup({
  title,
  options,
  value,
  onChange,
  multi,
  matchMode,
  onMatchModeChange,
}) {
  const isMulti = multi !== undefined ? multi : Array.isArray(value)

  const handleChipClick = (optValue) => {
    if (isMulti) {
      const currentList = Array.isArray(value) ? value : value ? [value] : []
      if (currentList.includes(optValue)) {
        onChange(currentList.filter((v) => v !== optValue))
      } else {
        onChange([...currentList, optValue])
      }
    } else {
      onChange(value === optValue ? '' : optValue)
    }
  }

  const handleClear = () => {
    if (isMulti) {
      onChange([])
    } else {
      onChange('')
    }
  }

  const hasSelection = isMulti
    ? Array.isArray(value) && value.length > 0
    : Boolean(value)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-coffee-700">{title}</p>
        {hasSelection && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-coffee-400 hover:text-burgundy-500 transition-colors"
          >
            Limpiar{isMulti && value.length > 1 ? ` (${value.length})` : ''}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = isMulti
            ? Array.isArray(value) && value.includes(opt.value)
            : value === opt.value

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleChipClick(opt.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selected
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-cream font-medium shadow-xs'
                  : 'bg-white border-coffee-200 text-coffee-600 hover:border-[var(--color-primary-light)]'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {isMulti && Array.isArray(value) && value.length > 1 && onMatchModeChange && (
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-coffee-100 text-xs text-coffee-500">
          <span>Coincidir:</span>
          <div className="inline-flex rounded-lg p-0.5 bg-coffee-100/70 border border-coffee-200/50">
            <button
              type="button"
              onClick={() => onMatchModeChange('or')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                matchMode === 'or' || !matchMode
                  ? 'bg-white text-[var(--color-primary)] font-semibold shadow-xs'
                  : 'text-coffee-600 hover:text-coffee-900'
              }`}
            >
              Cualquiera (O)
            </button>
            <button
              type="button"
              onClick={() => onMatchModeChange('and')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                matchMode === 'and'
                  ? 'bg-white text-[var(--color-primary)] font-semibold shadow-xs'
                  : 'text-coffee-600 hover:text-coffee-900'
              }`}
            >
              Todos (Y)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}