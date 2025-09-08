import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../login/service/login.service';
import { CreditCardDetails } from '../../home/service/credit-card.service';

@Injectable({
  providedIn: 'root',
})
export class CreditCardDetailsService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {}

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
