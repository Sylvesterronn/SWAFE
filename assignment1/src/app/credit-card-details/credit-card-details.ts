import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  output,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  CreditCard,
  CreditCardService,
} from '../home/service/credit-card.service';
import {
  CreditCardDetails,
  CreditCardDetailsService,
} from './service/credit-card-details.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './credit-card-details.html',
  styleUrl: './credit-card-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private creditCardDetailsService = inject(CreditCardDetailsService);
  private creditCardService = inject(CreditCardService);

  isOpen = input<boolean>(false);
  card = input<CreditCard | null>(null);
  closeSidebar = output<void>();

  cardDetails = signal<CreditCardDetails | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  async loadCardDetails(cardNumber: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const details = await this.creditCardDetailsService.getCreditCardDetails(
        cardNumber
      );
      this.cardDetails.set(details);
    } catch (error) {
      console.error('Error loading credit card details:', error);
      this.error.set('Failed to load card details');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteCard(cardNumber: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.creditCardService.removeCreditCard(cardNumber);
      this.onClose();
    } catch (error) {
      console.error('Error deleting credit card:', error);
      this.error.set('Failed to delete card. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  clearCardDetails(): void {
    this.cardDetails.set(null);
    this.error.set(null);
  }

  onClose() {
    this.closeSidebar.emit();
  }

  onBackdropClick() {
    this.onClose();
  }

  onSidebarClick(event: Event) {
    event.stopPropagation();
  }
}
