import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Citas from './pages/Citas.jsx'
import LugaresPorVisitar from './pages/LugaresPorVisitar.jsx'
import Recetas from './pages/Recetas.jsx'
import VideosLinks from './pages/VideosLinks.jsx'
import Tips from './pages/Tips.jsx'
import Moteles from './pages/Moteles.jsx'
import PeliculasSeries from './pages/PeliculasSeries.jsx'

export default function App() {
  const location = useLocation()
  const isMotelTheme = location.pathname.startsWith('/moteles')

  return (
    <div data-theme={isMotelTheme ? 'motel' : 'default'} className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/lugares-por-visitar" element={<LugaresPorVisitar />} />
          <Route path="/recetas" element={<Recetas />} />
          <Route path="/videos-y-links" element={<VideosLinks />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/moteles" element={<Moteles />} />
          <Route path="/peliculas-y-series" element={<PeliculasSeries />} />
        </Routes>
      </main>
    </div>
  )
}
