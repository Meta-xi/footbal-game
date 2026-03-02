import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-rank-countdown',
    template: `
      <div class="flex items-center gap-2" aria-label="Tiempo restante">
        <span class="text-[9px] font-black text-amber-400 uppercase tracking-widest">{{ periodLabel() }}</span>
        <div class="flex items-center gap-1">
          <div class="flex flex-col items-center px-2 py-1 rounded-lg bg-white/5 border border-white/10">
            <span class="text-sm font-black text-white leading-none">{{ days() }}</span>
            <span class="text-[8px] font-black text-white/30 uppercase tracking-widest">D</span>
          </div>
          <span class="text-white/30 font-black text-xs">:</span>
          <div class="flex flex-col items-center px-2 py-1 rounded-lg bg-white/5 border border-white/10">
            <span class="text-sm font-black text-white leading-none">{{ hours() }}</span>
            <span class="text-[8px] font-black text-white/30 uppercase tracking-widest">H</span>
          </div>
          <span class="text-white/30 font-black text-xs">:</span>
          <div class="flex flex-col items-center px-2 py-1 rounded-lg bg-white/5 border border-white/10">
            <span class="text-sm font-black text-white leading-none">{{ minutes() }}</span>
            <span class="text-[8px] font-black text-white/30 uppercase tracking-widest">M</span>
          </div>
        </div>
      </div>
    `,
    styles: [`:host { display: block; }`],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankCountdownComponent {
    periodLabel = input('1 Semana');
    days = input(5);
    hours = input(5);
    minutes = input(5);
}
