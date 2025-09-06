import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCard, CreditCardService } from './service/credit-card.service';

@Component({
    selector: 'app-credit-card',
    imports: [CommonModule],
    templateUrl: './credit-card.component.html',
    styleUrl: './credit-card.component.css'
})
export class CreditCardComponent {
  creditCardService = inject(CreditCardService);
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
}
