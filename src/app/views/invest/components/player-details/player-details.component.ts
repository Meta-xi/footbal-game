import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Player } from '../../../../services/players.service';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="fixed inset-0 z-[150] bg-black/40 backdrop-blur-md animate-fade-in" (click)="onClose()"></div>
    
    <div class="fixed bottom-0 left-0 right-0 z-[160] lg-panel !rounded-t-[40px] !rounded-b-none p-10 flex flex-col shadow-[0_-20px_80px_rgba(0,0,0,0.5)] animate-slide-up" role="dialog">
      <div class="w-12 h-1.5 bg-white/10 rounded-full mb-10 mx-auto"></div>

      <header class="w-full flex items-center justify-between mb-10">
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Perfil del Atleta</span>
          <h2 class="text-3xl font-black text-white tracking-tighter text-glow uppercase">{{ player().name }}</h2>
        </div>
        <button (click)="onClose()" class="w-12 h-12 lg-module-card flex items-center justify-center active:scale-90 transition-transform">
          <svg class="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <main class="w-full space-y-10">
        <div class="relative w-48 h-48 mx-auto group">
          <div class="absolute inset-x-0 bottom-[-20px] h-20 bg-teal-500/10 blur-[60px] rounded-full opacity-40"></div>
          <img [ngSrc]="player().imageUrl" [alt]="player().name" width="192" height="192"
            class="relative z-10 w-full h-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-1000">
        </div>

        <div class="lg-module-card p-4 space-y-px overflow-hidden">
          <div class="flex justify-between items-center px-6 py-5 bg-white/[0.01]">
            <span class="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Inversión Recurrente</span>
            <span class="text-lg font-black text-emerald-400 tracking-tight text-glow">{{ player().price | number }} COP</span>
          </div>
          <div class="flex justify-between items-center px-6 py-5 bg-white/[0.01]">
            <span class="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Ganancia Estimada /h</span>
            <span class="text-lg font-black text-white tracking-tight text-glow">{{ player().earning | number }} COP</span>
          </div>
          <div class="flex justify-between items-center px-6 py-5 bg-white/[0.01]">
            <span class="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Periodo Contractual</span>
            <span class="text-lg font-black text-white tracking-tight">{{ player().contract_days }} Días</span>
          </div>
          <div class="flex justify-between items-center px-6 py-6 bg-teal-500/[0.02]">
            <span class="text-[9px] font-black text-teal-400/60 uppercase tracking-[0.2em]">Retorno Neto Total</span>
            <span class="text-xl font-black text-white tracking-tighter text-glow-teal">
              {{ ((player().earning || 0) * 24) * (player().contract_days||0) | number }} COP
            </span>
          </div>
        </div>
      </main>

      <footer class="w-full grid grid-cols-2 gap-4 mt-10">
        <button (click)="onClose()" class="lg-btn-outline py-5 text-[9px] font-black uppercase tracking-[0.2em]">Cancelar</button>
        <button (click)="onConfirm()" class="lg-btn-primary py-5 text-[9px] font-black uppercase tracking-[0.2em] shadow-emerald-500/20">Confirmar Fichaje</button>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .text-glow-teal { text-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
    .text-glow { text-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDetailsComponent {
  player = input.required<Player>();
  confirm = output<Player>();
  close = output<void>();

  onConfirm() { this.confirm.emit(this.player()); }
  onClose() { this.close.emit(); }
}
