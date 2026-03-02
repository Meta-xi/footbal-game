import { ChangeDetectionStrategy, Component, input } from '@angular/core';

interface Prize {
    place: number;
    amount: number;
    icon: string;
}

@Component({
    selector: 'app-rank-prizes',
    template: `
      <div class="grid grid-cols-3 gap-3" aria-label="Premios">
        @for (prize of prizes(); track prize.place; let i = $index) {
          <div class="flex flex-col items-center gap-2 p-3 rounded-2xl border-2"
               [class.bg-gradient-to-b]="true"
               [class.from-amber-200]="i === 0"
               [class.to-amber-400]="i === 0"
               [class.from-slate-200]="i === 1"
               [class.to-slate-400]="i === 1"
               [class.from-orange-300]="i === 2"
               [class.to-orange-500]="i >= 2"
               [class.border-white]="true">
            <span class="text-[9px] font-black text-slate-900/80 uppercase tracking-wide">Lugar {{ prize.place }}</span>
            <span class="text-xl">{{ prize.icon }}</span>
            <span class="text-sm font-black text-slate-900 tabular-nums">{{ prize.amount.toLocaleString('es-CO') }}</span>
          </div>
        }
      </div>
    `,
    styles: [`:host { display: block; }`],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankPrizesComponent {
    prizes = input<Prize[]>([]);
}
