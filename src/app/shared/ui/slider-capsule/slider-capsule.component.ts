import { Component, ChangeDetectionStrategy, computed, input, model } from '@angular/core';

type SliderColor = 'cyan' | 'gold' | 'magenta';

@Component({
  selector: 'app-slider-capsule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lg-slider-capsule" (click)="onTrackClick($event)">
      <!-- Fill track -->
      <div
        [class]="fillClass()"
        [style.width]="fillWidth()"
      ></div>
      <!-- Thumb -->
      <div
        [style.left]="thumbLeft()"
        class="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg shadow-black/40 border-2 border-white/80 cursor-grab active:cursor-grabbing transition-all duration-150 flex items-center justify-center z-10"
        [style.transform]="'translateY(-50%) translateX(-50%)'"
      ></div>
      <!-- Hidden native input for accessibility -->
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [value]="value()"
        (input)="onInput($event)"
        class="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20"
        aria-label="Slider"
      />
    </div>
  `,
})
export class SliderCapsuleComponent {
  value = model<number>(50);
  min = input<number>(0);
  max = input<number>(100);
  colorScheme = input<SliderColor>('cyan');

  fillWidth = computed(() => {
    const pct = ((this.value() - this.min()) / (this.max() - this.min())) * 100;
    return `${Math.max(0, Math.min(100, pct))}%`;
  });

  thumbLeft = computed(() => {
    const pct = ((this.value() - this.min()) / (this.max() - this.min())) * 100;
    return `${Math.max(0, Math.min(100, pct))}%`;
  });

  fillClass = computed(() => 
    `lg-slider-fill-${this.colorScheme()} absolute inset-y-0 left-0 rounded-full transition-all duration-150 ease-out`
  );

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(Number(input.value));
  }

  onTrackClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const pct = (event.clientX - rect.left) / rect.width;
    const newVal = this.min() + pct * (this.max() - this.min());
    this.value.set(Math.round(Math.max(this.min(), Math.min(this.max(), newVal))));
  }
}
