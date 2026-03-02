# AGENTS.md - Development Guidelines for Administration-21

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Development Commands

### Build & Development
- `npm start` or `ng serve -o` - Start development server with automatic browser opening
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode for development

### Testing
- `npm test` or `ng test` - Run all tests using Vitest
- `ng test --include="**/specific-file.spec.ts"` - Run single test file
- `vitest run` - Run tests once without watch mode
- `vitest run path/to/file.spec.ts` - Run specific test file once

### Package Management
- **Always use `bun`** as package manager (not npm)
- `bun add package` - Install packages
- `bun install` - Install dependencies  
- `bun run <script>` - Run npm scripts with bun

## Project Configuration

### TypeScript & Angular Settings
- Angular v21.1.1 with TypeScript v5.9.2
- **Strict mode is DISABLED** (`"strict": false` in tsconfig.json)
- Standalone components are the default (Angular v20+)
- Uses Vitest for testing with jsdom environment
- TailwindCSS v4.1.18 for styling with preflight disabled

### Key Dependencies
- TailwindCSS v4.1.18 for UI components
- NgxApexCharts for data visualization  
- NgxSonner for toast notifications
- NgxQuill for rich text editing
- CryptoJS for encryption/decryption

## Code Style Guidelines

### File Structure & Imports
- Use relative paths for component templates/styles: `./component.html`, `./component.scss`
- Import order: Angular modules → Third-party libraries → Local modules/services → Component-specific
- Single quotes for strings (Prettier config)
- 2-space indentation (EditorConfig)
- Max line length: 100 characters (Prettier)

### Component Development
- **Always use standalone components** (no `standalone: true` decorator needed)
- Use `input()` and `output()` functions instead of decorators
- Set `changeDetection: ChangeDetectionStrategy.OnPush` 
- Keep components small and focused on single responsibility
- Prefer inline templates for small components, external files for complex ones

### State Management with Signals
- Use `signal()` for local component state
- Use `computed()` for derived state  
- Use `update()` or `set()` instead of `mutate()` for signal updates
- Keep state transformations pure and predictable

### Template Best Practices
- Use native control flow: `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use async pipe for observables
- **Do NOT use `ngClass`** - use class bindings: `[class.some-class]="condition"`
- **Do NOT use `ngStyle`** - use style bindings: `[style.property]="value"`
- Do not write arrow functions in templates (not supported)
- Do not assume globals like `new Date()` are available

### Services & Dependency Injection
- Use `providedIn: 'root'` for singleton services
- Use `inject()` function instead of constructor injection where possible
- Design services around single responsibility principle
- Handle HTTP errors appropriately and provide meaningful error messages

### Styling Guidelines
- **TailwindCSS Only** - No external CSS files or `@apply` directive
- **Mobile-First Design** - Base classes for mobile, prefixes (`md:`, `lg:`) for larger screens
- **Spacing** - Use standard Tailwind scale (p-2, m-4, gap-6), avoid arbitrary values
- **Colors & Surfaces** - `bg-slate-50` for app background, `bg-white` for cards with `border-slate-200`
- **Typography** - Primary: `text-slate-900`, Secondary: `text-slate-500/600`
- **Interactions** - `transition-all duration-200`, `active:scale-95` for click effects
- **Focus States** - `focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500`
- **Shadows** - `shadow-sm` for rest, `hover:shadow-md/lg` with transition

### TypeScript Patterns
- **Type safety is relaxed** (strict mode disabled)
- Prefer type inference when obvious
- Use interfaces for data models (see `src/app/models/`)
- Use proper return types for public methods
- Use enums for constants when appropriate

### Angular 21 Specific Rules
- **Strict Mode Disabled** - `"strict": false` in tsconfig.json
- **Standalone Components** - Default in v20+, no `standalone: true` decorator needed
- **Zoneless Ready** - Can use `provideZonelessChangeDetection()` (stable since v20.2+)
- **Modern APIs Only** - Use `input()`, `output()`, `model()` instead of decorators
- **RxJS to Signals** - Use `toSignal()` for async data, avoid experimental `resource()` API

### Error Handling
- Always handle HTTP errors with try-catch blocks
- Provide user-friendly error messages
- Use toast notifications (NgxSonner) for user feedback
- Implement proper loading states

### Security
- Authentication tokens stored in localStorage
- User data encrypted with CryptoJS (AES/ECB mode)
- Use interceptors for HTTP headers (see `token-interceptor.ts`)
- Implement role-based access control in guards

### Accessibility Requirements
- MUST pass all AXE checks
- MUST follow WCAG AA minimums
- Include proper focus management
- Provide ARIA attributes where needed
- Ensure keyboard navigation support

### Testing Guidelines
- Write unit tests for components and services
- Use Vitest with jsdom environment
- Test signals and computed values appropriately
- Mock HTTP services in tests
- Test error handling paths

## Performance Optimization
- Use `NgOptimizedImage` for static images (not base64)
- Implement lazy loading for feature routes
- Use OnPush change detection strategy
- Optimize bundle size (production budget: 1.2MB warning, 1.5MB error)
- Use trackBy functions in `@for` loops when appropriate

## Code Organization Patterns

### Directory Structure
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

### Naming Conventions
- Components: PascalCase with 'Component' suffix
- Services: PascalCase with descriptive names (e.g., `AuthService`)
- Variables: camelCase with descriptive names
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case for consistency