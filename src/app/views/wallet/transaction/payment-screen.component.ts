import { ChangeDetectionStrategy, Component, signal, inject, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-payment-screen',
    imports: [CommonModule, NgOptimizedImage, FormsModule],
    template: `
    <section class="min-h-dvh flex flex-col relative w-full overflow-hidden animate-fade-in bg-transparent">

      <!-- Toasts -->
      @if (showCopyToast()) {
        <div class="fixed top-24 left-1/2 -translate-x-1/2 z-[200] liquid-glass-card px-6 py-4 border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase tracking-widest animate-bounce-subtle whitespace-nowrap">
          Copiado al Portapapeles
        </div>
      }

      <header class="w-full relative z-10 pt-safe-top px-6 flex justify-between items-center py-6">
        <button (click)="onGoBack()" class="w-12 h-12 liquid-glass-card flex items-center justify-center active:scale-90 transition-transform">
          <svg class="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div class="flex flex-col items-center">
          <span class="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Verificación</span>
          <h1 class="text-2xl font-black text-white tracking-tight text-glow uppercase">{{ currency() }}</h1>
        </div>
        <div class="w-12 h-12 opacity-0"></div> <!-- Spacer -->
      </header>

      <main class="flex-1 w-full relative z-10 flex flex-col items-center overflow-y-auto no-scrollbar pb-32 px-6 gap-8 animate-slide-up">
        
        <div class="w-full liquid-glass-card p-6 flex flex-col items-center gap-1 bg-white/[0.02]">
           <span class="text-[9px] font-black text-white/20 uppercase tracking-widest">Orden de Pago</span>
           <span class="text-xs font-black text-white tracking-widest uppercase opacity-70">{{ orderNumber() }}</span>
        </div>

        <div class="flex flex-col items-center py-4">
           <span class="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.3em] mb-2">Monto a Liquidar</span>
           <span class="text-5xl font-black text-white tracking-tighter text-glow-emerald">COP {{ amount() | number }}</span>
        </div>

        <!-- Volo QR Card -->
        <div class="liquid-glass-card p-8 bg-white/[0.03] border-white/5 flex flex-col items-center gap-6 shadow-2xl">
           <div class="bg-white p-4 rounded-3xl shadow-inner">
              <img ngSrc="qr/deposit.PNG" alt="QR" width="220" height="220" class="rounded-2xl" />
           </div>
           <button (click)="onCopy()" class="liquid-glass-button w-full py-4 text-[10px] bg-white text-black font-black uppercase tracking-widest">Copiar Datos</button>
        </div>

        <!-- Reference Input -->
        <div class="w-full liquid-glass-card p-8 flex flex-col gap-5 bg-white/[0.02]">
           <span class="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Referencia de Operación</span>
           <div class="relative w-full">
              <input 
                type="text" 
                [(ngModel)]="transactionReference" 
                class="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white outline-none focus:border-indigo-500/40 transition-all tracking-widest uppercase placeholder:text-white/10"
                placeholder="Nº de Serie / Ref"
                maxlength="12"
              />
              <button (click)="onPaste()" class="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-xl transition-colors">
                 <svg class="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </button>
           </div>
           <div class="space-y-1 mt-2">
              <p class="text-[9px] font-black text-white/30 uppercase tracking-widest">1. Liquida el pago mediante el QR.</p>
              <p class="text-[9px] font-black text-white/30 uppercase tracking-widest">2. Registra la referencia para confirmar.</p>
           </div>
        </div>
      </main>

      <footer class="fixed bottom-0 left-0 right-0 p-8 z-50 bg-transparent">
        <button 
          class="liquid-glass-button w-full py-5 text-sm shadow-emerald-500/20 disabled:opacity-30" 
          (click)="onConfirm()"
          [disabled]="!isValidReference()">
          Confirmar Liquidación
        </button>
      </footer>
    </section>
  `,
    styles: [`
    :host { display: block; }
    .pt-safe-top { padding-top: env(safe-area-inset-top, 1rem); }
    .animate-puls-slow { animation: pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.2; transform: scale(1.1); } }
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
    @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .text-glow-emerald { text-shadow: 0 0 25px rgba(52, 211, 153, 0.5); }
    .animate-bounce-subtle { animation: bounceSubtle 0.5s ease-out; }
    @keyframes bounceSubtle { 0% { transform: translate(-50%, 20px); opacity: 0; } 100% { transform: translate(-50%, 0); opacity: 1; } }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentScreenComponent {
    private router = inject(Router);

    currency = input('NEQUI');
    amount = input(0);
    orderNumber = input('FIFA-' + Math.floor(Math.random() * 900000 + 100000));

    transactionReference = '';
    showCopyToast = signal(false);
    showPasteToast = signal(false);

    isValidReference() { return this.transactionReference.length >= 6; }

    onGoBack() { this.router.navigate(['/wallet']); }

    async onCopy() {
        await navigator.clipboard.writeText('FIFA26-ADMIN-QR');
        this.showCopyToast.set(true);
        setTimeout(() => this.showCopyToast.set(false), 2000);
    }

    async onPaste() {
        try {
            const text = await navigator.clipboard.readText();
            this.transactionReference = text;
            this.showPasteToast.set(true);
            setTimeout(() => this.showPasteToast.set(false), 2000);
        } catch { }
    }

    onConfirm() {
        if (this.isValidReference()) {
            this.router.navigate(['/wallet']);
        }
    }
}
