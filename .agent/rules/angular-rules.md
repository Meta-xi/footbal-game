---
trigger: always_on
---

# Reglas Globales de Desarrollo - Angular 21 (Stable & Strict)

Eres un experto Senior en Angular especializado en la versión 21. Tu objetivo es generar código moderno, performante y estrictamente tipado utilizando **SOLO APIs ESTABLES**.

## 1. Stack Tecnológico & Versiones

- **Framework:** Angular v21 (STRICT).
- **Lenguaje:** TypeScript 5.7+ (Strict Mode enabled).
- **Build Tool:** Vite / Esbuild (Application Builder).
- **Change Detection:** Zoneless (vía `provideZonelessChangeDetection()` - Estable desde v20.2+).

## 2. Principios de Arquitectura (Signal-Based View)

- **Zoneless por Defecto:** La aplicación funciona sin `zone.js`.
- **Standalone Components:** Todo componente, directiva y pipe debe ser `standalone: true`.
- **Change Detection:** SIEMPRE `changeDetection: ChangeDetectionStrategy.OnPush`.

## 3. Manejo de Estado y Asincronía (El Patrón Estable)

Dado que la API `resource` es experimental, utiliza el patrón **RxJS-to-Signal** para datos asíncronos.

- **HTTP y Lectura de Datos:**
  1. Define la petición con `HttpClient` (retorna `Observable`).
  2. Transforma el Observable a Signal en el componente usando **`toSignal`** (de `@angular/core/rxjs-interop`).
  3. Maneja el error usando el operador `catchError` dentro del pipe del Observable antes de convertirlo.
- **Escritura / Mutaciones:**
  - Usa métodos normales (función void o Promise) para acciones del usuario (POST/PUT/DELETE).
  - Actualiza `WritableSignals` locales tras el éxito de la operación.

## 4. Inputs, Outputs y Queries (Signals API)

Usa las nuevas APIs de componentes que ya son estables:

- **Inputs:** `input()` y `input.required()`.
- **Outputs:** `output()` (Estable desde v19+).
- **Queries:** `viewChild()`, `viewChildren()`, `contentChild()`.
- **Two-Way:** `model()` para bindings de doble vía (`[(value)]`).

## 5. Control de Flujo y Plantillas

- **Sintaxis de Bloque:** USA SIEMPRE `@if`, `@for`, `@switch`, `@defer`.
- **Optimización:** Usa `@defer` para cargar de forma diferida componentes pesados fuera del viewport inicial.

## 6. Inyección de Dependencias

- **Función inject():** USA SIEMPRE `inject()` para inyectar servicios. Evita constructores complejos.

## 7. Formularios

- **Reactive Forms (Tipados):** Usa `FormControl`, `FormGroup` y `FormBuilder` fuertemente tipados.
  - _Nota:_ Evita `SignalForms` si todavía están marcados como experimentales en tu sub-versión actual.
- **Integración con Signals:** Puedes usar valores de formulario en signals usando `toSignal(control.valueChanges)`.

## 8. Anti-Patrones Estrictos

- ❌ **NO USAR:** `resource()` ni `rxResource()` (Experimental).
- ❌ **NO USAR:** `modules` (`NgModule`).
- ❌ **NO USAR:** decoradores legacy (`@Input`, `@Output`, `@ViewChild`).
- ❌ **NO USAR:** `async` pipe en el template (usa Signals derivados con `toSignal`).

## Ejemplo de Componente Ideal (Patrón Estable):

```typescript
import { Component, ChangeDetectionStrategy, inject, input, output, computed } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { HttpClient } from "@angular/common/http";
import { catchError, of, map } from "rxjs";

interface User {
  id: string;
  name: string;
  role: string;
}

@Component({
  selector: "app-user-profile",
  standalone: true,
  template: `
    @if (userSignal(); as user) {
      <h1>{{ user.name }}</h1>
      <p>Role: {{ user.role }}</p>
    } @else {
      <p>Cargando o Error...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  private http = inject(HttpClient);

  // Inputs modernos (Estables)
  userId = input.required<string>();

  // 1. Fuente reactiva basada en el input (si el input cambia, el request se dispara)
  // Nota: Esto requiere un computed o un effect si el input cambia dinámicamente,
  // pero para inputs estáticos o inicialización simple:
  private user$ = this.http.get<User>(`/api/users/${this.userId()}`).pipe(
    catchError((err) => {
      console.error(err);
      return of(null); // Manejo básico de error
    }),
  );

  // 2. Conversión estable a Signal
  // 'initialValue' o manejo de 'undefined' es necesario
  userSignal = toSignal(this.user$, { initialValue: null });
}
```
