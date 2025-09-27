import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  isLoggedIn = signal<boolean>(this.getToken() !== null);

  constructor(private httpClient: HttpClient) {}

  async login(email: string, password: string): Promise<string> {
    try {
      const token = await firstValueFrom(
        this.httpClient.post(
          'https://assignment1.swafe.dk/api/Login',
          {
            username: email,
            password,
          },
          { responseType: 'text' }
        )
      );

      sessionStorage.setItem(this.TOKEN_KEY, token);
      this.isLoggedIn.set(true); // Update signal when login succeeds
      return token;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false); // Update signal when logout
  }
}
