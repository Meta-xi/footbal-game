---
trigger: always_on
---

# 🎨 Reglas de Estilo y UI (Tailwind CSS - Responsive First)

Este archivo define las normas visuales del proyecto. Cualquier componente generado debe adherirse estrictamente a estas reglas de diseño profesional y moderno.

## 1. Fundamentos de Diseño (Modern Enterprise)
* **Tailwind Only:** Prohibido el uso de archivos CSS externos o la directiva `@apply`. Todo el estilo debe residir en las clases de utilidad del HTML.
* **Consistencia de Espaciado:** Utilizar la escala estándar de Tailwind (p-2, m-4, gap-6). Evitar valores arbitrarios como `w-[13px]`.
* **Geometría:** * Contenedores principales y cards: `rounded-2xl` (16px) o `rounded-3xl` (24px).
    * Botones e inputs: `rounded-lg` (8px) o `rounded-xl` (12px).

## 2. Paleta de Colores y Superficies
* **Fondo de Aplicación:** `bg-slate-50` (Gris ultra claro para reducir fatiga visual).
* **Superficies (Cards/Modales):** `bg-white` con bordes sutiles `border border-slate-200`.
* **Sombras (Elevation):** * Reposo: `shadow-sm`.
    * Interacción: `hover:shadow-md` o `hover:shadow-lg` con `transition-shadow`.
* **Texto:** * Primario: `text-slate-900` (Casi negro para alto contraste).
    * Secundario: `text-slate-500` o `text-slate-600`.

## 3. Responsividad Extrema (Obligatorio)
La interfaz debe ser impecable en pantallas desde 320px hasta 2560px.
* **Mobile-First:** Las clases base SIEMPRE son para móvil. Usa prefijos (`md:`, `lg:`, `xl:`) solo para pantallas mayores.
* **Layouts Adaptables:** * Grid base: `grid grid-cols-1`.
    * Grid tablet: `md:grid-cols-2`.
    * Grid desktop: `lg:grid-cols-3` o `xl:grid-cols-4`.
* **Tablas y Datos:** Todo elemento ancho debe estar dentro de un contenedor con `overflow-x-auto`.
* **Tipografía Dinámica:** Usar `text-lg md:text-2xl lg:text-4xl` para encabezados para evitar desbordamientos en móviles.



## 4. Interactividad y Feedback (UX)
* **Estados de Acción:** Botones y enlaces deben incluir `transition-all duration-200`.
* **Efectos de Click:** Usar `active:scale-95` para simular presión física.
* **Focus:** Elementos de formulario deben resaltar con `focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500`.

## 5. Componentes de Referencia (Snippets)

### Card Profesional Responsivo
```html
<div class="group p-5 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
  <div class="flex items-start justify-between">
    <div class="space-y-2">
      <span class="text-xs font-bold uppercase tracking-widest text-indigo-600">Categoría</span>
      <h3 class="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">Título del Componente</h3>
    </div>
    <div class="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
      </div>
  </div>
  <p class="mt-4 text-slate-600 leading-relaxed text-sm md:text-base">
    Este es un ejemplo de texto que se adapta perfectamente a diferentes anchos de pantalla manteniendo la legibilidad.
  </p>
</div>