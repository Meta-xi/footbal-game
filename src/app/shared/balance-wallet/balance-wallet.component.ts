import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { LocalApiService } from '../../services/local-api.service';

@Component({
  selector: 'app-balance-wallet',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule],
  template: `
    <section class="flex flex-col gap-3 absolute top-6 left-6 z-10 animate-fade-in">
      
      <!-- COP Balance -->
      <div class="flex items-center gap-3 py-1.5 px-1.5 pr-4 rounded-full liquid-glass-card bg-amber-500/[0.025] border-amber-500/20 shadow-lg">
        <div class="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-white/5 shadow-inner">
          <img ngSrc="balance-coin/coin.png" alt="COP" width="20" height="20" class="object-contain" />
        </div>
        <span class="text-[11px] font-black text-white tracking-wide text-glow-amber">{{ formattedCop() }}</span>
      </div>

      <!-- USDT Balance -->
      <div class="flex items-center gap-3 py-1.5 px-1.5 pr-4 rounded-full liquid-glass-card bg-emerald-500/[0.025] border-emerald-500/20 shadow-lg">
        <div class="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-white/5 shadow-inner">
          <img ngSrc="wallet/cryptos/usdt.png" alt="USDT" width="20" height="20" class="object-contain" />
        </div>
        <span class="text-[11px] font-black text-white tracking-wide text-glow-emerald">{{ formattedUsdt() }}</span>
      </div>

    </section>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    .text-glow-amber { text-shadow: 0 0 12px rgba(251, 191, 36, 0.5); }
    .text-glow-emerald { text-shadow: 0 0 12px rgba(52, 211, 153, 0.5); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceWalletComponent {
  private localApi = inject(LocalApiService);

  protected readonly copBalance = computed(() => this.localApi.balance());
  protected readonly usdtBalance = computed(() => Math.floor(this.copBalance() / 4000));

  protected readonly formattedCop = computed(() => this.copBalance().toLocaleString('es-CO'));
  protected readonly formattedUsdt = computed(() => this.usdtBalance().toLocaleString('es-CO'));
}
