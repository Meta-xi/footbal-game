import { ChangeDetectionStrategy, Component, computed, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-screen',
  imports: [CommonModule],
  template: `
    <section class="fixed inset-0 z-[100] flex flex-col w-full overflow-hidden payment-bg">
      <div class="absolute inset-0 bg-[#010208]/40 backdrop-blur-2xl pointer-events-none"></div>
      
      <!-- Toast -->
      @if (toastVisible()) {
        <div class="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-indigo-500/20 backdrop-blur-3xl border border-indigo-500/30 rounded-2xl px-6 py-3 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] animate-bounce-subtle shadow-[0_20px_40px_rgba(99,102,241,0.2)]">
          {{ toastMessage() }}
        </div>
      }

      <!-- Header -->
      <header class="w-full relative z-10 pt-safe-top px-6 h-20 flex items-center justify-between">
        <button (click)="onGoBack()" class="w-12 h-12 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl group">
          <svg class="w-5 h-5 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <div class="flex flex-col items-center text-center">
          <span class="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Confirmación</span>
          <h1 class="text-xl font-black text-white tracking-widest uppercase text-glow">{{ currency() }}</h1>
        </div>

        <div class="w-12"></div> <!-- Spacer for balance -->
      </header>

      <main class="flex-1 w-full relative z-10 flex flex-col items-center overflow-y-auto no-scrollbar pb-32 px-6 gap-6 animate-slide-up">
        
        <!-- Bloque 1: Información -->
        <div class="w-full max-w-sm relative overflow-hidden bg-white/[0.025] backdrop-blur-3xl border border-white/5 rounded-[32px] p-6 flex flex-col items-center gap-4 shadow-2xl">
          <span class="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
          
          <div class="flex flex-col items-center gap-1">
            <span class="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Monto a recargar</span>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-black text-white tracking-tight">$ {{ displayAmount() }}</span>
              <span class="text-xs font-black text-white/40 uppercase tracking-widest">COP</span>
            </div>
          </div>

          <div class="w-full h-px bg-white/5"></div>

          <div class="flex items-center justify-between w-full">
            <div class="flex flex-col gap-0.5 text-left">
              <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">Número de Orden</span>
              <span class="text-xs font-bold text-white tracking-widest">{{ formattedOrderNumber() }}</span>
            </div>
            <button (click)="onCopy()" class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all">
              <span class="text-[9px] font-black text-white/50 uppercase tracking-widest">Copiar</span>
            </button>
          </div>
        </div>

        <!-- Bloque 2: QR -->
        <div class="w-full max-w-sm relative overflow-hidden bg-white/[0.025] backdrop-blur-3xl border border-white/5 rounded-[32px] p-8 flex flex-col items-center gap-6 shadow-2xl">
          <span class="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
          
          <div class="relative w-full aspect-square max-w-[240px] p-4 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-center p-4">
             <div class="absolute inset-0 bg-white rounded-2xl"></div>
             <img [src]="qrImage()" alt="QR Code" class="relative z-10 w-full h-full object-contain" />
          </div>
          
          <p class="text-[9px] font-black text-white/30 uppercase tracking-[0.25em] text-center leading-relaxed">
            Escanea el código QR desde tu aplicación para realizar el pago de forma segura
          </p>
        </div>

        <!-- Bloque 3: Confirmación -->
        <div class="w-full max-w-sm flex flex-col gap-4">
          <div class="relative overflow-hidden bg-white/[0.025] backdrop-blur-3xl border border-white/5 rounded-[32px] p-6 flex flex-col gap-3 shadow-2xl">
            <span class="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
            <span class="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Referencia de Pago</span>
            
            <div class="relative">
              <input 
                type="text" 
                [value]="reference()"
                (input)="onReferenceChange($event)"
                class="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-24 py-5 text-sm font-medium text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/15"
                placeholder="Escribe el nº de transacción"
                maxlength="20"
              />
              <button 
                (click)="onPaste()" 
                class="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/5 text-white/70 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                Pegar
              </button>
            </div>

            @if (reference().length > 0 && !isValidReference()) {
              <p class="text-[9px] font-black text-rose-400/60 uppercase tracking-widest ml-1">Mínimo 6 caracteres</p>
            }
          </div>
        </div>
      </main>

      <!-- Footer Action -->
      <footer class="fixed bottom-0 left-0 right-0 px-6 pb-10 pt-8 z-50 bg-gradient-to-t from-[#010208] via-[#010208]/90 to-transparent">
        <button (click)="onConfirm()"
          [disabled]="!isValidReference()"
          class="relative w-full overflow-hidden flex items-center justify-center gap-3 py-5 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 active:scale-[0.97] text-white disabled:opacity-30 disabled:grayscale btn-glass-confirm">
          <!-- Top highlight line -->
          <span class="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></span>
          <span class="relative z-10">Confirmar Depósito</span>
          <svg class="relative z-10 w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </footer>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .payment-bg {
      background:
        radial-gradient(ellipse at 12% 65%, rgba(13, 27, 110, .80) 0%, transparent 50%),
        radial-gradient(ellipse at 88% 35%, rgba(160, 24, 130, .65) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 100%, rgba(90, 15, 155, .50) 0%, transparent 48%),
        radial-gradient(ellipse at 50% 0%, rgba(8, 15, 80, .70) 0%, transparent 55%),
        linear-gradient(148deg, #010208 0%, #060214 45%, #0a011a 75%, #010208 100%);
    }
    .btn-glass-confirm {
      background: linear-gradient(135deg, rgba(99,102,241,0.95) 0%, rgba(139,92,246,0.95) 50%, rgba(168,85,247,0.90) 100%);
      box-shadow: 0 0 30px rgba(99,102,241,0.40), 0 0 60px rgba(139,92,246,0.15), 0 4px 24px rgba(0,0,0,0.4);
      border: 1px solid rgba(255,255,255,0.15);
    }
    .text-glow { text-shadow: 0 0 15px rgba(255, 255, 255, 0.4); }
    .pt-safe-top { padding-top: env(safe-area-inset-top, 1.5rem); }
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
    @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .animate-bounce-subtle { animation: bounceSubtle 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; }
    @keyframes bounceSubtle { 0% { transform: translate(-50%, 40px); opacity: 0; } 100% { transform: translate(-50%, 0); opacity: 1; } }
    .no-scrollbar::-webkit-scrollbar { display: none; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentScreenComponent {
  private router = inject(Router);

  currency = input.required<string>();
  amount = input.required<number>();
  orderNumber = input.required<string>();
  qrImage = input.required<string>();

  reference = signal('');
  copied = signal(false);
  toastVisible = signal(false);
  toastMessage = signal('');

  isValidReference = computed(() => this.reference().length >= 6);

  displayAmount = computed(() => this.amount().toLocaleString('es-CO'));

  formattedOrderNumber = computed(() => this.orderNumber());

  onReferenceChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.reference.set(value);
  }

  onGoBack() {
    this.router.navigate(['/wallet']);
  }

  async onCopy() {
    await navigator.clipboard.writeText(this.orderNumber());
    this.copied.set(true);
    this.showToast('Copiado');
    setTimeout(() => this.copied.set(false), 2000);
  }

  async onPaste() {
    try {
      const text = await navigator.clipboard.readText();
      this.reference.set(text);
      this.showToast('Pegado');
    } catch { }
  }

  private showToast(message: string) {
    this.toastMessage.set(message);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 2000);
  }

  onConfirm() {
    if (this.isValidReference()) {
      console.log('Confirmando referencia:', this.reference());
      this.router.navigate(['/wallet']);
    }
  }
}
