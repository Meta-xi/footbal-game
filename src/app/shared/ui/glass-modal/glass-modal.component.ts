import { Component, ChangeDetectionStrategy, input, output, HostListener } from '@angular/core';

@Component({
  selector: 'app-glass-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="lg-modal-backdrop"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-label]="title() || 'Modal'"
        (click)="onBackdropClick($event)"
      >
        <div
          class="lg-modal-panel"
          (click)="$event.stopPropagation()"
        >
          @if (title()) {
            <div class="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <h3 class="text-white font-semibold text-base">{{ title() }}</h3>
              <button
                class="lg-icon-btn w-7 h-7 text-white/70"
                (click)="close()"
                type="button"
                aria-label="Close modal"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          }
          <div [class.px-6]="!compact()" [class.py-6]="!compact()" [class.px-5]="compact()" [class.py-3.5]="compact()">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
})
export class GlassModalComponent {
  isOpen = input<boolean>(false);
  compact = input<boolean>(false);
  title = input<string>('');

  closed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.close();
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
