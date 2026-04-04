import { ChangeDetectionStrategy, Component, input, output, signal, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-level-up-animation',
  imports: [],
  templateUrl: './level-up-animation.component.html',
  styleUrls: ['./level-up-animation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelUpAnimationComponent {
  readonly newLevel = input.required<number>();
  readonly oldLevel = input.required<number>();
  readonly animationFinished = output<void>();

  show = signal(false);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => {
        this.show.set(true);
      }, 100);
    });
  }

  close(): void {
    this.show.set(false);
    // Allow fade-out animation to complete before emitting event
    setTimeout(() => {
      this.animationFinished.emit();
    }, 500);
  }
}
