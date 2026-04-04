import { ChangeDetectionStrategy, Component, input, output, signal, inject, afterNextRender } from '@angular/core';
import { UserStatusService } from '../../../core/services/user-status.service';

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

  private userStatusService = inject(UserStatusService);

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
      this.userStatusService.levelUp.set(null);
      this.animationFinished.emit();
    }, 500);
  }
}
