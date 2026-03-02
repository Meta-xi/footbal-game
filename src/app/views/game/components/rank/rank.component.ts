import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RankCountdownComponent } from './components/rank-countdown/rank-countdown.component';
import { RankPodiumComponent } from './components/rank-podium/rank-podium.component';
import { RankPrizesComponent } from './components/rank-prizes/rank-prizes.component';
import { RankTabsComponent } from './components/rank-tabs/rank-tabs.component';
import { BottomNavComponent } from '../../../../shared/bottom-nav/bottom-nav.component';

type RankTabId = 'weekly' | 'all';

interface RankTab {
    id: RankTabId;
    label: string;
}

interface Prize {
    place: number;
    amount: number;
    icon: string;
}

interface RankEntry {
    id: string;
    name: string;
    score: number;
    avatar: string;
    position: number;
}

@Component({
    selector: 'app-rank',
    imports: [
        RankTabsComponent,
        RankCountdownComponent,
        RankPrizesComponent,
        RankPodiumComponent,
        BottomNavComponent,
    ],
    template: `
      <section class="min-h-dvh flex flex-col w-full relative"
               style="padding-top: env(safe-area-inset-top, 1rem)">

        <!-- Header -->
        <header class="w-full relative z-10 px-4 pt-4 pb-3 flex flex-col items-center gap-4">
          <div class="flex flex-col items-center">
            <span class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Competencia Global</span>
            <h1 class="text-xl font-black text-white tracking-tighter uppercase"
                style="text-shadow:0 0 20px rgba(255,255,255,0.25)">Hall de la Fama</h1>
          </div>

          <div class="w-full liquid-glass-card p-1">
            <app-rank-tabs [tabs]="tabs()" [activeTab]="activeTab()" (tabChange)="setActiveTab($event)" />
          </div>
        </header>

        <!-- Scrollable content -->
        <div class="flex-1 w-full relative z-10 flex flex-col overflow-y-auto pb-24 px-4 gap-6">

          <!-- Podium -->
          <app-rank-podium [podium]="podium()" />

          <!-- Season rewards card -->
          <div class="liquid-glass-card p-5 flex flex-col gap-4">
            <header class="flex justify-between items-center gap-4">
              <h2 class="text-base font-black text-white tracking-tight uppercase">Recompensas de Temporada</h2>
              <app-rank-countdown [periodLabel]="'Termina en'" [days]="5" [hours]="5" [minutes]="5" />
            </header>
            <app-rank-prizes [prizes]="prizes()" />
          </div>

        </div>

        <!-- Bottom Nav -->
        <app-bottom-nav class="fixed bottom-0 left-0 right-0 z-50" />
      </section>
    `,
    styles: [`:host { display: block; }`],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RankComponent {
    readonly tabs = signal<RankTab[]>([
        { id: 'weekly', label: 'Semanal' },
        { id: 'all', label: 'Todos los jugadores' },
    ]);

    readonly activeTab = signal<RankTabId>('weekly');

    readonly prizes = signal<Prize[]>([
        { place: 1, amount: 50000, icon: '🪙' },
        { place: 2, amount: 15000, icon: '🪙' },
        { place: 3, amount: 5000, icon: '🪙' },
    ]);

    readonly weeklyEntries = signal<RankEntry[]>([
        { id: 'rank-1', name: 'Luna ⭐️', score: 29, avatar: 'players/cr7.png', position: 1 },
        { id: 'rank-2', name: 'Isabel', score: 20, avatar: 'players/cr7.jpg', position: 2 },
        { id: 'rank-3', name: 'Nuno', score: 10, avatar: 'players/image-removebg-preview.png', position: 3 },
        { id: 'rank-4', name: 'Playere174', score: 6, avatar: 'players/cr7.png', position: 4 },
        { id: 'rank-5', name: 'Sergio', score: 6, avatar: 'players/cr7.jpg', position: 5 },
        { id: 'rank-6', name: 'Playero48', score: 4, avatar: 'players/image-removebg-preview.png', position: 6 },
        { id: 'rank-7', name: 'Érica', score: 4, avatar: 'players/cr7.png', position: 7 },
        { id: 'rank-8', name: 'Andrés', score: 3, avatar: 'players/cr7.jpg', position: 8 },
    ]);

    readonly allEntries = signal<RankEntry[]>([
        { id: 'rank-all-1', name: 'Luna ⭐️', score: 129, avatar: 'players/cr7.png', position: 1 },
        { id: 'rank-all-2', name: 'Isabel', score: 102, avatar: 'players/cr7.jpg', position: 2 },
        { id: 'rank-all-3', name: 'Nuno', score: 87, avatar: 'players/image-removebg-preview.png', position: 3 },
        { id: 'rank-all-4', name: 'Playere174', score: 66, avatar: 'players/cr7.png', position: 4 },
        { id: 'rank-all-5', name: 'Sergio', score: 58, avatar: 'players/cr7.jpg', position: 5 },
        { id: 'rank-all-6', name: 'Playero48', score: 54, avatar: 'players/image-removebg-preview.png', position: 6 },
        { id: 'rank-all-7', name: 'Érica', score: 42, avatar: 'players/cr7.png', position: 7 },
        { id: 'rank-all-8', name: 'Andrés', score: 38, avatar: 'players/cr7.jpg', position: 8 },
        { id: 'rank-all-9', name: 'Camila', score: 32, avatar: 'players/image-removebg-preview.png', position: 9 },
    ]);

    readonly currentEntries = computed(() =>
        this.activeTab() === 'weekly' ? this.weeklyEntries() : this.allEntries()
    );

    readonly podium = computed(() => this.currentEntries().slice(0, 3));
    readonly listEntries = computed(() => this.currentEntries().slice(3));

    setActiveTab(tabId: RankTabId) {
        this.activeTab.set(tabId);
    }
}
