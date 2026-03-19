import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiMessageResponse } from '../../models/user.model';
import { Player } from '../../models/invest.model';

@Injectable({
  providedIn: 'root',
})
export class InvestService {
  private http = inject(HttpClient);

  private getBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  async addInvestment(articleId: number, uid: number): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const url = `${this.getBaseUrl()}Invest/addInvestment`;
      const response = await this.http.post<ApiMessageResponse>(url, { articleId, uid }).toPromise();

      if (response) {
        return { success: true, message: response.message };
      }

      return { success: false, error: 'Failed to add investment' };
    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      if (httpError?.status === 400) {
        return { success: false, error: 'Bad request' };
      }
      if (httpError?.status === 401) {
        return { success: false, error: 'Unauthorized' };
      }
      if (httpError?.status === 404) {
        return { success: false, error: 'Not found' };
      }
      if (httpError?.error && typeof httpError.error === 'object' && 'message' in httpError.error) {
        return { success: false, error: (httpError.error as ApiMessageResponse).message };
      }
      console.error('AddInvestment failed:', error);
      return { success: false, error: 'Failed to add investment' };
    }
  }

  async getPlayers(): Promise<{ success: boolean; error?: string; players?: any }> {
    try {
      const url = `${this.getBaseUrl()}Invest/getPlayers`;
      const response = await this.http.get<any>(url).toPromise();

      return { success: true, players: response };
    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      if (httpError?.status === 401) {
        return { success: false, error: 'Unauthorized' };
      }
      console.error('GetPlayers failed:', error);
      return { success: false, error: 'Failed to get players' };
    }
  }
}
