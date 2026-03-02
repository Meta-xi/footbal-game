import { Component, ChangeDetectionStrategy, inject, signal, computed, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LocalApiService } from '../../../../services/local-api.service';
import { DecimalPipe, CommonModule } from '@angular/common';
import { BottomNavComponent } from '../../../../shared/bottom-nav/bottom-nav.component';

interface WheelSegment {
  id: number;
  label: string;
  iconPath: string;
  reward: number;
  rewardType: 'coins' | 'energy' | 'multiplier' | 'special';
  multiplier?: string;
}

@Component({
  selector: 'app-lucky-wheel',
  imports: [DecimalPipe, CommonModule, BottomNavComponent],
  template: `
    <section class="min-h-dvh flex flex-col relative w-full overflow-hidden bg-transparent">
      <!-- Header -->
      <header class="w-full relative z-10 pt-safe-top px-4 flex justify-between items-center py-6">
        <div class="flex flex-col">
            <span class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Fortuna</span>
            <h1 class="text-2xl font-black text-white tracking-tight text-glow uppercase">Rueda de Oro</h1>
        </div>
        <button (click)="goBack()" class="lg-bubble w-11 h-11 flex items-center justify-center" aria-label="Volver">
          <svg class="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div class="flex-1 w-full relative z-10 flex flex-col items-center justify-center gap-10">
          
        <div class="relative w-[340px] h-[340px] flex items-center justify-center -mt-10">
          <!-- Premium Wheel Container -->
          <div class="absolute inset-[-20px] bg-white/5 rounded-full blur-[60px] opacity-40"></div>
          
          <!-- Outer Wheel Lighting -->
          <div class="absolute inset-0 rounded-full border-4 border-white/5 box-content">
            @for (bulb of bulbsCount; track bulb) {
              <div class="absolute w-2 h-2 rounded-full transition-all duration-300"
                [class.bg-white]="activeBulb() % 2 === bulb % 2"
                [class.bg-white/10]="activeBulb() % 2 !== bulb % 2"
                [style.transform]="'rotate(' + (bulb * 22.5) + 'deg) translateY(-170px)'"
                [style.left]="'50%'" [style.top]="'50%'" [style.margin]="'-4px'">
              </div>
            }
          </div>

          <!-- Pointer -->
          <div class="absolute top-[-25px] left-1/2 -translate-x-1/2 z-30 drop-shadow-2xl">
            <div class="w-8 h-10 bg-gradient-to-b from-white to-white/60 clip-path-triangle"></div>
          </div>

          <!-- SVG Wheel -->
          <div class="w-[300px] h-[300px] rounded-full shadow-[0_0_80px_rgba(255,255,255,0.1)] relative z-10"
               [style.transform]="'rotate(' + rotation() + 'deg)'"
               [class.transition-transform]="!isSpinning()"
               [style.transition-duration.ms]="isSpinning() ? 0 : 5000"
               [style.transition-timing-function]="'cubic-bezier(0.2, 0, 0, 1)'">
            <svg class="w-full h-full drop-shadow-2xl" viewBox="0 0 300 300">
               <defs>
                 <linearGradient id="segA" x1="0" y1="0" x2="1" y2="1">
                   <stop offset="0%" stop-color="rgba(255,255,255,0.1)"/>
                   <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
                 </linearGradient>
                 <linearGradient id="segB" x1="0" y1="0" x2="1" y2="1">
                   <stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
                   <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
                 </linearGradient>
               </defs>

               @for (segment of segments; track segment.id) {
                 <path [attr.d]="getSegmentPath(segment.id)" 
                       [attr.fill]="segment.id % 2 === 0 ? 'url(#segA)' : 'url(#segB)'"
                       stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
               }
               <circle cx="150" cy="150" r="40" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
               <circle cx="150" cy="150" r="15" fill="white" class="animate-pulse" />
            </svg>

            <!-- Segment Content -->
            <div class="absolute inset-0 pointer-events-none">
              @for (segment of segments; track segment.id) {
                <div class="absolute top-1/2 left-1/2 -mt-6 -ml-6 w-12 h-12 flex flex-col items-center justify-center gap-0.5"
                     [style.transform]="'rotate(' + (segment.id * 45 + 22.5) + 'deg) translateY(-100px) rotate(' + (-(segment.id * 45 + 22.5)) + 'deg)'">
                  <img [src]="segment.iconPath" class="w-8 h-8 object-contain drop-shadow-md">
                  @if (segment.rewardType === 'coins') {
                    <span class="text-[9px] font-black text-white/50 tracking-tighter">{{ segment.reward }}</span>
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <div class="liquid-glass-card px-8 py-5 flex flex-col items-center gap-2">
            <span class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Giros Restantes</span>
            <span class="text-4xl font-black text-white tracking-tighter text-glow">{{ spinsLeft() }}</span>
        </div>

        <button (click)="spin()" [disabled]="isSpinning() || spinsLeft() === 0"
            class="liquid-glass-button w-[240px] py-6 relative overflow-hidden group active:scale-95 disabled:opacity-50 transition-all">
            <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <span class="relative z-10 text-base font-black uppercase tracking-[0.3em] text-white">Girar Ahora</span>
        </button>
      </div>

      <app-bottom-nav />

      <!-- Result Popups using Liquid Glass Modals -->
      @if (showReward()) {
        <div class="fixed inset-0 z-[150] bg-black/40 backdrop-blur-md animate-fade-in" (click)="hideReward()"></div>
        <div class="fixed bottom-0 left-0 right-0 z-[160] liquid-glass-card rounded-t-[40px] rounded-b-none p-10 flex flex-col items-center shadow-[0_-20px_80px_rgba(0,0,0,0.5)] animate-slide-up outline-none">
            <div class="w-12 h-1.5 bg-white/20 rounded-full mb-10"></div>
            
            <div class="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl overflow-hidden">
                <img [src]="lastSegment()?.iconPath" alt="reward" class="w-16 h-16 object-contain">
            </div>

            <h2 class="text-2xl font-black text-white tracking-tight text-glow mb-3">¡PREMIO GANADO!</h2>
            <p class="text-3xl font-black text-emerald-400 tracking-tighter text-glow mb-8">
                @if (lastSegment()?.multiplier) {
                  {{ lastSegment()?.multiplier }}
                } @else {
                  +{{ lastReward() | number }} <span class="text-sm opacity-50 uppercase ml-1">Monedas</span>
                }
            </p>

            <button (click)="hideReward()" class="liquid-glass-button w-full py-5 text-sm font-black uppercase tracking-[0.2em] text-white active:scale-95 transition-all">
                Reclamar Botín
            </button>
        </div>
      }

      @if (showNoSpinsModal()) {
        <div class="fixed inset-0 z-[150] bg-black/40 backdrop-blur-md animate-fade-in" (click)="closeNoSpinsModal()"></div>
        <div class="fixed bottom-0 left-0 right-0 z-[160] liquid-glass-card rounded-t-[40px] rounded-b-none p-10 flex flex-col items-center shadow-[0_-20px_80px_rgba(0,0,0,0.5)] animate-slide-up outline-none">
            <div class="w-12 h-1.5 bg-white/20 rounded-full mb-10"></div>
            
            <h2 class="text-2xl font-black text-white tracking-tight text-glow mb-3 uppercase">Sin Energía</h2>
            <p class="text-sm text-white/40 font-medium text-center leading-relaxed mb-8 px-8">No tienes giros disponibles. Invita a nuevos amigos para conseguir más tiradas gratis.</p>

            <button (click)="navigateToSocial()" class="liquid-glass-button w-full py-5 text-sm font-black uppercase tracking-[0.2em] text-white active:scale-95 transition-all mb-4">
                Invitar Amigos
            </button>
            <button (click)="closeNoSpinsModal()" class="text-[10px] font-black text-white/30 uppercase tracking-widest">Cerrar</button>
        </div>
      }
    </section>
  `,
  styles: [`
    .clip-path-triangle { clip-path: polygon(50% 100%, 0 0, 100% 0); }
    .pt-safe-top { padding-top: env(safe-area-inset-top, 1rem); }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .text-glow { text-shadow: 0 0 20px rgba(255,255,255,0.2); }
    .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.2; } }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes popIn {
      from { transform: scale(0.8) translateY(20px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LuckyWheelComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly localApi = inject(LocalApiService);

  // Sounds
  private spinClickSound = new Audio('/sounds/button-click-off-click.mp3');
  private spinningSound = new Audio('/sounds/misc333.mp3');
  private winSound = new Audio('/sounds/010707105_prev.mp3');

  rotation = signal(0);
  isSpinning = signal(false);
  lastReward = signal<number | null>(null);
  lastSegment = signal<WheelSegment | null>(null);
  showReward = signal(false);
  showNoSpinsModal = signal(false);
  activeBulb = signal(0);

  // Computed signals - from LocalApiService
  spinsLeft = this.localApi.spinsRemaining;
  spinsUsed = computed(() => {
    const gameState = this.localApi.gameState();
    const total = gameState?.dailySpinsTotal ?? 10;
    return total - this.spinsLeft();
  });
  progressPercent = computed(() => {
    const gameState = this.localApi.gameState();
    const total = gameState?.dailySpinsTotal ?? 10;
    return (this.spinsUsed() / total) * 100;
  });

  // For template iterations
  bulbsCount = Array.from({ length: 16 }, (_, i) => i);
  confettiCount = Array.from({ length: 12 }, (_, i) => i);

  segments: WheelSegment[] = [
    { id: 0, label: 'Monedas', iconPath: '/balance-coin/coin.png', reward: 500, rewardType: 'coins' },
    { id: 1, label: 'x2', iconPath: '/energy/thunder.png', reward: 0, rewardType: 'multiplier', multiplier: 'x2' },
    { id: 2, label: 'Monedas', iconPath: '/balance-coin/coin.png', reward: 200, rewardType: 'coins' },
    { id: 3, label: 'Energía', iconPath: '/energy/rocket.png', reward: 0, rewardType: 'energy' },
    { id: 4, label: 'Monedas', iconPath: '/balance-coin/coin.png', reward: 1000, rewardType: 'coins' },
    { id: 5, label: 'x1', iconPath: '/icons/fire.png', reward: 0, rewardType: 'multiplier', multiplier: 'x1' },
    { id: 6, label: 'Monedas', iconPath: '/balance-coin/coin.png', reward: 300, rewardType: 'coins' },
    { id: 7, label: 'Special', iconPath: '/icons/money-box.png', reward: 2000, rewardType: 'special' },
  ];

  private bulbInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Animate bulbs
    this.bulbInterval = setInterval(() => {
      this.activeBulb.update(v => v + 1);
    }, 300);
  }

  getSegmentPath(segmentId: number): string {
    const centerX = 150;
    const centerY = 150;
    const radius = 145;
    const angle = 45;
    const startAngle = ((segmentId * angle) - 90) * (Math.PI / 180);
    const endAngle = ((segmentId * angle + angle) - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  }

  spin() {
    if (this.spinsLeft() <= 0) {
      this.showNoSpinsModal.set(true);
      return;
    }
    if (this.isSpinning()) return;

    this.spinClickSound.play();
    this.spinningSound.play();
    this.isSpinning.set(true);
    this.showReward.set(false);

    const randomSegment = Math.floor(Math.random() * this.segments.length);
    const extraSpins = 6 + Math.floor(Math.random() * 3); // 6-8 extra spins

    // Each segment is 45 degrees (360 / 8 segments)
    const segmentSize = 45;
    // Safety margin from edges (10 degrees from each edge)
    const safetyMargin = 10;
    // Random offset within the safe zone of the segment (between 10° and 35° within the segment)
    const randomOffset = safetyMargin + Math.random() * (segmentSize - 2 * safetyMargin);

    // Calculate the angle to the randomly chosen position within the segment
    const segmentAngle = randomSegment * segmentSize + randomOffset;
    const targetRotation = this.rotation() + (extraSpins * 360) + (360 - segmentAngle);

    const startRotation = this.rotation();
    const startTime = Date.now();
    const duration = 10000; // Longer spin for more excitement

    const animate = (): void => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out with a nice bounce feel
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const newRotation = startRotation + (targetRotation - startRotation) * easeProgress;

      this.rotation.set(newRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning.set(false);
        this.spinningSound.pause();
        this.spinningSound.currentTime = 0;
        this.winSound.play();

        // Use spin from LocalApiService
        this.localApi.useSpin();

        const segment = this.segments[randomSegment];
        this.lastReward.set(segment.reward);
        this.lastSegment.set(segment);

        // Apply reward based on type
        this.applyReward(segment);

        // Show reward popup after a brief delay
        setTimeout(() => {
          this.showReward.set(true);
        }, 300);
      }
    };

    animate();
  }

  private applyReward(segment: WheelSegment): void {
    switch (segment.rewardType) {
      case 'coins':
        this.localApi.updateBalance(segment.reward);
        this.localApi.addTransaction({
          type: 'reward',
          amount: segment.reward,
          currency: 'coins',
          status: 'completed',
          description: 'Lucky Wheel - Coins'
        });
        break;
      case 'energy':
        this.localApi.addEnergy(100); // Full energy refill
        break;
      case 'multiplier':
        // Activate multiplier boost for 1 hour
        const multiplierValue = segment.multiplier === 'x2' ? 2 : 1;
        if (multiplierValue > 1) {
          const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour
          this.localApi.activateBoost('multiplier_wheel', multiplierValue, expiresAt);
        }
        break;
      case 'special':
        this.localApi.updateBalance(segment.reward);
        this.localApi.addTransaction({
          type: 'reward',
          amount: segment.reward,
          currency: 'coins',
          status: 'completed',
          description: 'Lucky Wheel - Special Prize!'
        });
        break;
    }
  }

  hideReward() {
    this.showReward.set(false);
  }

  closeNoSpinsModal() {
    this.showNoSpinsModal.set(false);
  }

  navigateToSocial() {
    this.closeNoSpinsModal();
    this.router.navigate(['/social']);
  }

  goBack() {
    if (this.bulbInterval) {
      clearInterval(this.bulbInterval);
    }
    this.spinningSound.pause();
    this.spinningSound.currentTime = 0;
    this.router.navigate(['/main']);
  }

  ngOnDestroy(): void {
    if (this.bulbInterval) {
      clearInterval(this.bulbInterval);
    }
    if (this.spinningSound) {
      this.spinningSound.pause();
      this.spinningSound.currentTime = 0;
    }
  }
}
