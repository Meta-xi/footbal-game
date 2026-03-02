import { Injectable, inject, computed } from '@angular/core';
import { LocalApiService, UserProfile, UserStats } from './local-api.service';

export type { UserProfile, UserStats };

export interface UserData {
    profile: UserProfile;
    stats: UserStats;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private localApi = inject(LocalApiService);

    readonly userData = computed(() => {
        const profile = this.localApi.profile();
        const stats = this.localApi.stats();
        if (!profile || !stats) return null;
        return { profile, stats };
    });

    readonly isLoading = computed(() => !this.localApi.isInitialized());
    readonly error = computed(() => null);

    loadUser() {
        // No necesario, los datos ya están en LocalApiService
    }

    getProfile(): UserProfile | null {
        return this.localApi.profile();
    }

    getStats(): UserStats | null {
        return this.localApi.stats();
    }

    updateBalance(amount: number) {
        this.localApi.updateBalance(amount);
    }

    addEarnings(amount: number) {
        this.localApi.addEarnings(amount);
    }
}
