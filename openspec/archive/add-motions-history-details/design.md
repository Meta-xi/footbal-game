# Design: Dinero Perdido y Modal de Historial Completo (Motions History)

## Resumen técnico

Agregar un cálculo reactivo de "Dinero Perdido" y un modal que muestre el historial completo de misiones en la pestaña History de /mociones. Aprovecharemos las señales existentes en MotionsService y GlassModalComponent para mantener la lógica en el servicio y dejar la UI como una capa de presentación.

## Enfoque técnico

- Extender MotionsService con dos computed signals nuevos:
  - `totalLost$` — suma de `reward` de `failedMissions()`.
  - `missionHistory$` — lista combinada/ordenada de `missions()` para el modal (alias de `missions()` o computed combinado si queremos agrupar).
- Reusar la señal `showHistoryModal` ya existente para controlar la visibilidad del modal.
- Modificar MotionsComponent para leer `totalLost$` y mostrarlo en la grid de estadísticas; añadir el botón "Ver historial completo" que llama `motionsService.openHistoryModal()`.
- El modal usará `app-glass-modal` (GlassModalComponent) y renderizará `missionHistory$` como lista scrollable de tarjetas (`lg-card-card` / `lg-module-card`) con `lg-status-badge` para estado.

## Decisiones de arquitectura

Decision: Mantener la fuente de verdad en MotionsService
**Elección**: Cálculos y estado del modal en el servicio (signals/computed). La UI solo consume señales.
**Alternativas**: Calcular en el componente o en un store global.  
**Racional**: MotionsService ya expone misiones y señales; centralizar evita duplicación y facilita pruebas.

Decision: Nombre de señales
**Elección**: `totalLost$` y `missionHistory$` para consistencia con sufijo `$` usado en servicio.

## Flujo de datos

MotionsService (signals) → MotionsComponent (toSignal/computed) → Template

```
missions() ─┐
            ├─> failedMissions() ──> totalLost$ (reduce sum)
            └─> missionHistory$ (alias a missions() o computed)

History Button click -> motionsService.openHistoryModal() -> showHistoryModal$ true -> app-glass-modal visible -> reads missionHistory$
```

## Cambios de archivos

| Archivo | Acción | Descripción |
|---|---:|---|
| src/app/features/motions/motions.service.ts | Modificar | Añadir `totalLost$: computed` y `missionHistory$` (o `allMissions$`) y getters públicos. Reutilizar `showHistoryModal` existente. |
| src/app/features/motions/motions.component.ts | Modificar | Consumir `totalLost$` y mostrar en stats grid; disparar `openHistoryModal()`; montar `<app-glass-modal>` con lista. |
| src/app/features/motions/motions.component.html (template) | Modificar | Insertar valor `{{ totalLost | number }} COP` con clases `text-rose-400 text-glow-rose tracking-tighter` y modal markup. |

## Interface / contrato (extracto)

```ts
// en MotionsService (adición)
readonly totalLost$ = computed(() => this.failedMissions().reduce((s, m) => s + (m.reward || 0), 0));
readonly missionHistory$ = computed(() => this.missions().slice().sort((a,b)=> /* opcional ordenar por fecha/id */ 0));
```

## Estructura del modal (UI)

- Header: título "Historial Completo de Misiones" y botón de cierre (aria-label="Cerrar historial de misiones").
- Body: contenedor `overflow-y-auto no-scrollbar max-h-[60vh]` con lista de items.
- Item (por misión): `lg-card-card p-3 mb-3 flex gap-3 items-start` que contiene:
  - Icono a la izquierda (NgOptimizedImage)
  - Column: título (fw-600), descripción (truncate), reward formateado con pipe (DecimalPipe) y etiqueta moneda "COP"
  - Status badge: `lg-status-badge` con dot verde para completadas y `text-glow-rose` / `lg-status-badge` rojo para fallidas

Reutilizar utilidades existentes: `lg-module-card`, `lg-status-badge`, `text-glow-emerald`, `text-glow-rose`.

## Accesibilidad

- `app-glass-modal` debe tener role="dialog", aria-modal="true" y aria-labelledby apuntando al encabezado.
- El close button debe tener aria-label y foco inicial al abrir el modal.
- Escape debe cerrar el modal (GlassModalComponent ya soporta ESC según spec).  
- Permitir navegación por teclado entre items (tabindex en botones de acción por misión).  

## Manejo de errores / casos borde

- Historia vacía: mostrar mensaje centrado "No hay misiones en el historial" con subtítulo y un ícono sutil; CTA para volver.
- Sin misiones fallidas: `totalLost$` devuelve 0 y se muestra "0 COP" con estilo `text-rose-400` (spec).  
- Valores reward ausentes o no numéricos: `reduce` defensivo (Number(m.reward) || 0).
- Listas grandes: marcar en spec como futura optimización (paginación/virtual scroll). Modal usa `max-h-[60vh]` y scroll nativo.

## Pruebas manuales sugeridas (no ejecutar automatizadas sin permiso)

- Ver pestaña History con 0, 1 y múltiples misiones fallidas; validar formato y actualización reactiva.
- Abrir modal con 0 misiones, mezcladas, y >20 misiones; validar scroll y comportamiento de cierre.

## Preguntas abiertas

- ¿Requerimos orden específico en `missionHistory$` (fecha, id)? Actualmente el backend no provee fecha en el modelo; si se necesita, pedir campo o ordenar por id.

## Riesgos

- Listas muy largas pueden impactar render y memoria — mitigación futura: virtual scroll.

---

**Ubicación del artefacto**: openspec/changes/add-motions-history-details/design.md
