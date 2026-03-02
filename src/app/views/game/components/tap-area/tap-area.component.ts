import { afterNextRender, ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TapService } from '../../../../services/tap.service';
import { EnergyService } from '../../../../services/energy.service';
import { LocalApiService } from '../../../../services/local-api.service';

interface FloatingNumber {
  id: number; value: number; x: number; y: number;
}

@Component({
  selector: 'app-tap-area',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule],
  template: `
    <div class="relative w-full h-full flex flex-col items-center justify-center overflow-visible">
      
      <!-- Floating Numbers Layer -->
      <div class="fixed inset-0 pointer-events-none z-[100]">
        @for (item of floatingNumbers(); track item.id) {
          <div class="floating-number font-black text-white text-3xl drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
               [style.left.px]="item.x" [style.top.px]="item.y">
            +{{ item.value }}
          </div>
        }
      </div>

      <!-- No Energy Message -->
      @if (noEnergyMessage()) {
        <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] liquid-glass-card px-8 py-4 border-red-500/20 bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-widest animate-shake">
          {{ noEnergyMessage() }}
        </div>
      }

      <!-- Side Quick Links -->
      <div class="absolute left-0 top-[5%] -translate-y-1/2 flex flex-col gap-6 z-50">
        <button (click)="openRank($event)" class="w-11 h-11 liquid-glass-card flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform bg-white/[0.03]">
          <svg class="w-5 h-5 text-white/40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
          <span class="text-[7px] font-black text-white/20 uppercase tracking-widest">Rank</span>
        </button>
      </div>

      <div class="absolute right-0 top-[5%] -translate-y-1/2 flex flex-col gap-6 z-50">
        <button (click)="openLuckyWheel($event)" class="w-11 h-11 liquid-glass-card flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform bg-white/[0.03]">
          <svg class="w-5 h-5 text-amber-500/60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          <span class="text-[7px] font-black text-white/20 uppercase tracking-widest">Wheel</span>
        </button>
      </div>

      <!-- Main Ball Tap Area -->
      <div class="relative tap-area-container group mt-4 w-[320px] h-[320px] md:w-[460px] md:h-[460px]" (click)="tap($event)">
        
        <!-- Floor / Base (Always present, matches background tone) -->
        <div class="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-full h-[25%] rounded-[100%] bg-indigo-900/40 blur-[20px] pointer-events-none"></div>
        <div class="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[15%] rounded-[100%] bg-fuchsia-900/40 blur-[15px] pointer-events-none"></div>
        
        <!-- Core specular base highlight -->
        <div class="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[50%] h-[8%] rounded-[100%] bg-indigo-400/20 blur-[8px] pointer-events-none transition-transform duration-75 group-active:scale-[0.85] group-active:bg-indigo-300/40"></div>

        <!-- Aura Layer -->
        <div class="absolute inset-[-20%] rounded-full bg-indigo-500/15 blur-[60px] pointer-events-none"></div>

        <img #ballImage [ngSrc]="ballImageSrc()" alt="Tap Ball"
          class="relative z-10 w-full h-full object-contain drop-shadow-[0_55px_45px_rgba(0,0,0,0.7)] cursor-pointer active:scale-[0.93] active:translate-y-5 transition-all duration-75"
          width="640" height="640" priority />
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .floating-number { position: fixed; z-index: 101; transform: translateX(-50%) translateY(-50%); animation: float-up 0.8s cubic-bezier(0.2, 0, 0.2, 1) forwards; pointer-events: none; }
    @keyframes float-up { 0% { opacity: 0; transform: translate(-50%, 0) scale(0.5); } 20% { opacity: 1; transform: translate(-50%, -40px) scale(1.4); } 100% { opacity: 0; transform: translate(-50%, -160px) scale(1); } }
    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    @keyframes shake { 10%, 90% { transform: translate(-50%, -50%) translateX(-1px); } 20%, 80% { transform: translate(-50%, -50%) translateX(2px); } 30%, 50%, 70% { transform: translate(-50%, -50%) translateX(-4px); } 40%, 60% { transform: translate(-50%, -50%) translateX(4px); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:resize)': 'onResize()' }
})
export class TapAreaComponent {
  @ViewChild('ballImage') ballImage!: ElementRef<HTMLImageElement>;

  private tapSvc = inject(TapService);
  private energySvc = inject(EnergyService);
  private localApi = inject(LocalApiService);
  private router = inject(Router);

  floatingNumbers = signal<FloatingNumber[]>([]);
  private floatingNumberIdCounter = 0;
  noEnergyMessage = signal('');
  isSmallScreen = signal(false);

  readonly coins = this.tapSvc.coins;
  readonly level = this.tapSvc.level;
  readonly tapValue = this.localApi.tapValue;
  readonly activeMultiplier = this.localApi.activeMultiplier;

  readonly ballImageSrc = computed(() => `levels-tap/ball-lv${this.level()}.png`);

  constructor() {
    afterNextRender(() => this.checkScreenHeight());
  }

  openLuckyWheel(event: Event) { event.stopPropagation(); this.router.navigate(['/main/lucky-wheel']); }
  openRank(event: Event) { event.stopPropagation(); this.router.navigate(['/main/rank']); }

  tap(event: MouseEvent) {
    const currentEnergy = this.energySvc.energy();
    if (currentEnergy <= 0) {
      if (!this.noEnergyMessage()) {
        this.noEnergyMessage.set('Energía Insuficiente');
        setTimeout(() => this.noEnergyMessage.set(''), 2000);
      }
      return;
    }

    this.energySvc.decrementEnergy(1);
    const earnedCoins = Math.floor(this.tapValue() * this.activeMultiplier());
    this.tapSvc.addTap(1);
    this.tapSvc.addCoins(earnedCoins);
    this.localApi.addExperience(1);

    // Ball interaction
    if (this.ballImage) {
      const rect = this.ballImage.nativeElement.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.15;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.15;
      this.ballImage.nativeElement.style.transform = `translate(${-x}px, ${-y}px) scale(0.95) rotate(${Math.random() * 6 - 3}deg)`;
      setTimeout(() => this.ballImage.nativeElement.style.transform = '', 100);
    }

    // Floating number
    const id = this.floatingNumberIdCounter++;
    this.floatingNumbers.update(nums => [...nums, { id, value: earnedCoins, x: event.clientX, y: event.clientY }]);
    setTimeout(() => this.floatingNumbers.update(nums => nums.filter(n => n.id !== id)), 800);
  }

  onResize() { this.checkScreenHeight(); }
  checkScreenHeight() { this.isSmallScreen.set(window.innerHeight < 640); }
}
