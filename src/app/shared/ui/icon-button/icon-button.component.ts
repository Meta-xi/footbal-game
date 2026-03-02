import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

type IconBtnSize = 'sm' | 'md' | 'lg';
type IconBtnVariant = 'default' | 'accent' | 'cyan';

@Component({
  selector: 'app-icon-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [class]="btnClass()"
      (click)="onClick()"
      type="button"
      [attr.aria-pressed]="active()"
    >
      <ng-content />
    </button>
  `,
})
export class IconButtonComponent {
  size = input<IconBtnSize>('md');
  active = input<boolean>(false);
  variant = input<IconBtnVariant>('default');
  extraClass = input<string>('');

  clicked = output<void>();

  btnClass = computed(() => {
    const sizeMap: Record<IconBtnSize, string> = {
      sm: 'w-8 h-8',
      md: 'w-11 h-11',
      lg: 'w-14 h-14'
    };
    const variantClass = this.variant() !== 'default' ? `lg-icon-btn--${this.variant()}` : '';
    const activeClass = this.active() ? 'lg-icon-btn--active' : '';
    return ['lg-icon-btn', sizeMap[this.size()], variantClass, activeClass, this.extraClass()]
      .filter(Boolean).join(' ');
  });

  onClick(): void {
    this.clicked.emit();
  }
}
