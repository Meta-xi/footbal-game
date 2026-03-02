import { Injectable, inject, computed } from '@angular/core';
import { LocalApiService, EarningSource } from './local-api.service';

export type { EarningSource };

export interface GameStats {
    level: number;
    experience: number;
    experienceToNextLevel: number;
    totalTaps: number;
    sessionTaps: number;
    earning: number;
    hourlyEarning: number;
}

export interface TapValue {
    level: number;
    multiplier: number;
}

export interface GameData {
    gameStats: GameStats;
    tapValues: {
        baseValue: number;
        currentMultiplier: number;
        maxMultiplier: number;
        levelBonus: TapValue[];
    };
    perHourEarnings: EarningSource[];
}

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private localApi = inject(LocalApiService);

    readonly gameData = computed(() => {
        const profile = this.localApi.profile();
        const stats = this.localApi.stats();
        const gameState = this.localApi.gameState();
        const tapConfig = this.localApi.tapConfig();
        const perHourEarnings = this.localApi.perHourEarnings();

        if (!profile || !stats || !gameState || !tapConfig) return null;

        return {
            gameStats: {
                level: profile.level,
                experience: gameState.experience,
                experienceToNextLevel: gameState.experienceToNextLevel,
                totalTaps: stats.totalTaps,
                sessionTaps: gameState.sessionTaps,
                earning: this.localApi.tapValue(),
                hourlyEarning: stats.hourlyEarning,
            },
            tapValues: tapConfig,
            perHourEarnings,
        } as GameData;
    });

    readonly isLoading = computed(() => !this.localApi.isInitialized());
    readonly error = computed(() => null);

    loadGame() {
        // No necesario, los datos ya están en LocalApiService
    }

    getGameStats(): GameStats | null {
        return this.gameData()?.gameStats || null;
    }

    getTapValues() {
        return this.localApi.tapConfig();
    }

    getPerHourEarnings(): EarningSource[] {
        return this.localApi.perHourEarnings();
    }

    addTap(value: number = 1) {
        this.localApi.incrementTaps(value);
    }

    resetSessionTaps() {
        this.localApi.updateGameState({ sessionTaps: 0 });
    }

    addExperience(amount: number) {
        this.localApi.addExperience(amount);
    }
}
