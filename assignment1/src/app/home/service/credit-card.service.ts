import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../login/service/login.service';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getCreditCards(): Promise<CreditCard[]> {
    const token = this.authService.getToken();
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

  removeCreditCard(cardNumber: number): Promise<any> {
    const token = this.authService.getToken();
    return firstValueFrom(
      this.httpClient.delete(
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

export interface CreditCard {
  cardHolderName: string;
  cardNumber: number;
  cscCode: number;
  expirationMonth: number;
  expirationYear: number;
  issuer: string;
}
