export default function LoadingSpinner({ label = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-coffee-500">
      <div className="w-8 h-8 border-2 border-coffee-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}