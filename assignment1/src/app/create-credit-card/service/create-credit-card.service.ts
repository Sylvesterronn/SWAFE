import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../login/service/login.service';

@Injectable({
  providedIn: 'root',
})
export class CreateCreditCardService {
  httpClient = inject(HttpClient);
  authService = inject(AuthService);

  createCreditCard(creditCardData: CreateCardData) {
    const token = this.authService.getToken();
    return this.httpClient.post(
      `https://assignment1.swafe.dk/api/CreditCard`,
      creditCardData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export interface CreateCardData {
  cardNumber: number;
  cscCode: number;
  cardHolderName: string;
  expirationMonth: number;
  expirationYear: number;
  issuer: string;
}
