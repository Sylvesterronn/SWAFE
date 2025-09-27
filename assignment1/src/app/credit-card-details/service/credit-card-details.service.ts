import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../login/service/login.service';

@Injectable({
  providedIn: 'root',
})
export class CreditCardDetailsService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getCreditCardDetails(cardNumber: number): Promise<CreditCardDetails> {
    const token = this.authService.getToken();
    return firstValueFrom(
      this.httpClient.get<CreditCardDetails>(
        `https://assignment1.swafe.dk/api/CreditCard/cardnumber?cardnumber=${cardNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    );
  }
}

export interface CreditCardDetails {
  transactions: {
    uid: string;
    cardNumber: number;
    amount: number;
    currencyCode: string;
    transactionDate: string;
    comment: string;
  }[];
  cardNumber: number;
  cscCode: number;
  cardHolderName: string;
  expirationYear: number;
  expirationMonth: number;
  issuer: string;
}
