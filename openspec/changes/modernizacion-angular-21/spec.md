# Delta for angular-modernization

## MODIFIED Requirements

### Requirement: Dependency Injection Modernization

Todos los componentes DEBEN usar `inject()` en lugar de constructor injection.

**Escenarios:**
- GIVEN componente existente con constructor( private svc: Service )
- WHEN se moderniza
- THEN usar private svc = inject(Service) al nivel del campo

### Requirement: View Query Modernization

Los decoradores @ViewChild, @ViewChildren DEBEN ser reemplazados por la API de consultas de señales de Angular 21.

**Escenarios:**
- GIVEN componente con @ViewChild('el', {read: ElementRef})
- WHEN se moderniza
- THEN usar viewChild() o viewChildren() signal API

### Requirement: Input/Output Modernization

Los decoradores @Input(), @Output() DEBEN ser reemplazados por las funciones input() y output() de Angular 21.

**Escenarios:**
- GIVEN componente con @Input() prop: string
- WHEN se moderniza
- THEN usar prop = input<string>() 

### Requirement: Control Flow Modernization

Las directivas estructurales (*ngIf, *ngFor, *ngSwitch) DEBEN ser reemplazadas por el nuevo control flow (@if, @for, @switch).

### Requirement: Signal-Based State

Señales private que no necesitan ser expuestas DEBEN usar convención underscore (_signal).
