import { Component, ChangeDetectionStrategy, input, output, HostListener } from '@angular/core';

@Component({
  selector: 'app-glass-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div
        class="lg-sheet-backdrop"
        (click)="close()"
        role="presentation"
      ></div>

      <!-- Sheet panel -->
      <div
        class="lg-sheet-panel"
        role="dialog"
        [attr.aria-label]="title() || 'Sheet'"
        [style.max-height]="maxHeight()"
        [style.overflow-y]="'auto'"
      >
        <!-- Drag handle -->
        <div class="lg-sheet-handle"></div>

        @if (title()) {
          <div class="flex items-center justify-between px-6 py-4">
            <h3 class="text-white font-semibold text-lg">{{ title() }}</h3>
            <button
              class="lg-icon-btn w-8 h-8 text-white/70"
              (click)="close()"
              type="button"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        }

        <div class="px-6 pb-8">
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class GlassSheetComponent {
  isOpen = input<boolean>(false);
  title = input<string>('');
  maxHeight = input<string>('80vh');

  closed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
