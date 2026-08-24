# NuezBandida

Sitio web privado para nosotros dos: citas, lugares por visitar, recetas,
videos, tips, moteles y nuestra lista de películas/series — con slideshow,
fondo aleatorio, recomendaciones y un tablero compartido de fotos/notas.

Ver `PLAN.md` para el detalle completo de cada fase (stack, decisiones,
alcance). Este README es el **checklist de avance** — marcamos cada casilla
conforme avanzamos, y así vamos llevando el control en GitHub.

**Stack:** React + Vite + Tailwind CSS · Supabase (DB, Storage, Auth) · Vercel
**Idioma:** Español · **Paleta:** Café (base) + Burdeos (acento / dominante en Moteles)

---

## Fase 0 — Configuración inicial
- [x] Definir stack, decisiones y alcance (`PLAN.md`)
- [x] Crear estructura del proyecto (React + Vite + Tailwind)
- [x] Crear proyecto en Supabase (URL + anon key)
- [x] Crear repositorio en GitHub y hacer el primer commit
- [x] Configurar `.env` local con las credenciales de Supabase

## Fase 1 — Sistema de diseño y estructura base
- [x] Paleta de colores (café dominante / burdeos en Moteles) vía variables CSS
- [x] Tipografías (encabezados y cuerpo)
- [x] Barra de navegación (Inicio, Citas, Lugares por Visitar, Recetas, Videos y Links, Tips, Moteles, Películas y Series)
- [x] Layout responsive (menú hamburguesa en móvil)
- [x] Ajustes de estilo según feedback

## Fase 2 — Autenticación
- [x] Login para cada usuario
- [x] Indicador de sesión iniciada
- [x] Proteger rutas privadas

## Fase 3 — Secciones de datos (CRUD)
- [x] Tablas en Supabase: dates_log, bucket_list, recipes, videos_links, tips, motel_ratings, watchlist
- [x] Agregar / editar / eliminar / ver en cada sección
- [x] Estrellas/calificación para moteles
- [x] Toggle visto/no visto para películas y series
- [x] Tags en lugares (cafetería, parque, museo, etc.)
- [x] Estado por lugar: Visitado / Por visitar
- [x] Buscador por nombre + filtros por tag y por estado

## Fase 4 — Página de inicio
- [x] Slideshow con nuestras fotos
- [x] Fondo aleatorio (entre las 2 fotos de Hubble elegidas, separado del slideshow)
- [x] Recomendaciones ("a dónde ir después") desde lugares marcados Por visitar
- [x] Tablero compartido de fotos/notas

## Fase 5 — Subida de imágenes y almacenamiento
- [x] Integración con Supabase Storage (slideshow + tablero)
- [x] Compresión/resize básico al subir

## Fase 6 — Pulido
- [x] Animaciones y transiciones
- [x] Estados vacíos y de carga
- [x] Revisión completa en móvil
- [x] Modificacion al sistema de tags para seleccion de tags predeterminados
- [x] Agregar boton de filtro para busqueda de lugares, citas, recetas y peliculas/series
- [x] Limpiar tabs que no se usaran

## Fase 7 — Despliegue
- [ ] Deploy en Vercel conectado a Supabase
- [ ] Link compartido funcionando

## Fase 8 — Extensiones futuras (opcional, cuando quieran)
- [x] Recomendaciones más inteligentes
- [x] Cambio de tab recetas a uno mas conveniente usando solo links de instagram
- [ ] Mapa embebido para ubicaciones
- [ ] Notificaciones al agregar algo al tablero
- [ ] Vista de calendario de citas pasadas
- [ ] Exportar "anuario" en PDF al fin de año

---

## Cómo correr el proyecto localmente

```bash
npm install
cp .env.example .env   # y llenar con tus credenciales de Supabase
npm run dev
```

Abre `http://localhost:5173`.
