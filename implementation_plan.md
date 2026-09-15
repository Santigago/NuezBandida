# Plan de Implementación: Mejoras en "Nosotros", "Recetas" y Filtros Multi-Tag

Este plan aborda tres mejoras clave solicitadas para mejorar la experiencia de uso de la aplicación:
1. Visualización adaptativa de fotos en las tarjetas de **"Nosotros"** (Tablero) para cualquier relación de aspecto (vertical, cuadrada o panorámica).
2. Rediseño de las tarjetas en **"Recetas"** para mostrar la miniatura embebida de Instagram Reels y que el título sea un enlace directo al reel, en lugar de mostrar la URL plana.
3. Habilitar **selección múltiple de tags** en la función de filtro en todas las secciones de la app (Lugares, Citas, Recetas, Películas y Series, e Íntimo).

---

## 1. Tarjetas de "Nosotros" (Tablero): Soporte para cualquier aspect ratio

### Diagnóstico actual
En [`src/components/Tablero.jsx`](file:///home/saico/.agents/NuezBandida/src/components/Tablero.jsx#L107), las imágenes están forzadas con:
```jsx
className="w-full h-40 object-cover rounded-lg mb-3"
```
Esto impone una altura fija horizontal de 160px (`h-40`), recortando severamente fotos verticales (retratos, 3:4 o 9:16) y cuadradas.

### Solución propuesta
- Reemplazar la altura fija por una visualización responsiva que respete la proporción natural de la imagen:
  - `w-full h-auto max-h-[520px] object-contain rounded-lg bg-coffee-900/5` con contenedor centrado.
  - O `w-full h-auto max-h-[520px] object-cover rounded-lg` para fotos que llenan el ancho sin aplastarse.
- Agregar `items-start` a la cuadrícula (`grid sm:grid-cols-2 gap-4 items-start mb-6`) para que una foto vertical no estire artificialmente las tarjetas vecinas.

---

## 2. Pestaña "Recetas": Miniatura de Instagram Reel y Enlace Limpio

### Diagnóstico actual
En [`src/pages/Recetas.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Recetas.jsx#L128-L135), hay un error de sintaxis en el marcado JSX previo (`href={item.url}` suelto antes de `<a>`) y no existe reproductor ni miniatura visible. El checklist de [`README.md`](file:///home/saico/.agents/NuezBandida/README.md#L82) tiene pendiente:
> `Arreglar vista de tarjetas de recetas para mostrar nombre de receta como link y thumbnail para el video en vez de mostrar el link`

### Solución propuesta
1. **Extracción de Shortcode:** Función utilitaria para extraer el ID/shortcode de cualquier URL de Instagram (`/reel/ID/`, `/p/ID/`, `/tv/ID/`).
2. **Visualización de la Miniatura/Player de Reel:**
   - Para enlaces válidos de Instagram, renderizar el reproductor/miniatura oficial embebido:
     ```jsx
     <iframe
       src={`https://www.instagram.com/reel/${shortcode}/embed/`}
       className="w-full aspect-[9/16] max-h-[460px] rounded-lg border-0 bg-coffee-50"
       scrolling="no"
       allowTransparency="true"
     />
     ```
   - Si no se detecta shortcode o falla la carga, mostrar una tarjeta preview elegante con badge de Instagram Reel, botón de acceso directo y gradiente suave en tonos café/burdeos.
3. **Título como Enlace:**
   - El nombre de la receta (`item.nombre`) será el enlace principal con estilo destacado y flecha (`↗`), abriendo el Reel en Instagram en una pestaña nueva.
   - Ya no se mostrará el texto de la URL en bruto.

---

## 3. Filtros Multi-Tag en todas las pestañas

### Diagnóstico actual
[`src/components/FilterChipGroup.jsx`](file:///home/saico/.agents/NuezBandida/src/components/FilterChipGroup.jsx) solo admite un valor de cadena única (`value === opt.value`) y al hacer clic reemplaza el tag anterior. Además, en [`Lugares.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Lugares.jsx), [`Citas.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Citas.jsx), [`Recetas.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Recetas.jsx), [`PeliculasSeries.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/PeliculasSeries.jsx) e [`Intimo.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Intimo.jsx), `tagFilter` es un `string` que solo filtra por un tag a la vez.

### Solución propuesta
1. **Actualizar [`FilterChipGroup.jsx`](file:///home/saico/.agents/NuezBandida/src/components/FilterChipGroup.jsx):**
   - Permitir que `value` sea un arreglo (`string[]`) o un `string` simple (para filtros de selección única como "Estado" o "Tipo").
   - Si `value` es un arreglo, alternar la selección (toggle on/off) sin borrar los demás tags seleccionados.
   - Mostrar un botón sutil "Limpiar" cuando haya tags seleccionados.
   - Soporte opcional para conmutar modo de coincidencia: **Cualquiera (OR)** vs **Todos (AND)** cuando hay más de 1 tag seleccionado.
2. **Actualizar las páginas consumidoras:**
   - [`src/pages/Lugares.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Lugares.jsx): `tagFilter` como array, filtrado `tagFilter.length === 0 || tagFilter.some(...)`.
   - [`src/pages/Citas.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Citas.jsx): `tagFilter` como array.
   - [`src/pages/Recetas.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Recetas.jsx): `tagFilter` como array.
   - [`src/pages/PeliculasSeries.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/PeliculasSeries.jsx): `tagFilter` como array.
   - [`src/pages/Intimo.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Intimo.jsx): `tagFilter` como array.
   - Contador dinámico en [`FilterMenu`](file:///home/saico/.agents/NuezBandida/src/components/FilterMenu.jsx) reflejando el número total de tags activos.

---

## Archivos a Modificar

#### [MODIFY] [`src/components/Tablero.jsx`](file:///home/saico/.agents/NuezBandida/src/components/Tablero.jsx)
- Ajustar proporciones de imágenes para evitar recorte forzado en horizontal.
- Agregar alineación `items-start` en la cuadrícula.

#### [MODIFY] [`src/components/FilterChipGroup.jsx`](file:///home/saico/.agents/NuezBandida/src/components/FilterChipGroup.jsx)
- Soporte para arrays de valores (selección múltiple) y selector de modo de coincidencia.

#### [MODIFY] [`src/pages/Recetas.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Recetas.jsx)
- Corregir error sintáctico de enlace en el título.
- Integrar miniatura/iframe embebido de Instagram Reels.
- Cambiar `tagFilter` a arreglo para selección múltiple de tags.

#### [MODIFY] [`src/pages/Lugares.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Lugares.jsx)
- Migrar `tagFilter` a selección múltiple con arrays y actualizar contador de filtros.

#### [MODIFY] [`src/pages/Citas.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Citas.jsx)
- Migrar `tagFilter` a selección múltiple con arrays y actualizar contador de filtros.

#### [MODIFY] [`src/pages/PeliculasSeries.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/PeliculasSeries.jsx)
- Migrar `tagFilter` a selección múltiple con arrays y actualizar contador de filtros.

#### [MODIFY] [`src/pages/Intimo.jsx`](file:///home/saico/.agents/NuezBandida/src/pages/Intimo.jsx)
- Migrar `tagFilter` a selección múltiple con arrays y actualizar contador de filtros.

#### [MODIFY] [`README.md`](file:///home/saico/.agents/NuezBandida/README.md)
- Marcar como completada la tarea de la fase 8 sobre las tarjetas de recetas.

---

## Plan de Verificación

### Pruebas de Compilación y Calidad
- Ejecutar `npm run build` para asegurar cero errores de bundling o sintaxis.

### Verificación Funcional
- **Tablero:** Probar renderizado de fotos verticales, cuadradas y horizontales asegurando que se preserva la relación de aspecto sin recortes extraños.
- **Recetas:** Probar tarjetas con links de Instagram Reels (`https://www.instagram.com/reel/...`), verificar que el título es un enlace cliqueable directo y que se muestra el preview del reel.
- **Filtros:** Abrir el menú de filtro en Recetas, Lugares, Citas y Películas, seleccionar 2 o más tags simultáneamente y comprobar que el filtrado busca entre todos los tags seleccionados correctamente.
