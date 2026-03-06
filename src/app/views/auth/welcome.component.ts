import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `
    <div class="welcome-container min-h-screen w-full flex flex-col relative overflow-hidden bg-transparent">
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center justify-between flex-1 p-3 md:p-4">
        
        <!-- Top Section - Welcome Text -->
        <div class="w-full text-center mt-4 md:mt-6 animate-fade-in-down">
          <h1 class="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight leading-tight text-glow-amber">
            ¡Juega y Gana!
          </h1>
          <p class="text-xs text-cyan-300 font-semibold mb-1">
            Compra jugadores y genera ganancias
          </p>
          <p class="text-[9px] text-slate-400">
            Líder en inversión de jugadores
          </p>
        </div>

        <!-- Middle Section - Featured Content -->
        <div class="flex flex-col items-center gap-2.5 md:gap-3.5 animate-fade-in-up animation-delay-200 w-full max-w-md px-1">
          
          <!-- Promo Card - Premium Glass Design -->
          <div class="w-full liquid-glass-card p-3 md:p-4 rounded-2xl border-cyan-500/30 bg-gradient-to-br from-cyan-500/[0.08] to-transparent">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1">
                <h2 class="text-sm md:text-lg font-bold text-white mb-0.5 text-glow-cyan">
                  Bono de Bienvenida
                </h2>
                <p class="text-xs text-cyan-300 font-semibold mb-2">
                  Obtén recompensas al registrarte
                </p>
                <div class="flex items-center gap-1.5 text-slate-300 text-[10px]">
                  <svg class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="font-semibold">+500 Monedas</span>
                </div>
              </div>
              <div class="text-3xl md:text-4xl text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">🎁</div>
            </div>
          </div>

          <!-- Benefits Grid - Premium Glass Cards -->
          <div class="w-full grid grid-cols-2 gap-2 md:gap-3">
            <div class="liquid-glass-card p-2 md:p-3 text-center hover:scale-[1.02] active:scale-95 border-blue-500/20 bg-blue-500/[0.05] transition-all duration-200">
              <div class="text-2xl md:text-3xl mb-1 md:mb-2 text-blue-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]">💎</div>
              <p class="text-[10px] md:text-xs font-bold text-white">Jugadores VIP</p>
              <p class="text-[8px] md:text-[9px] text-blue-300/70 mt-0.5">Más rentables</p>
            </div>
            <div class="liquid-glass-card p-2 md:p-3 text-center hover:scale-[1.02] active:scale-95 border-purple-500/20 bg-purple-500/[0.05] transition-all duration-200">
              <div class="text-2xl md:text-3xl mb-1 md:mb-2 text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">⚡</div>
              <p class="text-[10px] md:text-xs font-bold text-white">Boosts de Poder</p>
              <p class="text-[8px] md:text-[9px] text-purple-300/70 mt-0.5">Incrementa ganancias</p>
            </div>
            <div class="liquid-glass-card p-2 md:p-3 text-center hover:scale-[1.02] active:scale-95 border-emerald-500/20 bg-emerald-500/[0.05] transition-all duration-200">
              <div class="text-2xl md:text-3xl mb-1 md:mb-2 text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">🤝</div>
              <p class="text-[10px] md:text-xs font-bold text-white">Programa de Referidos</p>
              <p class="text-[8px] md:text-[9px] text-emerald-300/70 mt-0.5">Gana comisión</p>
            </div>
            <div class="liquid-glass-card p-2 md:p-3 text-center hover:scale-[1.02] active:scale-95 border-orange-500/20 bg-orange-500/[0.05] transition-all duration-200">
              <div class="text-2xl md:text-3xl mb-1 md:mb-2 text-orange-300 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]">🏆</div>
              <p class="text-[10px] md:text-xs font-bold text-white">Rankings Globales</p>
              <p class="text-[8px] md:text-[9px] text-orange-300/70 mt-0.5">Compite por premios</p>
            </div>
          </div>
        </div>

        <!-- Bottom Section - CTA Buttons - Premium Glass Style -->
        <div class="w-full flex flex-col gap-2.5 animate-fade-in-up animation-delay-400 max-w-md mb-4 md:mb-6 px-1">
          <button
            (click)="goToRegister()"
            class="w-full py-3 md:py-3.5 lg-btn-primary text-sm md:text-base shadow-lg shadow-cyan-500/20 border border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30"
          >
            Registrate y Juega
          </button>

          <button
            (click)="goToLogin()"
            class="w-full py-3 md:py-3.5 lg-btn-outline text-sm md:text-base border-cyan-500/30 hover:bg-cyan-500/10"
          >
            Tengo una cuenta
          </button>

          <button
            (click)="goToGuest()"
            class="w-full py-3 md:py-3.5 lg-btn-ghost text-sm md:text-base text-white/70 hover:text-white hover:bg-white/5"
          >
            Entrar como invitado
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .pt-safe-top { padding-top: env(safe-area-inset-top, 1rem); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WelcomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  identifier = '';
  password = signal('');
  referralCode = signal('');
  acceptTerms = signal(false);
  isLoading = signal(false);
  showPassword = signal(false);
  error = signal<string | null>(null);

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToGuest() {
    this.router.navigate(['/main']);
  }

  goBack() {
    this.router.navigate(['/welcome']);
  }
}