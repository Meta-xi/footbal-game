# Angular Best Practices & Style Guide

This document provides a comprehensive set of best practices, style guidelines, and instructions for developing modern, scalable, and maintainable Angular applications. It is based on the official Angular documentation and tailored for this project.

## Core Principles

-   **Consistency:** Strive for consistency within the codebase. If you encounter a conflict between this guide and an existing file's style, prefer consistency with the file.
-   **Readability:** Write code that is easy to read and understand.
-   **Modern Angular:** Embrace modern Angular features such as Standalone Components, Signals, and the new built-in control flow.

## 1. Project Structure

-   **`src` directory:** All application code (TypeScript, HTML, styles) should reside in the `src` directory.
-   **Feature Modules:** Organize your code into feature areas. Instead of top-level `components`, `services`, `pipes` directories, create directories for features (e.g., `src/app/user-profile`, `src/app/auth`).
-   **File Naming:**
    -   Use hyphens to separate words in filenames (e.g., `user-profile.component.ts`).
    -   A component's related files (TS, HTML, SCSS, spec) should have the same name (e.g., `user-profile.component.ts`, `user-profile.component.html`).
    -   Test files should end with `.spec.ts`.
-   **Single Responsibility:** Each file should have a single responsibility. Typically, this means one component, directive, or service per file.

## 2. Components & Directives

-   **Standalone by Default:** Always use standalone components, directives, and pipes. Avoid NgModules.
-   **Component Decorator:**
    -   `selector`: Use a consistent prefix for all components (e.g., `app-user-profile`). Custom element names must contain a hyphen.
    -   `templateUrl` & `styleUrl`: Prefer external templates and styles for all but the smallest components. Use relative paths.
    -   `changeDetection: ChangeDetectionStrategy.OnPush`: Use `OnPush` change detection to improve performance.
-   **Inputs & Outputs:**
    -   Use the `input()` and `output()` functions instead of `@Input()` and `@Output()` decorators.
    -   Use `input.required()` for mandatory inputs.
    -   Use `model()` for two-way data binding.
    -   Use `readonly` for inputs and outputs to prevent accidental reassignment.
    -   Avoid input/output name aliases unless necessary for API compatibility or to avoid name collisions.
-   **Host Bindings:**
    -   Do NOT use `@HostBinding` and `@HostListener`. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator.
-   **Lifecycle Hooks:**
    -   Implement lifecycle hook interfaces (e.g., `OnInit`, `OnDestroy`) for type safety.
    -   Keep lifecycle methods simple. Delegate complex logic to well-named methods.
    -   Use `DestroyRef` for cleanup logic instead of `ngOnDestroy` where possible.
-   **Content Projection:** Use `<ng-content>` for content projection. Use the `select` attribute for multi-slot content projection.

## 3. Templates

-   **Control Flow:** Use built-in control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, and `ngSwitch`.
    -   Always provide a `track` expression for `@for` loops for better performance (e.g., `@for (item of items; track item.id)`).
-   **Bindings:**
    -   Prefer property and attribute bindings (`[class]`, `[style]`) over `[ngClass]` and `[ngStyle]` for better performance and readability.
    -   Use text interpolation `{{ }}` for rendering dynamic text.
-   **Event Handling:**
    -   Name event handlers for what they do, not for the event they handle (e.g., `(click)="saveUser()"`, not `(click)="onClick()"`).
-   **Template Variables:**
    -   Use local template variables (`@let`) for complex expressions that are used multiple times in a template.
    -   Use template reference variables (`#var`) to get a reference to a DOM element, component, or directive.
-   **Deferred Loading:** Use `@defer` to lazy-load parts of your template that are not immediately visible, improving initial load performance.
    -   Always provide a `@placeholder` block.
    -   Use `@loading` for better user experience during loading.
    -   Choose appropriate triggers (`on idle`, `on viewport`, etc.).
-   **Image Optimization:** Use `NgOptimizedImage` (`ngSrc` directive) for all images to enforce performance best practices.

## 4. State Management with Signals

-   **Local State:** Use `signal()` for managing local component state.
-   **Derived State:** Use `computed()` for values derived from other signals.
-   **Immutability:** Do not mutate signal values directly. Use `.set()` or `.update()` to change a signal's value. `mutate()` is not recommended.
-   **Side Effects:** Use `effect()` for side effects that need to react to signal changes, such as logging, analytics, or drawing on a canvas. `effect()`s run asynchronously and should not modify state.

## 5. Dependency Injection (DI)

-   **`inject()` function:** Prefer using the `inject()` function over constructor injection. It's more flexible and readable.
-   **`providedIn: 'root'`:** Provide application-wide singleton services in the root injector using `@Injectable({ providedIn: 'root' })`. This makes them tree-shakable.
-   **Component-level Providers:** Provide services at a component level if the service's lifecycle should be tied to the component, or if you need a separate instance for each component instance.

## 6. Routing

-   **Configuration:** Define routes in a dedicated `app.routes.ts` file. Use `provideRouter` in your `app.config.ts`.
-   **Lazy Loading:** Use `loadComponent` to lazy-load route components. This is crucial for keeping the initial bundle size small.
-   **Route Guards:** Use functional route guards (`CanActivateFn`, `CanDeactivateFn`, etc.) instead of class-based guards.
-   **Route Data:**
    -   Use static `data` for passing static information to a route.
    -   Use `resolve` functions (`ResolveFn`) for fetching dynamic data before a route is activated.
-   **Component Inputs:** Use `withComponentInputBinding()` to automatically bind route parameters, query parameters, and route data to the inputs of the routed component.
-   **View Transitions:** Enable view transitions with `withViewTransitions()` for smooth, animated route changes.

## 7. HttpClient

-   **Setup:** Use `provideHttpClient()` in `app.config.ts`.
-   **Interceptors:** Use functional interceptors (`HttpInterceptorFn`) with `withInterceptors()` for tasks like adding auth tokens or logging.
-   **Type Safety:** Strongly type your HTTP requests (e.g., `http.get<User>('/api/user')`).
-   **Error Handling:** Use RxJS operators like `catchError` to handle HTTP errors gracefully.
-   **Testing:** Use `provideHttpClientTesting()` and `HttpTestingController` to mock and test HTTP requests.

## 8. Testing

-   **Framework:** Use Vitest as the test runner and `jsdom` for DOM emulation.
-   **`TestBed`:** Use `TestBed.configureTestingModule()` to set up a test environment for your components, directives, and services.
-   **Component Testing:**
    -   Use `ComponentFixture` to interact with your component and its template.
    -   Use `fakeAsync` and `tick` to test asynchronous code in a synchronous way.
    -   Use `waitForAsync` for async operations that `fakeAsync` can't handle (like real XHR).
-   **Service Testing:** Test services in isolation or with `TestBed` for dependency injection.
-   **Component Harnesses:** Use component harnesses for testing complex components, especially from libraries like Angular Material. They provide a robust and less brittle way to interact with components in tests.

## 9. Accessibility (a11y)

-   Ensure your application is accessible to all users.
-   Use semantic HTML.
-   Use `aria-*` attributes correctly. `RouterLinkActive` provides `ariaCurrentWhenActive` to help with active link identification.
-   Ensure sufficient color contrast.
-   Manage focus correctly, especially in dynamic components and modals.

## 10. Security

-   **Cross-Site Scripting (XSS):** Angular provides built-in protections. Be cautious when using methods like `bypassSecurityTrustHtml`.
-   **Cross-Site Request Forgery (XSRF/CSRF):** `HttpClient` has built-in support for XSRF protection. Ensure your backend is configured to work with it.

By adhering to these guidelines, we can build robust, maintainable, and high-performance Angular applications.
