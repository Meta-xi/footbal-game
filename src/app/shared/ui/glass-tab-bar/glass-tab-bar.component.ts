import { Component, ChangeDetectionStrategy, input, model, OnInit, computed } from '@angular/core';

export interface GlassTab {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-glass-tab-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lg-tab-bar w-full flex overflow-x-auto scrollbar-hide relative">
      <!-- Sliding Glass Indicator -->
      <div class="absolute inset-[3px] z-0 pointer-events-none">
        <div class="h-full bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-800 cubic-bezier(0.2, 1, 0.3, 1)"
          [style.width.%]="100 / (tabs().length || 1)"
          [style.transform]="'translateX(' + (activeIndex() * 100) + '%)'">
          <div class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 rounded-full"></div>
        </div>
      </div>

      @for (tab of tabs(); track tab.id) {
        <button
          type="button"
          [class]="tabClass(tab.id) + ' flex-1 relative z-10'"
          (click)="selectTab(tab.id)"
        >
          @if (tab.icon) {
            <span class="text-base leading-none" [innerHTML]="tab.icon"></span>
          }
          {{ tab.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* Override active background since the indicator covers it */
    :host ::ng-deep .lg-tab-item.lg-tab-item--active {
      background: transparent !important;
      box-shadow: none !important;
    }
  `]
})
export class GlassTabBarComponent implements OnInit {
  tabs = input<GlassTab[]>([]);
  activeTab = model<string>('');

  activeIndex = computed(() => {
    const current = this.activeTab();
    return this.tabs().findIndex(t => t.id === current);
  });

  tabClass(id: string): string {
    return ['lg-tab-item', id === this.activeTab() ? 'lg-tab-item--active' : ''].filter(Boolean).join(' ');
  }

  ngOnInit(): void {
    if (!this.activeTab() && this.tabs().length > 0) {
      this.activeTab.set(this.tabs()[0].id);
    }
  }

  selectTab(id: string): void {
    this.activeTab.set(id);
  }
}
