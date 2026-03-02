import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RankInfoModalComponent } from './rank-info-modal/rank-info-modal.component';

type PodiumEntry = {
    id: string;
    name: string;
    score: number;
    avatar: string;
};

type PodiumItem = PodiumEntry & { rank: number };

@Component({
    selector: 'app-rank-podium',
    imports: [NgOptimizedImage, RankInfoModalComponent],
    template: `
      <section class="relative rounded-3xl p-5
                      bg-gradient-to-b from-white/[0.14] to-white/[0.05]
                      border border-white/15
                      shadow-[0_10px_26px_rgba(8,16,52,0.45),inset_0_1px_0_rgba(255,255,255,0.2)]"
               aria-label="Podio de ganadores">

        <!-- Help button -->
        <button type="button"
                class="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center
                       bg-gradient-to-b from-blue-400 to-blue-600 border border-white/30
                       text-white font-black text-sm
                       shadow-[0_2px_8px_rgba(33,150,243,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]
                       active:scale-90 transition-transform z-10"
                aria-label="Ayuda"
                (click)="openInfoModal()">?</button>

        <!-- Title -->
        <div class="flex justify-center mb-4">
          <span class="px-5 py-2 rounded-2xl font-black text-base text-white uppercase tracking-tight
                       bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-white/35
                       shadow-[inset_0_2px_0_rgba(255,255,255,0.45),0_5px_0_rgba(8,20,72,0.85)]
                       [text-shadow:0_3px_0_rgba(12,25,82,0.85)]">
            Carrera semanal
          </span>
        </div>

        <!-- Podium grid: order is 2nd, 1st, 3rd -->
        <div class="grid grid-cols-3 gap-2 items-end">
          @for (winner of podiumOrder(); track winner.id) {
            <div class="flex flex-col items-center gap-2 rounded-[20px] px-2.5 py-3 border-[3px] relative"
                 [class.-translate-y-3]="winner.rank === 1"
                 [class.from-amber-100]="winner.rank === 1"
                 [class.to-amber-300]="winner.rank === 1"
                 [class.border-white]="winner.rank === 1"
                 [class.shadow-[inset_0_2px_0_rgba(255,255,255,0.85),0_7px_0_rgba(120,53,15,0.45)]]="winner.rank === 1"
                 [class.from-blue-100]="winner.rank !== 1"
                 [class.to-blue-300]="winner.rank !== 1"
                 [class.border-white]="winner.rank !== 1"
                 [class.bg-gradient-to-b]="true">

              <!-- Rank badge -->
              <div class="rounded-full flex items-center justify-center font-black border-2 border-white/50
                           shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_4px_0_rgba(0,0,0,0.3)]"
                   [class.w-11]="winner.rank === 1"
                   [class.h-11]="winner.rank === 1"
                   [class.text-2xl]="winner.rank === 1"
                   [class.w-9]="winner.rank !== 1"
                   [class.h-9]="winner.rank !== 1"
                   [class.text-xl]="winner.rank !== 1"
                   [class.bg-gradient-to-b]="true"
                   [class.from-amber-300]="winner.rank === 1"
                   [class.to-amber-500]="winner.rank === 1"
                   [class.text-slate-900]="winner.rank === 1"
                   [class.from-slate-300]="winner.rank === 2"
                   [class.to-slate-500]="winner.rank === 2"
                   [class.text-white]="winner.rank !== 1"
                   [class.from-orange-300]="winner.rank === 3"
                   [class.to-orange-500]="winner.rank === 3">
                {{ winner.rank }}
              </div>

              <!-- Avatar -->
              <div class="rounded-[18px] overflow-hidden border-4 bg-white
                           shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_0_rgba(30,47,100,0.8)]"
                   [class.w-20]="winner.rank === 1"
                   [class.h-20]="winner.rank === 1"
                   [class.w-16]="winner.rank !== 1"
                   [class.h-16]="winner.rank !== 1"
                   [class.border-amber-400]="winner.rank === 1"
                   [class.border-blue-300]="winner.rank !== 1">
                <img [ngSrc]="winner.avatar" [alt]="winner.name"
                     [width]="winner.rank === 1 ? 80 : 64"
                     [height]="winner.rank === 1 ? 80 : 64"
                     class="w-full h-full object-cover" priority />
              </div>

              <!-- Name & Score -->
              <span class="text-[11px] font-black text-slate-900 text-center leading-tight [text-shadow:0_1px_2px_rgba(255,255,255,0.7)]">{{ winner.name }}</span>
              <span class="text-[9px] font-bold text-slate-800 [text-shadow:0_1px_1px_rgba(255,255,255,0.5)]">{{ winner.score }} pts</span>
            </div>
          }
        </div>
      </section>

      @if (isInfoModalOpen()) {
        <app-rank-info-modal (close)="closeInfoModal()" />
      }
    `,
    styles: [`:host { display: block; }`],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankPodiumComponent {
    podium = input<PodiumEntry[]>([]);
    readonly isInfoModalOpen = signal(false);

    readonly podiumOrder = computed((): PodiumItem[] => {
        const items = this.podium();
        if (items.length < 3) return items.map((item, i) => ({ ...item, rank: i + 1 }));
        const first: PodiumItem = { ...items[0], rank: 1 };
        const second: PodiumItem = { ...items[1], rank: 2 };
        const third: PodiumItem = { ...items[2], rank: 3 };
        return [second, first, third].filter(Boolean);
    });

    openInfoModal(): void {
        this.isInfoModalOpen.set(true);
    }

    closeInfoModal(): void {
        this.isInfoModalOpen.set(false);
    }
}
