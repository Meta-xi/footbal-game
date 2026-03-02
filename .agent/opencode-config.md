# Opencode Configuration - Angular 21 Project

> **ATTENTION:** This file contains ALL rules from `.agent/rules/`. Read it at the start of every session.

---

## 1. Technology Stack

- **Framework:** Angular v21 (STRICT mode)
- **Language:** TypeScript 5.7+ (Strict Mode enabled)
- **Build Tool:** Vite / Esbuild (Application Builder)
- **Change Detection:** Zoneless (via `provideZonelessChangeDetection()` - Stable since v20.2+)
- **Styling:** TailwindCSS v4.1.18 (no external CSS files)
- **Package Manager:** Bun (ALWAYS, never npm)

---

## 2. Package Manager Rules (CRITICAL)

**ALWAYS use `bun` instead of npm:**

| npm Command | Bun Command |
|------------|-------------|
| `npm install` | `bun install` |
| `npm add package` | `bun add package` |
| `npm run script` | `bun run script` |
| `npm start` | `bun run start` |

---

## 3. Angular Architecture Rules

### 3.1 Core Principles

- **Zoneless by Default:** App works without `zone.js`
- **Standalone Components:** Everything is standalone (no `standalone: true` needed, it's the default in v20+)
- **Change Detection:** ALWAYS `changeDetection: ChangeDetectionStrategy.OnPush`
- **No NgModules:** Do NOT use `NgModule`

### 3.2 State Management Pattern (RxJS-to-Signal)

Since `resource()` API is experimental, use this pattern:

**For HTTP/Async Data:**
1. Define request with `HttpClient` (returns `Observable`)
2. Transform Observable to Signal using `toSignal` (from `@angular/core/rxjs-interop`)
3. Handle errors with `catchError` in the Observable pipe BEFORE converting

**For Write/Mutations:**
- Use normal methods (void function or Promise) for user actions (POST/PUT/DELETE)
- Update `WritableSignals` locally after operation success

### 3.3 Modern APIs (Use These)

| Old Way | New Way |
|---------|---------|
| `@Input()` | `input()` or `input.required()` |
| `@Output()` | `output()` |
| `@ViewChild()` | `viewChild()` |
| `@ViewChildren()` | `viewChildren()` |
| `@ContentChild()` | `contentChild()` |
| Two-way binding | `model()` |

### 3.4 Template Syntax

**Use block syntax ALWAYS:**
- `@if` instead of `*ngIf`
- `@for` instead of `*ngFor`
- `@switch` instead of `*ngSwitch`
- `@defer` for lazy loading heavy components

### 3.5 Dependency Injection

**ALWAYS use `inject()` function:**

```typescript
// CORRECT
private http = inject(HttpClient);
private router = inject(Router);

// WRONG - Avoid constructor injection
constructor(private http: HttpClient) {}
```

---

## 4. Code Patterns with Examples

### 4.1 Ideal Component Pattern

```typescript
import { Component, ChangeDetectionStrategy, inject, input, output, computed } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { HttpClient } from "@angular/common/http";
import { catchError, of } from "rxjs";

interface User {
  id: string;
  name: string;
  role: string;
}

@Component({
  selector: "app-user-profile",
  template: `
    @if (userSignal(); as user) {
      <h1>{{ user.name }}</h1>
      <p>Role: {{ user.role }}</p>
    } @else {
      <p>Loading or Error...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  private http = inject(HttpClient);

  // Modern inputs (Stable)
  userId = input.required<string>();

  // 1. Reactive source based on input
  private user$ = this.http.get<User>(`/api/users/${this.userId()}`).pipe(
    catchError((err) => {
      console.error(err);
      return of(null);
    }),
  );

  // 2. Stable conversion to Signal
  userSignal = toSignal(this.user$, { initialValue: null });
}
```

### 4.2 Service Pattern

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: string;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = '/api/products';

  getProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Omit<Product, 'id'>) {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Product>) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### 4.3 Component with Outputs

```typescript
import { Component, ChangeDetectionStrategy, output } from "@angular/core";

@Component({
  selector: "app-button",
  template: `
    <button 
      (click)="onClick()"
      class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 active:scale-95"
    >
      <ng-content></ng-content>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  // Modern output (Stable since v19+)
  clicked = output<void>();

  onClick() {
    this.clicked.emit();
  }
}
```

### 4.4 Form Integration with Signals

```typescript
import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-search",
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="searchForm">
      <input 
        formControlName="query" 
        class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
        placeholder="Search..."
      />
    </form>
    
    @if (searchQuery()) {
      <p class="text-slate-600">Searching for: {{ searchQuery() }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private fb = inject(FormBuilder);

  searchForm = this.fb.group({
    query: ['']
  });

  // Convert form value changes to signal
  searchQuery = toSignal(
    this.searchForm.get('query')!.valueChanges,
    { initialValue: '' }
  );
}
```

---

## 5. Styling Rules (TailwindCSS)

### 5.1 Core Principles

- **Tailwind Only:** NO external CSS files, NO `@apply` directive. All styles in HTML utility classes.
- **Spacing:** Use standard Tailwind scale (p-2, m-4, gap-6). Avoid arbitrary values like `w-[13px]`.

### 5.2 Geometry

- **Main containers & cards:** `rounded-2xl` (16px) or `rounded-3xl` (24px)
- **Buttons & inputs:** `rounded-lg` (8px) or `rounded-xl` (12px)

### 5.3 Color Palette

| Purpose | Class |
|---------|-------|
| App background | `bg-slate-50` |
| Cards/Modals | `bg-white` with `border border-slate-200` |
| Primary text | `text-slate-900` |
| Secondary text | `text-slate-500` or `text-slate-600` |
| Accent/Primary | `text-indigo-600`, `bg-indigo-600` |

### 5.4 Shadows (Elevation)

- **Rest:** `shadow-sm`
- **Interaction:** `hover:shadow-md` or `hover:shadow-lg` with `transition-shadow`

### 5.5 Responsiveness (EXTREME - Mandatory)

- **Range:** 320px to 2560px
- **Mobile-First:** Base classes ALWAYS for mobile. Use prefixes (`md:`, `lg:`, `xl:`) for larger screens only.

**Layout Patterns:**

```html
<!-- Responsive Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <!-- items -->
</div>

<!-- Responsive Typography -->
<h1 class="text-lg md:text-2xl lg:text-4xl font-bold text-slate-900">
  Title
</h1>

<!-- Responsive Padding -->
<div class="p-4 md:p-6 lg:p-8">
  Content
</div>
```

**Tables & Data:**
Always wrap wide elements in `overflow-x-auto`:

```html
<div class="overflow-x-auto">
  <table class="w-full">
    <!-- table content -->
  </table>
</div>
```

### 5.6 Interactivity & Feedback

**Action States:**
- All buttons and links: `transition-all duration-200`
- Click effect: `active:scale-95`

**Focus States:**
- Form elements: `focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500`

### 5.7 Component Reference: Professional Responsive Card

```html
<div class="group p-5 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
  <div class="flex items-start justify-between">
    <div class="space-y-2">
      <span class="text-xs font-bold uppercase tracking-widest text-indigo-600">Category</span>
      <h3 class="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">Component Title</h3>
    </div>
    <div class="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
      <!-- icon -->
    </div>
  </div>
  <p class="mt-4 text-slate-600 leading-relaxed text-sm md:text-base">
    This text adapts perfectly to different screen widths while maintaining readability.
  </p>
</div>
```

---

## 6. Forbidden Patterns (NEVER USE)

| Forbidden | Reason | Alternative |
|-----------|--------|-------------|
| `resource()` / `rxResource()` | Experimental API | Use RxJS-to-Signal pattern with `toSignal()` |
| `NgModule` | Legacy | Standalone components (default in v20+) |
| `@Input`, `@Output`, `@ViewChild` | Legacy decorators | `input()`, `output()`, `viewChild()` |
| `async` pipe in templates | Legacy pattern | Signals with `toSignal()` |
| `ngClass` | Directive deprecated | Class bindings: `[class.some-class]="condition"` |
| `ngStyle` | Directive deprecated | Style bindings: `[style.property]="value"` |
| External CSS files | Not allowed | Tailwind utility classes only |
| `@apply` directive | Not allowed | Tailwind utility classes directly in HTML |
| `mutate()` on signals | Unpredictable | Use `update()` or `set()` |
| `@HostBinding`, `@HostListener` | Deprecated pattern | Use `host` object in `@Component`/`@Directive` |
| Arrow functions in templates | Not supported | Use component methods |
| `new Date()` in templates | Unreliable | Use component methods or signals |

---

## 7. Accessibility Requirements (MANDATORY)

**MUST pass all these checks:**

- ✅ **AXE checks** - All automated accessibility tests
- ✅ **WCAG AA** minimum compliance
- ✅ **Focus management** - Proper focus indicators and order
- ✅ **Color contrast** - Minimum 4.5:1 for normal text
- ✅ **ARIA attributes** - Where needed for context

**Implementation:**

```typescript
@Component({
  selector: "app-accessible-button",
  template: `
    <button 
      (click)="handleClick()"
      [attr.aria-label]="ariaLabel()"
      [disabled]="disabled()"
      class="px-4 py-2 bg-indigo-600 text-white rounded-lg 
             hover:bg-indigo-700 
             focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 
             focus:outline-none
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-200 active:scale-95"
    >
      <ng-content></ng-content>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibleButtonComponent {
  ariaLabel = input.required<string>();
  disabled = input<boolean>(false);
  clicked = output<void>();

  handleClick() {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
```

---

## 8. TypeScript Best Practices

- **Strict type checking:** Enabled (Strict Mode)
- **Type inference:** Prefer when type is obvious
- **Avoid `any`:** Use `unknown` when type is uncertain
- **Interfaces:** Use for data models (see `src/app/models/`)
- **Enums:** Use for constants when appropriate

**Example:**

```typescript
// Interface for data model
interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

// Enum for constants
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest'
}

// Proper typing
function getUserById(id: string): Promise<UserProfile | null> {
  // implementation
}

// Use unknown instead of any
function parseData(data: unknown): UserProfile {
  // Type guard or validation
  if (isUserProfile(data)) {
    return data;
  }
  throw new Error('Invalid data');
}
```

---

## 9. File Structure Conventions

```
src/app/
├── components/          # Reusable UI components
├── layout/             # Layout components (login, sidenav, page)
├── services/           # Business logic and API services
├── models/             # TypeScript interfaces and types
├── guards/             # Route guards (auth, unauth)
├── resolvers/          # Route resolvers
├── pipes/              # Custom pipes
└── directives/         # Custom directives
```

**Naming Conventions:**
- Components: PascalCase with 'Component' suffix (e.g., `UserProfileComponent`)
- Services: PascalCase with descriptive names (e.g., `AuthService`)
- Variables: camelCase with descriptive names
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case for consistency

---

## 10. Commands Reference

### Development
```bash
bun start              # or ng serve -o - Start dev server
bun run build          # Build for production
bun run watch          # Build in watch mode
```

### Testing
```bash
bun test               # or ng test - Run all tests with Vitest
bun vitest run         # Run tests once without watch mode
bun vitest run path/to/file.spec.ts  # Run specific test
```

### Package Management
```bash
bun add package-name   # Install package
bun install            # Install dependencies
bun run script-name    # Run npm script
```

---

## Quick Checklist Before Generating Code

Before writing any code, verify:

- [ ] Using `bun` commands, not npm
- [ ] Component is standalone (no NgModule)
- [ ] Using `input()` / `output()` instead of decorators
- [ ] Using `inject()` for dependency injection
- [ ] ChangeDetection is OnPush
- [ ] Using `@if`, `@for`, `@switch` (not *ngIf, *ngFor)
- [ ] Using Tailwind classes (no external CSS)
- [ ] Mobile-first responsive design
- [ ] Accessibility attributes included
- [ ] No forbidden patterns used
- [ ] TypeScript strict mode compliant

---

*Last updated: Based on `.agent/rules/` files*
*Project: Administracion-21 (Angular 21)*
