import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-liquid-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [class]="btnClass()"
      [disabled]="disabled()"
      (click)="onClick()"
      type="button"
    >
      @if (loading()) {
        <span class="inline-flex items-center gap-2">
          <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <ng-content />
        </span>
      } @else {
        <ng-content />
      }
    </button>
  `,
})
export class LiquidButtonComponent {
  variant = input<ButtonVariant>('outline');
  size = input<ButtonSize>('md');
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  extraClass = input<string>('');

  clicked = output<void>();

  btnClass = computed(() => {
    const variantClass = `lg-btn-${this.variant()}`;
    const sizeMap: Record<ButtonSize, string> = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3 text-base'
    };
    const disabledClass = this.disabled() || this.loading()
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : '';
    return [variantClass, sizeMap[this.size()], disabledClass, this.extraClass()]
      .filter(Boolean).join(' ');
  });

  onClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
