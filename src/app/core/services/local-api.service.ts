import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { UserStatusService } from './user-status.service';
import type { TapConfig } from '../../models/game.model';

const DEFAULT_TAP_CONFIG: TapConfig = {
    baseValue: 1,
    currentMultiplier: 1,
    maxMultiplier: 10,
    levelBonus: [
        { level: 1, multiplier: 1.0 },
        { level: 2, multiplier: 1.2 },
        { level: 3, multiplier: 1.5 },
        { level: 4, multiplier: 2.0 },
        { level: 5, multiplier: 2.5 },
        { level: 6, multiplier: 3.0 },
        { level: 7, multiplier: 3.5 },
        { level: 8, multiplier: 4.0 },
        { level: 9, multiplier: 4.5 },
        { level: 10, multiplier: 5.0 },
    ],
};

@Injectable({
    providedIn: 'root'
})
export class LocalApiService {
    private userStatusService = inject(UserStatusService);

    // Signals
    private _tapConfig = signal<TapConfig>(DEFAULT_TAP_CONFIG);
    private _levelUp = signal<{ newLevel: number; oldLevel: number } | null>(null);
    private previousLevel = 0;

    // Public readonly signals
    readonly tapConfig = this._tapConfig.asReadonly();
    readonly levelUp = this._levelUp.asReadonly();

    // Computed values
    readonly tapValue = computed(() => {
        const config = this._tapConfig();
        const level = this.userStatusService.level();
        const levelMultiplier = config.levelBonus.find(b => b.level === level)?.multiplier ?? 1;
        return Math.floor(config.baseValue * config.currentMultiplier * levelMultiplier);
    });

    constructor() {
        effect(() => {
            const current = this.userStatusService.level();
            if (this.previousLevel > 0 && current !== this.previousLevel) {
                this._levelUp.set({ oldLevel: this.previousLevel, newLevel: current });
            }
            this.previousLevel = current;
        });
    }

    clearLevelUp(): void {
        this._levelUp.set(null);
    }
}
