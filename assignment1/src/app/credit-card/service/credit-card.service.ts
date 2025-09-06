import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  constructor(private httpClient: HttpClient) {}

  getCreditCards(): Promise<CreditCard[]> {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaG90ZG9nQGJhbmsuZGsiLCJHcm91cElkIjoiMmQwMzBiMGEtYTZhZC00YzcxLWJlYTctOGI2MjU0OTRhM2E5IiwiZXhwIjoxNzU3MTQzODQwLCJpc3MiOiJodHRwczovL3N3YWZlLmRrIiwiYXVkIjoiaHR0cHM6Ly9zd2FmZS5kayJ9.XysyVehWDkgUP0dC1R31b_AVt7OcOu_jkH2gxrqkMcY';
    return firstValueFrom(
      this.httpClient.get<CreditCard[]>(
        'https://assignment1.swafe.dk/api/CreditCard',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    );
  }
}

export interface CreditCard {
  cardHolderName: string;
  cardNumber: number;
  cscCode: number;
  expirationMonth: number;
  expirationYear: number;
  issuer: string;
}
