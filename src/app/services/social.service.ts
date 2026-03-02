import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Referral {
    id: number;
    username: string;
    joinedAt: string;
    status: 'active' | 'inactive';
    totalEarningsFromReferral: number;
}

export interface ReferralStats {
    totalReferrals: number;
    activeReferrals: number;
    totalEarningsFromReferrals: number;
    bonus: number;
    commissionRate: number;
}

export interface SocialNetwork {
    id: number;
    name: string;
    connected: boolean;
    followers: number;
    icon: string;
}

export interface SocialData {
    referrals: Referral[];
    referralStats: ReferralStats;
    socialNetworks: SocialNetwork[];
}

@Injectable({
    providedIn: 'root',
})
export class SocialService {
    private http = inject(HttpClient);
    private readonly API_URL = '/api/social.json';

    socialData = signal<SocialData | null>(null);
    isLoading = signal(false);
    error = signal<string | null>(null);

    loadSocial() {
        this.isLoading.set(true);
        this.error.set(null);

        this.http.get<SocialData>(this.API_URL).subscribe({
            next: (data) => {
                this.socialData.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.error.set('Error cargando datos sociales');
                this.isLoading.set(false);
                console.error('Error loading social data:', err);
            }
        });
    }

    getReferrals(): Referral[] {
        return this.socialData()?.referrals || [];
    }

    getReferralStats(): ReferralStats | null {
        return this.socialData()?.referralStats || null;
    }

    getSocialNetworks(): SocialNetwork[] {
        return this.socialData()?.socialNetworks || [];
    }

    getActiveSocialNetworks(): SocialNetwork[] {
        return this.getSocialNetworks().filter(network => network.connected);
    }

    connectNetwork(networkId: number) {
        const currentData = this.socialData();
        if (currentData) {
            const network = currentData.socialNetworks.find(n => n.id === networkId);
            if (network) {
                network.connected = true;
                this.socialData.set({ ...currentData });
            }
        }
    }
}
