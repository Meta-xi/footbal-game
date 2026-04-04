import { Injectable, inject, computed } from '@angular/core';
import { UserStatusService } from './user-status.service';
import { UserInfoService } from './user-info.service';

export interface EnergyData {
  currentEnergy: number;
  maxEnergy: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnergyService {
  private userStatusService = inject(UserStatusService);
  private userInfo = inject(UserInfoService);

  // Signals conectados directamente a UserStatusService
  readonly energy = computed(() => this.userStatusService.wallet()?.energy ?? 0);
  readonly maxEnergy = computed(() => {
    const skills = this.userStatusService.skillsLevelReport();
    return 500 + ((skills?.maxEnergyLVL ?? 0) * 100);
  });

  // La energía viene del UserStatusService (API)
  // No se modifica localmente, viene del servidor

  readonly error = computed(() => null);

  decrementEnergy(amount: number) {
    // Ya no se modifica localmente - la energía viene de la API
    // El consumo de energía se maneja en el backend
    console.warn('Energy decrement should be handled by API');
  }

  incrementEnergy(amount: number) {
    // Ya no se modifica localmente - la energía viene de la API
    console.warn('Energy increment should be handled by API');
  }

  loadEnergy() {
    // Recargar el estado del usuario desde la API
    this.userStatusService.loadUserStatus();
  }

  getCurrentEnergy(): number {
    return this.userStatusService.wallet()?.energy ?? 0;
  }

  getMaxEnergy(): number {
    const skills = this.userStatusService.skillsLevelReport();
    return 500 + ((skills?.maxEnergyLVL ?? 0) * 100);
  }

  async applyBoost(boostId: number) {
    const result = await this.userInfo.purchaseSkill(boostId);
    if (result.success) {
      return null;
    }
    return null;
  }

  async purchaseBoost(boostId: number): Promise<{ success: boolean; message: string }> {
    const result = await this.userInfo.purchaseSkill(boostId);
    return { success: result.success, message: result.message ?? result.error ?? 'Unknown error' };
  }
}
