import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ActivateMisionRequest, ActivateMisionResponse, ApiMessageResponse } from '../../models/mision.model';

@Injectable({
  providedIn: 'root',
})
export class MisionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  async activateMision(
    request: ActivateMisionRequest
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const url = `${this.getBaseUrl()}Misions/ActivateMision`;
      const token = this.authService.getToken();

      if (!token) {
        return { success: false, error: 'Authorization token not found.' };
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      // The API expects misionId and timestamp in the body directly.
      // The headers section in the prompt was for the 'token' which is handled via Authorization header.
      const body = {
        misionId: request.misionId,
        timestamp: request.timestamp,
      };

      const response = await lastValueFrom(
        this.http.post<ActivateMisionResponse | string>(url, body, { headers, responseType: 'text' as 'json' })
      );

      // The backend returns text/plain, so a successful response might just be a string "OK" or empty.
      // We'll consider any non-error response a success for now.
      if (response === 'OK' || response === '') {
         return { success: true };
      } else {
         // If there's a response body that's not just "OK" or empty, it might be an unexpected message.
         // For now, treat as success if no HTTP error.
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
