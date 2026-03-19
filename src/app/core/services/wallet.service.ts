import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiMessageResponse } from '../../models/user.model';

export enum TransactionCoin {
  COINS = 1,
  USD = 2,
}

export enum TransactionReason {
  TAKING = 1,
  DEPOSIT = 2,
  WITHDRAW = 3,
  INVEST = 4,
  CASINO = 5,
  REFERRAL = 6,
  ENERGY_BOOST = 7,
  UPGRADE = 8,
  REFUND = 9,
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private http = inject(HttpClient);

  private getBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  async addTransaction(params: {
    amount: number;
    coin: TransactionCoin;
    description: string;
    reason: TransactionReason;
    refEarnContribute: boolean;
    energyAmount?: number | null;
    tookAmount?: number | null;
  }): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const url = `${this.getBaseUrl()}Wallet/addTransaction`;
      const body: Record<string, unknown> = {
        amount: params.amount,
        coin: params.coin,
        description: params.description,
        reason: params.reason,
        refEarnContribute: params.refEarnContribute,
      };

      if (params.energyAmount != null) {
        body['energyAmount'] = params.energyAmount;
      }
      if (params.tookAmount != null) {
        body['tookAmount'] = params.tookAmount;
      }

      const response = await this.http.post<ApiMessageResponse>(url, body).toPromise();

      if (response) {
        return { success: true, message: response.message };
      }

      return { success: false, error: 'Failed to add transaction' };
    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      if (httpError?.status === 400) {
        return { success: false, error: 'Bad request' };
      }
      if (httpError?.status === 401) {
        return { success: false, error: 'Unauthorized' };
      }
      if (httpError?.error && typeof httpError.error === 'object' && 'message' in httpError.error) {
        return { success: false, error: (httpError.error as ApiMessageResponse).message };
      }
      console.error('AddTransaction failed:', error);
      return { success: false, error: 'Failed to add transaction' };
    }
  }
}
