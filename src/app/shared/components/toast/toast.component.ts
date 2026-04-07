import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-toast',
  imports: [],
  template: `
     @if (toast(); as t) {
       <div class="fixed top-5 inset-x-0 z-[100] flex justify-center p-4 pointer-events-none"
            aria-live="polite" role="status">
        <div class="animate-slide-down-toast backdrop-blur-2xl border flex items-center gap-3.5 px-5 py-3.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full max-w-[340px] pointer-events-auto"
             [class]="t.type === 'success' ? 'bg-emerald-950/60 border-emerald-500/20' : t.type === 'error' ? 'bg-rose-950/60 border-rose-500/20' : 'bg-black/60 border-white/10'">
          <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
               [class]="t.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : t.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-white/20 text-white'">
            @if (t.type === 'success') {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            } @else if (t.type === 'error') {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            } @else {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            }
          </div>
          <span class="text-[13px] font-medium tracking-wide text-white/95 leading-snug">{{ t.message }}</span>
        </div>
      </div>
    }
  `,
   styles: [`
     .animate-slide-down-toast {
       animation: slideUpToast 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
     }
     @keyframes slideUpToast {
       from { transform: translateY(30px); opacity: 0; }
       to { transform: translateY(0); opacity: 1; }
     }

     @media (prefers-reduced-motion: reduce) {
       .animate-slide-down-toast { animation: none; }
     }
   `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  protected readonly toast = inject(ErrorHandlerService).toast;
}
