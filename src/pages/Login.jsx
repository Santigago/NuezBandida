import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import NuezCorazonIcon from '../components/NuezCorazonIcon.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await login(email, password)
    setLoading(false)
    if (error) {
      setError('Correo o contraseña incorrectos.')
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-primary)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-cream rounded-2xl p-8 shadow-lg"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <NuezCorazonIcon className="w-16 h-16 mb-2 drop-shadow-md" />
          <h1 className="text-2xl text-coffee-800 mb-1 font-display">NuezBandida</h1>
          <p className="text-coffee-500 text-sm">Inicia sesión para entrar</p>
        </div>

        <label className="block text-sm text-coffee-700 mb-1">Correo</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-coffee-200 bg-white focus:outline-none focus:ring-2 focus:ring-coffee-400"
        />

        <label className="block text-sm text-coffee-700 mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-coffee-200 bg-white focus:outline-none focus:ring-2 focus:ring-coffee-400"
        />

        {error && <p className="text-burgundy-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-coffee-700 text-cream font-medium hover:bg-coffee-800 transition-colors disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}