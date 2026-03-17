import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ruleta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="game-wrapper hide-nav">
      <!-- Botón Atrás -->
      <button class="back-btn absolute top-3 left-3 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur border border-white/10 z-50 transition-transform hover:-translate-x-0.5" (click)="goBack()" aria-label="Volver">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h1 class="text-white text-2xl font-bold tracking-wider">Lucky Spin</h1>
      <p class="text-white/50 text-sm mt-2">Próximamente...</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      color: #fff;
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    .game-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 0.75rem 1rem 1rem;
      position: relative;
    }

    .hide-nav ::ng-deep bottom-navigation,
    .hide-nav ::ng-deep nav,
    .hide-nav ::ng-deep .bottom-nav {
      display: none !important;
    }
  `]
})
export class RuletaComponent {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/main']);
  }
}
