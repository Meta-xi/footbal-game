import { Injectable, inject, signal, computed } from '@angular/core';
import { UserInfoService, UserStatusResponse, SettingsInfo } from './user-info.service';

// Level thresholds based on totalTooks (same as LocalApiService)
const LEVEL_THRESHOLDS = [
  { level: 1, tooksRequired: 0 },
  { level: 2, tooksRequired: 120 },
  { level: 3, tooksRequired: 300 },
  { level: 4, tooksRequired: 1100 },
  { level: 5, tooksRequired: 1600 },
  { level: 6, tooksRequired: 2100 },
  { level: 7, tooksRequired: 3200 },
  { level: 8, tooksRequired: 4100 },
];

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  private userInfoService = inject(UserInfoService);

  // Core state signals
  readonly userStatus = signal<UserStatusResponse | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Individual data signals for granular reactivity
  readonly referrealId = signal<string | null>(null);
  readonly wallet = signal<UserStatusResponse['wallet'] | null>(null);
  readonly settings = signal<UserStatusResponse['settings'] | null>(null);
  readonly actualInversion = signal<UserStatusResponse['actualInversion'] | null>(null);
  readonly skillsLevelReport = signal<UserStatusResponse['skillsLevelReport'] | null>(null);
  readonly earnPerHour = signal<number>(0);
  readonly totalTooks = computed(() => this.wallet()?.totalTooks ?? 0);

  // Computed signals
  readonly hasReferralId = computed(() => this.referrealId() !== null && this.referrealId() !== '');
  readonly isAuthenticated = computed(() => this.userStatus() !== null);
  
  // Level computed from totalTooks
  readonly level = computed(() => {
    const tooks = this.totalTooks();
    let currentLevel = 1;
    for (const threshold of LEVEL_THRESHOLDS) {
      if (tooks >= threshold.tooksRequired) {
        currentLevel = threshold.level;
      }
    }
    return currentLevel;
  });
  
  // Level info computed
  readonly levelInfo = computed(() => {
    const tooks = this.totalTooks();
    const currentLevel = this.level();
    const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel);
    const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
    
    return {
      level: currentLevel,
      currentTooks: tooks,
      tooksForNextLevel: nextThreshold?.tooksRequired ?? currentThreshold?.tooksRequired ?? 0,
      tooksToNextLevel: nextThreshold ? nextThreshold.tooksRequired - tooks : 0,
      isMaxLevel: currentLevel >= 8,
    };
  });

  async loadUserStatus(pendingTaps?: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    const result = await this.userInfoService.getUserStatus(pendingTaps);

    if (result.success && result.data) {
      const data = result.data;
      this.userStatus.set(data);
      this.referrealId.set(data.referrealId);
      this.wallet.set(data.wallet);
      this.settings.set(data.settings);
      this.actualInversion.set(data.actualInversion);
      this.skillsLevelReport.set(data.skillsLevelReport);
      this.earnPerHour.set(data.earnPerHour);
    } else {
      console.error('UserStatusService: Failed to load user status:', result.error);
      this.error.set(result.error ?? 'Failed to load user status');
    }

    this.isLoading.set(false);
  }

  setSettings(newSettings: Partial<SettingsInfo>): void {
    this.settings.update(current => current ? { ...current, ...newSettings } : null);
  }

  clearUserStatus(): void {
    this.userStatus.set(null);
    this.referrealId.set(null);
    this.wallet.set(null);
    this.settings.set(null);
    this.actualInversion.set(null);
    this.skillsLevelReport.set(null);
    this.earnPerHour.set(0);
    this.error.set(null);
    this.isLoading.set(false);
  }
}
