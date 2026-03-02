import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

type CardVariant = 'panel' | 'module' | 'card';
type CardTint = 'none' | 'amber' | 'cyan' | 'magenta';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-glass-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="hostClass()">
      <ng-content />
    </div>
  `,
  styles: [`
    :host { display: contents; }
  `]
})
export class GlassCardComponent {
  variant = input<CardVariant>('panel');
  tint = input<CardTint>('none');
  padding = input<CardPadding>('md');
  extraClass = input<string>('');

  hostClass = computed(() => {
    const variantClass = `lg-card-${this.variant()}`;
    const tintClass = this.tint() !== 'none' ? `lg-tint-${this.tint()}` : '';
    const paddingMap: Record<CardPadding, string> = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };
    const paddingClass = paddingMap[this.padding()];
    return [variantClass, tintClass, paddingClass, this.extraClass()]
      .filter(Boolean).join(' ');
  });
}
