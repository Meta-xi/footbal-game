import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActivateMisionRequest, ApiMessageResponse } from '../../models/mision.model';

@Injectable({
  providedIn: 'root',
})
export class MisionService {
  private http = inject(HttpClient);

  private getBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  async activateMision(
    request: ActivateMisionRequest
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const url = `${this.getBaseUrl()}Misions/ActivateMision`;

      const body = {
        misionId: request.misionId,
        timestamp: request.timestamp,
      };

      const response = await lastValueFrom(
        this.http.post(url, body, { responseType: 'text' })
      );

      if (response === 'OK' || response === '') {
         return { success: true };
      } else {
         return { success: true };
      }

    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      if (httpError?.error && typeof httpError.error === 'object' && 'message' in httpError.error) {
        return { success: false, error: (httpError.error as ApiMessageResponse).message };
      }
      if (httpError?.error && typeof httpError.error === 'string') {
        return { success: false, error: httpError.error };
      }
      console.error('Activate Mision failed:', error);
      return { success: false, error: 'Failed to activate mision' };
    }
  }
}
