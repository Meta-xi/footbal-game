import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

type RankTabId = 'weekly' | 'all';

interface RankTab {
    id: RankTabId;
    label: string;
}

@Component({
    selector: 'app-rank-tabs',
    template: `
      <div class="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/10" role="tablist" aria-label="Tabs de clasificación">
        @for (tab of tabs(); track tab.id) {
          <button
            type="button"
            role="tab"
            class="flex-1 py-2.5 px-4 rounded-xl text-sm font-black uppercase tracking-wide transition-all duration-200"
            [class.bg-white]="activeTab() === tab.id"
            [class.text-slate-900]="activeTab() === tab.id"
            [class.shadow-lg]="activeTab() === tab.id"
            [class.text-white]="activeTab() !== tab.id"
            [class.opacity-40]="activeTab() !== tab.id"
            [attr.aria-selected]="activeTab() === tab.id"
            (click)="selectTab(tab.id)">
            {{ tab.label }}
          </button>
        }
      </div>
    `,
    styles: [`:host { display: block; }`],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankTabsComponent {
    tabs = input<RankTab[]>([]);
    activeTab = input<RankTabId>('weekly');

    tabChange = output<RankTabId>();

    readonly activeLabel = computed(() => this.tabs().find((tab) => tab.id === this.activeTab())?.label ?? '');

    selectTab(tabId: RankTabId) {
        this.tabChange.emit(tabId);
    }
}
