export default function StarRating({ value = 0, onChange, readOnly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={`text-xl leading-none ${
            n <= value ? 'text-[var(--color-primary)]' : 'text-coffee-200'
          } ${readOnly ? '' : 'hover:scale-110 transition-transform'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}