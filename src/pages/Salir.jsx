import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Ruta oculta (no está en el navbar): /salir cierra la sesión.
export default function Salir() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    logout().then(() => navigate('/login', { replace: true }))
  }, [])

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-coffee-500">
      Cerrando sesión...
    </div>
  )
}