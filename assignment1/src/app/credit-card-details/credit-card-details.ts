import { CommonModule } from '@angular/common';
import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CreditCard,
  CreditCardService,
} from '../home/service/credit-card.service';
import {
  CreditCardDetails,
  CreditCardDetailsService,
} from './service/credit-card-details.service';
import { CustomDatePipe } from '../pipes/custom-date.pipe';

@Component({
  selector: 'app-credit-card-details',
  imports: [CommonModule, CustomDatePipe],
  templateUrl: './credit-card-details.html',
  styleUrl: './credit-card-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardDetailsComponent implements OnInit {
  private creditCardDetailsService = inject(CreditCardDetailsService);
  private creditCardService = inject(CreditCardService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  card = signal<CreditCard | null>(null);
  cardDetails = signal<CreditCardDetails | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const cardNumber = this.route.snapshot.paramMap.get('cardNumber');
    if (cardNumber) {
      this.loadCardAndDetails(Number(cardNumber));
    } else {
      this.router.navigate(['/home']);
    }
  }

  private async loadCardAndDetails(cardNumber: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const cards = await this.creditCardService.getCreditCards();
      const foundCard = cards.find((c) => c.cardNumber === cardNumber);

      if (!foundCard) {
        this.error.set('Credit card not found');
        return;
      }

      this.card.set(foundCard);

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
      this.navigateBack();
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

  navigateBack(): void {
    this.router.navigate(['/home']);
  }

  onBackdropClick() {
    this.navigateBack();
  }

  onSidebarClick(event: Event) {
    event.stopPropagation();
  }
}
