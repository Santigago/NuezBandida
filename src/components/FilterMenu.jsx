import { useEffect, useRef, useState } from 'react'

export default function FilterMenu({ activeCount = 0, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="px-4 py-2 rounded-lg border border-coffee-300 text-coffee-700 text-sm bg-white hover:bg-coffee-50 flex items-center gap-2"
      >
        Filtrar
        {activeCount > 0 && (
          <span className="bg-[var(--color-primary)] text-cream text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-72 max-w-[90vw] bg-white border border-coffee-200 rounded-xl shadow-lg p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}