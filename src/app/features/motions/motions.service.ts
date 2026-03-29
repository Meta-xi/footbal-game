import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BackendMission, Mission } from '../../models/mision.model';
import { GlassTab } from '../../shared/ui'; // Added this import
import { environment } from '../../../environments/environment';
import { MotionEvent } from './types/motion-event';

// Interface for completed missions from backend
export interface CompletedMissionBackend {
  id: number;
  userId: number;
  misionesId: number;
  mision?: string | null;
  created: string;
}

export interface CompletedMission {
  id: number;
  userId: number;
  misionesId: number;
  mision?: string | null;
  created: Date;
}



interface DailyReward {
  day: number;
  state: 'claimed' | 'available' | 'upcoming';
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class MotionsService {
  // Mission data
  private readonly missions = signal<Mission[]>([]);
  private readonly loading = signal<boolean>(false);
  private readonly error = signal<string | null>(null);
  private readonly completedMissions = signal<Mission[]>([]);
  private readonly failedMissions = signal<Mission[]>([]);
  private readonly completedMissionRecords = signal<CompletedMission[]>([]);
  private readonly loadingCompletedMissions = signal<boolean>(false);

  // Daily rewards
  private readonly dailyRewards = signal<DailyReward[]>([
    { day: 1, state: 'claimed', icon: 'motions/daily/reclamed.webp' },
    { day: 2, state: 'claimed', icon: 'motions/daily/reclamed.webp' },
    { day: 3, state: 'available', icon: 'motions/daily/current.webp' },
    { day: 4, state: 'upcoming', icon: 'motions/daily/comingsoon.webp' },
    { day: 5, state: 'upcoming', icon: 'motions/daily/comingsoon.webp' },
    { day: 6, state: 'upcoming', icon: 'motions/daily/comingsoon.webp' },
    { day: 7, state: 'upcoming', icon: 'motions/daily/comingsoon.webp' },
  ]);

  // UI state (matching API categories: 0-whatsapp, 1-facebook, 2-tiktok, 3-youtube, 4-daily, 5-referral)
  private readonly missionTabKeys = ['Whatsapp', 'Facebook', 'TikTok', 'Youtube', 'Daily', 'Referral', 'History'];
  private readonly activeTab = signal<string>('Daily');
  private readonly selectedMission = signal<Mission | null>(null);
  private readonly showHistoryModal = signal<boolean>(false);
  private readonly toastData = signal<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  // Session-persistent tab state for mission history modal (resets on app restart)
  private readonly activeHistoryTab = signal<string>('completadas');
  readonly activeHistoryTab$ = this.activeHistoryTab.asReadonly();
  readonly historyTabs: GlassTab[] = [
    { id: 'completadas', label: 'Completadas' },
    { id: 'fallidas', label: 'Fallidas' }
  ];

  // Events for UI effects (component listens via effect)
  private readonly _lastEvent = signal<MotionEvent | null>(null);
  readonly lastEvent = this._lastEvent.asReadonly();

  private emitEvent(e: MotionEvent) {
    this._lastEvent.set(e);
  }

  // Computed signals
  readonly activeIndex = computed(() => this.missionTabKeys.indexOf(this.activeTab()));
  readonly missions$ = this.missions.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly error$ = this.error.asReadonly();
  readonly whatsappMissions$ = computed(() => this.missions().filter(m => m.category === 'whatsapp'));
  readonly completedMissions$ = computed(() => this.missions().filter(m => m.completed));
  readonly failedMissions$ = computed(() => this.missions().filter(m => !m.completed));
  readonly totalLost$ = computed(() => {
    const failed = this.failedMissions$();
    return failed.reduce((sum, m) => sum + (Number(m.reward) || 0), 0);
  });
  readonly missionHistory$ = computed(() => [...this.completedMissions$(), ...this.failedMissions$()]);
  readonly filteredHistory$ = computed(() => {
    const tab = this.activeHistoryTab();
    const missions = this.missions();
    if (tab === 'completadas') return missions.filter(m => m.completed);
    return missions.filter(m => !m.completed);
  });
  readonly dailyRewards$ = this.dailyRewards.asReadonly();
  readonly activeTab$ = this.activeTab.asReadonly();
  readonly selectedMission$ = this.selectedMission.asReadonly();
  readonly showHistoryModal$ = this.showHistoryModal.asReadonly();
  readonly toastData$ = this.toastData.asReadonly();
  readonly completedMissionRecords$ = this.completedMissionRecords.asReadonly();
  readonly loadingCompletedMissions$ = this.loadingCompletedMissions.asReadonly();

  // Backend integration
  private readonly httpClient = inject(HttpClient);

  async fetchMissions(categoryId?: number | null): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      let params = new HttpParams();
      if (categoryId !== null && categoryId !== undefined && categoryId !== 6) {
        params = params.set('Category', categoryId.toString());
      }
      const response = await firstValueFrom(
        this.httpClient.get<BackendMission[]>(
          `${environment.apiBaseUrl}Misions/GetMisionsInfo`,
          { params }
        )
      );
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
      }
      const missions = response.map(b => this.mapBackendMissionToMission(b));
      this.missions.set(missions);
    } catch (err) {
      console.error('Failed to fetch missions:', err);
      if (err instanceof HttpErrorResponse) {
        if (err.status >= 500) {
          this.error.set('Servidor no disponible. Intenta más tarde.');
        } else {
          this.error.set('Error al cargar misiones. Intenta de nuevo.');
        }
      } else {
        this.error.set('Error al cargar misiones. Intenta de nuevo.');
      }
    } finally {
      this.loading.set(false);
    }
  }

  async fetchCompletedMissions(): Promise<void> {
    this.loadingCompletedMissions.set(true);
    this.error.set(null);
    try {
      const response = await firstValueFrom(
        this.httpClient.get<CompletedMissionBackend[]>(
          `${environment.apiBaseUrl}Misions/GetCompletedMisions`
        )
      );
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
      }
      const completedMissions = response.map(b => this.mapCompletedMissionRecord(b));
      this.completedMissionRecords.set(completedMissions);
    } catch (err) {
      console.error('Failed to fetch completed missions:', err);
      if (err instanceof HttpErrorResponse) {
        if (err.status === 400) {
          this.error.set('Solicitud incorrecta. Verifica los datos.');
          this.showToast('Error: Solicitud incorrecta.', 'error');
        } else if (err.status === 401) {
          this.error.set('No autorizado. Inicia sesión nuevamente.');
          this.showToast('Error: No autorizado.', 'error');
        } else if (err.status >= 500) {
          this.error.set('Servidor no disponible. Intenta más tarde.');
          this.showToast('Error del servidor. Intenta más tarde.', 'error');
        } else {
          this.error.set('Error al cargar misiones completadas. Intenta de nuevo.');
          this.showToast('Error al cargar misiones completadas.', 'error');
        }
      } else {
        this.error.set('Error al cargar misiones completadas. Intenta de nuevo.');
        this.showToast('Error al cargar misiones completadas.', 'error');
      }
    } finally {
      this.loadingCompletedMissions.set(false);
    }
  }

  private mapBackendMissionToMission(b: BackendMission): Mission {
    const categoryStr = this.mapCategoryToString(b.category);
    return {
      id: String(b.id),
      title: b.misionInfo,
      description: b.misionInfo,
      reward: b.misionReward,
      currency: 'COP',
      icon: this.getIconForCategory(b.category),
      completed: false,
      category: categoryStr
    };
  }

  private mapCompletedMissionRecord(b: CompletedMissionBackend): CompletedMission {
    return {
      id: b.id,
      userId: b.userId,
      misionesId: b.misionesId,
      mision: b.mision,
      created: new Date(b.created)
    };
  }

  private getIconForCategory(category: string | number | null): string {
    const icons: Record<string, string> = {
      whatsapp: 'social/icons/Whatsapp_37229.png',
      facebook: 'social/icons/facebook_icon-icons.com_53612.png',
      tiktok: 'social/icons/tiktok_logo_icon_189233.png',
      youtube: 'social/icons/YouTube_23392.png',
      daily: 'social/icons/daily.png',
      referral: 'social/icons/referral.png'
    };
    // Map numeric categories to social icons (0-whatsapp, 1-facebook, 2-tiktok, 3-youtube, 4-daily, 5-referral)
    const numericIcons: Record<number, string> = {
      0: 'social/icons/Whatsapp_37229.png',
      1: 'social/icons/facebook_icon-icons.com_53612.png',
      2: 'social/icons/tiktok_logo_icon_189233.png',
      3: 'social/icons/YouTube_23392.png',
      4: 'social/icons/daily.png',
      5: 'social/icons/referral.png'
    };
    
    if (category === null) return 'social/icons/Whatsapp_37229.png';
    if (typeof category === 'number') {
      return numericIcons[category] || 'social/icons/Whatsapp_37229.png';
    }
    const catLower = category.toLowerCase();
    return icons[catLower] || 'social/icons/Whatsapp_37229.png';
  }

  private mapCategoryToString(category: string | number | null): string {
    if (category === null) return '';
    if (typeof category === 'number') {
      const mapping: Record<number, string> = {
        0: 'whatsapp',
        1: 'facebook',
        2: 'tiktok',
        3: 'youtube',
        4: 'daily',
        5: 'referral'
      };
      return mapping[category] || `category_${category}`;
    }
    // If already a string, return as is (lowercase)
    return category.toLowerCase();
  }

  // Getters for non-signal data
  getMissionTabKeys() {
    return this.missionTabKeys;
  }

  // Methods to update state
  setActiveTab(tab: string): number {
    this.activeTab.set(tab);
    return this.missionTabKeys.indexOf(tab);
  }

  setSelectedMission(mission: Mission | null) {
    this.selectedMission.set(mission);
  }

  setShowHistoryModal(show: boolean) {
    this.showHistoryModal.set(show);
  }

  setActiveHistoryTab(tab: string) {
    this.activeHistoryTab.set(tab);
  }

  openMission(mission: Mission) {
    this.selectedMission.set(mission);
  }

  closeModal() {
    this.selectedMission.set(null);
  }

  goToMission() {
    const m = this.selectedMission();
    if (m) {
      this.closeModal();
      // Simulate mission claim (in real app, this would navigate or call API)
      this.claimMission(Number(m.id));
    }
  }

  openHistoryModal() {
    this.showHistoryModal.set(true);
  }

  closeHistoryModal() {
    this.showHistoryModal.set(false);
  }

  getTabIcon(tab: string): string {
    const icons: Record<string, string> = {
      Whatsapp: 'Whatsapp_37229.png',
      Facebook: 'facebook_icon-icons.com_53612.png',
      TikTok: 'tiktok_logo_icon_189233.png',
      Youtube: 'YouTube_23392.png',
      Daily: 'daily.png',
      Referral: 'referral.png'
    };
    return icons[tab] || '';
  }

  claimDailyReward(reward: DailyReward) {
    if (reward.state === 'upcoming') {
      this.emitEvent({ type: 'missionFailed', error: 'Reward not available yet' });
      this.showToast('¡Aún no! Esta recompensa estará disponible pronto.', 'error');
    } else if (reward.state === 'claimed') {
      this.emitEvent({ type: 'missionFailed', error: 'Reward already claimed' });
      this.showToast('¡Ya reclamaste este premio! Vuelve mañana.', 'error');
    } else if (reward.state === 'available') {
      this.emitEvent({ type: 'dailyRewardCollected', amount: 0 }); // amount not tracked
      this.dailyRewards.update(rewards => rewards.map(r =>
        r.day === reward.day ? { ...r, state: 'claimed', icon: 'motions/daily/reclamed.webp' } : r
      ));
      this.showToast(`¡Genial! Has reclamado tu recompensa del Día ${reward.day}.`, 'success');
    }
  }

  // Claim a mission (simulate success)
  claimMission(missionId: number) {
    const missions = this.missions();
    const mission = missions.find(m => m.id === String(missionId));
    if (!mission) {
      this.emitEvent({ type: 'missionFailed', missionId, error: 'Mission not found' });
      this.showToast('Misión no encontrada.', 'error');
      return;
    }
    if (mission.completed) {
      this.emitEvent({ type: 'missionFailed', missionId, error: 'Mission already completed' });
      this.showToast('Esta misión ya fue completada.', 'error');
      return;
    }
    // Mark mission as completed
    this.missions.update(list => list.map(m => 
      m.id === String(missionId) ? { ...m, completed: true } : m
    ));
    this.emitEvent({ type: 'missionClaimed', missionId, amount: Number(mission.reward) });
    this.showToast(`¡Misión completada! Recompensa: +${mission.reward} COP`, 'success');
  }

  // Fail a mission (simulate error)
  failMission(missionId: number, error: string) {
    this.emitEvent({ type: 'missionFailed', missionId, error });
    this.showToast(`Error en misión: ${error}`, 'error');
  }





  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastData.set({ message, type });
    setTimeout(() => this.toastData.set(null), 3000);
  }


}