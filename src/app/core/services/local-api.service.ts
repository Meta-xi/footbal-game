import { Injectable, inject, signal, computed } from '@angular/core';
import { UserStatusService } from './user-status.service';
import type { Boost, ActiveBoost, TapConfig } from '../../models/game.model';

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
    private _boosts = signal<Boost[]>([]);
    private _activeBoosts = signal<ActiveBoost[]>([]);
    private _tapConfig = signal<TapConfig | null>(null);
    private _isInitialized = signal(false);
    private _levelUp = signal<{ newLevel: number; oldLevel: number } | null>(null);

    // Public readonly signals
    readonly boosts = this._boosts.asReadonly();
    readonly activeBoosts = this._activeBoosts.asReadonly();
    readonly tapConfig = this._tapConfig.asReadonly();
    readonly isInitialized = this._isInitialized.asReadonly();
    readonly levelUp = this._levelUp.asReadonly();

    // Computed values
    readonly currentEnergy = computed(() => this.userStatusService.wallet()?.energy ?? 0);
    readonly maxEnergy = computed(() => {
        const skills = this.userStatusService.skillsLevelReport();
        return 500 + ((skills?.maxEnergyLVL ?? 0) * 100);
    });

    readonly tapValue = computed(() => {
        const config = this._tapConfig();
        if (!config) return 10;

        const level = this.userStatusService.level();
        const levelMultiplier = config.levelBonus.find(b => b.level === level)?.multiplier ?? 1;
        return Math.floor(config.baseValue * config.currentMultiplier * levelMultiplier);
    });

    readonly activeMultiplier = computed(() => {
        const activeBoosts = this._activeBoosts();
        const boosts = this._boosts();
        const now = Date.now();

        let multiplier = 1;
        for (const active of activeBoosts) {
            if (active.expiresAt && new Date(active.expiresAt).getTime() < now) continue;
            const boost = boosts.find(b => b.id === active.boostId);
            if (boost?.multiplier) {
                multiplier *= boost.multiplier;
            }
        }
        return multiplier;
    });

    initialize(): void {
        this._boosts.set([]);
        this._activeBoosts.set([]);
        this._tapConfig.set(DEFAULT_TAP_CONFIG);
        this.cleanExpiredBoosts();
        this._isInitialized.set(true);
    }

    private cleanExpiredBoosts(): void {
        const now = Date.now();
        const active = this._activeBoosts().filter(b => {
            if (!b.expiresAt) return true;
            return new Date(b.expiresAt).getTime() > now;
        });
        this._activeBoosts.set(active);
    }

    clearLevelUp(): void {
        this._levelUp.set(null);
    }
}
