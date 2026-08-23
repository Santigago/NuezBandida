import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Citas from './pages/Citas.jsx'
import LugaresPorVisitar from './pages/LugaresPorVisitar.jsx'
import Recetas from './pages/Recetas.jsx'
import VideosLinks from './pages/VideosLinks.jsx'
import Tips from './pages/Tips.jsx'
import Moteles from './pages/Moteles.jsx'
import PeliculasSeries from './pages/PeliculasSeries.jsx'
import Login from './pages/Login.jsx'
import Salir from './pages/Salir.jsx'

export default function App() {
  const location = useLocation()
  const isMotelTheme = location.pathname.startsWith('/moteles')
  const isLoginPage = location.pathname === '/login'

  return (
    <div data-theme={isMotelTheme ? 'motel' : 'default'} className="min-h-screen flex flex-col">
      {!isLoginPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/salir" element={<ProtectedRoute><Salir /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/citas" element={<ProtectedRoute><Citas /></ProtectedRoute>} />
          <Route path="/lugares-por-visitar" element={<ProtectedRoute><LugaresPorVisitar /></ProtectedRoute>} />
          <Route path="/recetas" element={<ProtectedRoute><Recetas /></ProtectedRoute>} />
          <Route path="/videos-y-links" element={<ProtectedRoute><VideosLinks /></ProtectedRoute>} />
          <Route path="/tips" element={<ProtectedRoute><Tips /></ProtectedRoute>} />
          <Route path="/moteles" element={<ProtectedRoute><Moteles /></ProtectedRoute>} />
          <Route path="/peliculas-y-series" element={<ProtectedRoute><PeliculasSeries /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}