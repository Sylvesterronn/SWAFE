import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

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
      return token;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }
}
