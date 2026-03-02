import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

type BadgeVariant = 'default' | 'active' | 'warning' | 'error';

@Component({
  selector: 'app-glass-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="badgeClass()">
      @if (dot()) {
        <span class="lg-badge-dot"></span>
      }
      <ng-content />
    </span>
  `,
})
export class GlassBadgeComponent {
  variant = input<BadgeVariant>('default');
  dot = input<boolean>(false);
  extraClass = input<string>('');

  badgeClass = computed(() => {
    const variantClass = this.variant() !== 'default' ? `lg-badge--${this.variant()}` : '';
    return ['lg-badge', variantClass, this.extraClass()].filter(Boolean).join(' ');
  });
}
