import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Citas from './pages/Citas.jsx'
import Calendario from './pages/Calendario.jsx'
import Lugares from './pages/Lugares.jsx'
import Recetas from './pages/Recetas.jsx'
import Moteles from './pages/Moteles.jsx'
import Intimo from './pages/Intimo.jsx'
import PeliculasSeries from './pages/PeliculasSeries.jsx'
import Login from './pages/Login.jsx'
import Salir from './pages/Salir.jsx'

export default function App() {
  const location = useLocation()
  const isMotelTheme = location.pathname.startsWith('/moteles') || location.pathname.startsWith('/intimo')
  const isLoginPage = location.pathname === '/login'
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [location.pathname])

  return (
    <div data-theme={isMotelTheme ? 'motel' : 'default'} className="min-h-screen flex flex-col">
      {!isLoginPage && <Navbar />}
      <main className={`flex-1 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/salir" element={<ProtectedRoute><Salir /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/citas" element={<ProtectedRoute><Citas /></ProtectedRoute>} />
          <Route path="/calendario" element={<ProtectedRoute><Calendario /></ProtectedRoute>} />
          <Route path="/lugares" element={<ProtectedRoute><Lugares /></ProtectedRoute>} />
          <Route path="/recetas" element={<ProtectedRoute><Recetas /></ProtectedRoute>} />
          <Route path="/moteles" element={<ProtectedRoute><Moteles /></ProtectedRoute>} />
          <Route path="/intimo" element={<ProtectedRoute><Intimo /></ProtectedRoute>} />
          <Route path="/peliculas-y-series" element={<ProtectedRoute><PeliculasSeries /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}