import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';

@Component({
  selector: 'app-crypto-deposit-modal',
  imports: [NgOptimizedImage, CommonModule],
  template: `
    <div class="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in" (click)="onBackdropClick($event)">
      <div class="absolute inset-0 bg-[#010208]/80 backdrop-blur-2xl"></div>
      
      <div class="relative w-full max-w-md overflow-hidden bg-white/[0.03] backdrop-blur-3xl rounded-[40px] p-10 flex flex-col items-center shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-slide-up">
        <!-- Top highlight line -->
        <span class="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></span>
        <!-- Shimmer sweep -->
        <span class="absolute inset-0 shimmer-anim pointer-events-none"></span>

        <button class="absolute top-6 right-6 w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center active:scale-90 transition-all z-20 hover:bg-white/10" (click)="onClose()">
          <svg class="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div class="flex flex-col items-center mb-10 w-full relative z-10">
          <div class="w-24 h-24 rounded-[32px] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative group">
            <div class="absolute inset-0 rounded-[32px] bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img [ngSrc]="logo()" alt="Currency" width="56" height="56" class="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" priority />
          </div>
          <h2 class="text-2xl font-black text-white tracking-tight uppercase text-glow text-center">{{ displayName() }}</h2>
          <span class="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">Recarga de Activo Digital</span>
        </div>

        <div class="w-full space-y-3 mb-10 relative z-10">
          <div class="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group">
            <span class="text-xl relative z-10">🚀</span>
            <p class="text-[10px] font-black text-white/50 uppercase tracking-widest leading-relaxed relative z-10">Liquidación inmediata tras confirmación de red.</p>
            <div class="absolute inset-0 bg-emerald-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group">
            <span class="text-xl relative z-10">🔐</span>
            <p class="text-[10px] font-black text-white/50 uppercase tracking-widest leading-relaxed relative z-10">Operación cifrada bajo protocolo de seguridad API.</p>
            <div class="absolute inset-0 bg-indigo-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <div class="w-full flex flex-col gap-4 relative z-10">
          <span class="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Dirección de Depósito</span>
          <div class="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 flex items-center justify-between gap-4 shadow-inner relative group">
            <code class="text-[11px] font-black text-white/70 tracking-widest break-all leading-relaxed uppercase">{{ address() }}</code>
            <button (click)="copyAddress()" class="flex-shrink-0 w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
               @if (showCopiedMessage()) {
                 <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
               } @else {
                 <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
               }
            </button>
          </div>
        </div>

        @if (showCopiedMessage()) {
          <div class="mt-8 text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] animate-fade-in text-glow-emerald">Dirección Copiada</div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
    @keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .text-glow { text-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
    .text-glow-emerald { text-shadow: 0 0 15px rgba(52, 211, 153, 0.5); }
    .shimmer-anim {
      background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%);
      background-size: 200% 100%;
      animation: shimmer 4s infinite linear;
    }
    @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CryptoDepositModalComponent {
  currency = input.required<string>();
  address = input.required<string>();
  logo = input.required<string>();
  close = output<void>();

  showCopiedMessage = signal(false);

  displayName = computed(() => {
    const names: Record<string, string> = { 'USDT': 'Tether USDT', 'BTC': 'Bitcoin', 'TRX': 'TRON TRX', 'BNB': 'Binance Coin' };
    return names[this.currency()] || this.currency();
  });

  onClose() { this.close.emit(); }
  onBackdropClick(event: MouseEvent) { if ((event.target as HTMLElement).classList.contains('fixed')) this.onClose(); }

  async copyAddress() {
    await navigator.clipboard.writeText(this.address());
    this.showCopiedMessage.set(true);
    setTimeout(() => this.showCopiedMessage.set(false), 2000);
  }
}
