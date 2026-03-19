import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiMessageResponse } from '../../models/user.model';

export interface ReferInfoResponse {
  earnLastMonth: number;
  earnLastWeek: number;
  earnToday: number;
  earnTotal: number;
  lastMonth: number;
  lastWeek: number;
  today: number;
  total: number;
}

export interface ActualInversion {
  createdAt: string;
  id: number;
  phone: string | null;
  referrealId: number | null;
}

export interface SettingsInfo {
  skillsLevelReport: Record<string, number>;
}

export interface WalletInfo {
  balance: number;
}

export interface UserStatusResponse {
  actualInversion: ActualInversion[] | null;
  createdAt: string;
  id: number;
  phone: string | null;
  referrealId: number | null;
  settings: SettingsInfo;
  skillsLevelReport: Record<string, number>;
  username: string;
  wallet: WalletInfo;
}

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private http = inject(HttpClient);

  private getBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  async getReferInfo(): Promise<{ success: boolean; error?: string; data?: ReferInfoResponse }> {
    try {
      const url = `${this.getBaseUrl()}UserInfo/getReferInfo`;
      const response = await this.http.get<ReferInfoResponse>(url).toPromise();

      if (response) {
        return { success: true, data: response };
      }

      return { success: false, error: 'Failed to get refer info' };
    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      if (httpError?.status === 401) {
        return { success: false, error: 'Unauthorized' };
      }
      if (httpError?.error && typeof httpError.error === 'object' && 'message' in httpError.error) {
        return { success: false, error: (httpError.error as ApiMessageResponse).message };
      }
      console.error('GetReferInfo failed:', error);
      return { success: false, error: 'Failed to get refer info' };
    }
  }

  async getUserStatus(): Promise<{ success: boolean; error?: string; data?: UserStatusResponse }> {
    try {
      const url = `${this.getBaseUrl()}UserInfo/getUserStatus`;
      const response = await this.http.get<UserStatusResponse>(url).toPromise();

      if (response) {
        return { success: true, data: response };
      }

      return { success: false, error: 'Failed to get user status' };
    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      if (httpError?.status === 401) {
        return { success: false, error: 'Unauthorized' };
      }
      if (httpError?.error && typeof httpError.error === 'object' && 'message' in httpError.error) {
        return { success: false, error: (httpError.error as ApiMessageResponse).message };
      }
      console.error('GetUserStatus failed:', error);
      return { success: false, error: 'Failed to get user status' };
    }
  }
}
