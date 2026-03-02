import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { GlassModalComponent } from '../../../../../../../shared/ui';

@Component({
    selector: 'app-rank-info-modal',
    imports: [GlassModalComponent],
    template: `
      <app-glass-modal [isOpen]="true" title="¿Cómo funciona?" (closed)="close.emit()">
        <div class="flex flex-col gap-4">

          <!-- Character -->
          <div class="flex justify-center py-2">
            <img src="/icons/tour-caracter.PNG" alt="Guía del torneo"
                 class="w-32 h-32 object-contain drop-shadow-lg"
                 style="animation: bounce 2s ease-in-out infinite;" />
          </div>

          <!-- Trophy section -->
          <div class="liquid-glass-card p-4 flex flex-col items-center gap-2 text-center">
            <span class="text-3xl">🏆</span>
            <p class="text-sm font-semibold text-white/80 leading-relaxed">
              Actualmente estás compitiendo contra todo un ejército. ¡Demuestra que eres el campeón!
            </p>
          </div>

          <!-- Requirements section -->
          <div class="liquid-glass-card p-4 flex flex-col gap-3 bg-amber-400/5 border-amber-400/20">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🎁</span>
              <h3 class="text-sm font-black text-amber-300 uppercase tracking-wide">Mínimo para calificar:</h3>
            </div>
            <div class="flex flex-col gap-2">
              <!-- Gold -->
              <div class="flex items-center gap-3 px-4 py-2.5 rounded-xl border-2
                           bg-gradient-to-r from-amber-200 to-amber-400 border-white/50
                           shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_0_rgba(120,53,15,0.4)]">
                <span class="text-sm font-black text-slate-900 w-6">1°</span>
                <span class="text-sm font-black text-slate-900">50 Referidos</span>
              </div>
              <!-- Silver -->
              <div class="flex items-center gap-3 px-4 py-2.5 rounded-xl border-2
                           bg-gradient-to-r from-slate-200 to-slate-400 border-white/40
                           shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_3px_0_rgba(66,66,66,0.5)]">
                <span class="text-sm font-black text-slate-900 w-6">2°</span>
                <span class="text-sm font-black text-slate-900">20 Referidos</span>
              </div>
              <!-- Bronze -->
              <div class="flex items-center gap-3 px-4 py-2.5 rounded-xl border-2
                           bg-gradient-to-r from-orange-300 to-orange-500 border-white/40
                           shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_3px_0_rgba(150,54,0,0.5)]">
                <span class="text-sm font-black text-slate-900 w-6">3°</span>
                <span class="text-sm font-black text-slate-900">10 Referidos</span>
              </div>
            </div>
          </div>

          <!-- Why compete section -->
          <div class="liquid-glass-card p-4 flex flex-col items-center gap-2 text-center">
            <span class="text-3xl">⁉️</span>
            <h3 class="text-sm font-black text-white uppercase tracking-wide">¿Por qué compites?</h3>
            <p class="text-sm font-semibold text-white/70 leading-relaxed">
              Te coronarás como campeón si logras invitar más jugadores que los demás competidores en la próxima semana.
            </p>
          </div>

        </div>
      </app-glass-modal>
    `,
    styles: [`:host { display: block; }
      @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankInfoModalComponent {
    close = output<void>();
}
