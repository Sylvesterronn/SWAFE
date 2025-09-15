import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CreditCardService, CreditCard } from './service/credit-card.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private creditCardService = inject(CreditCardService);
  private router = inject(Router);

  creditCards = signal<CreditCard[]>([]);

  constructor() {
    this.loadCreditCards();
  }

  private async loadCreditCards(): Promise<void> {
    try {
      const data = await this.creditCardService.getCreditCards();
      this.creditCards.set(data);
    } catch (error) {
      console.error('Error loading credit cards:', error);
    }
  }

  onRowClick(card: CreditCard) {
    this.router.navigate(['/credit-card', card.cardNumber]);
  }
}
