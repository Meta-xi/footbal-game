import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSignal = signal<any>(null);
  private http = inject(HttpClient);
  private router = inject(Router);

  user = this.userSignal.asReadonly();
  isAuthenticated = computed(() => this.userSignal() !== null);
  authToken = signal<string | null>(null);

  constructor() {
    this.loadAuthFromStorage();
  }

  private getBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  private loadAuthFromStorage(): void {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('auth_token');

    if (storedUser && storedToken) {
      try {
        this.userSignal.set(JSON.parse(storedUser));
        this.authToken.set(storedToken);
      } catch (error) {
        console.error('Error loading auth from storage:', error);
        this.clearAuthStorage();
      }
    }
  }

  private saveAuthStorage(user: any, token: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('auth_token', token);
    this.userSignal.set(user);
    this.authToken.set(token);
  }

  private clearAuthStorage(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    this.userSignal.set(null);
    this.authToken.set(null);
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const url = `${this.getBaseUrl()}auth/login`;
      const response: any = await this.http.post(url, { email, password }).toPromise();

      if (response?.success && response.data) {
        this.saveAuthStorage(response.data.user, response.data.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async register(username: string, password: string, phone?: string | null, refId?: number | string | null): Promise<boolean> {
    try {
      const url = `${this.getBaseUrl()}Auth/register`;
      const body: any = { username, password };
      if (phone !== undefined) body.phone = phone;
      if (refId !== undefined) body.refId = refId;

      const response: any = await this.http.post(url, body).toPromise();

      if (response?.success && response.data) {
        this.saveAuthStorage(response.data.user, response.data.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  logout(): void {
    this.clearAuthStorage();
    this.router.navigate(['/login']);
  }

  getUsername(): string {
    return this.userSignal()?.username || 'Usuario';
  }

  getToken(): string | null {
    return this.authToken();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
