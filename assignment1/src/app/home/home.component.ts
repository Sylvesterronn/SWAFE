import { Component, inject, signal, ViewChild } from '@angular/core';
import { CreditCardService, CreditCard } from './service/credit-card.service';
import { SidebarComponent } from '../credit-card-details/credit-card-details';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild('sidebar') sidebar!: SidebarComponent;

  creditCardService = inject(CreditCardService);
  creditCards = signal<CreditCard[]>([]);
  selectedCard = signal<CreditCard | null>(null);
  isSidebarOpen = signal<boolean>(false);

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
    this.selectedCard.set(card);
    this.isSidebarOpen.set(true);
    this.sidebar.loadCardDetails(card.cardNumber);
  }

  onCloseSidebar() {
    this.isSidebarOpen.set(false);
    this.selectedCard.set(null);
    this.sidebar.clearCardDetails();
  }
}
