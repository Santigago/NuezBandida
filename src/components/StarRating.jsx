export default function StarRating({ value = 0, onChange, readOnly = false }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl leading-none ${
            n <= value ? 'text-[var(--color-primary)]' : 'text-coffee-200'
          } ${readOnly ? '' : 'hover:scale-110 transition-transform'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}