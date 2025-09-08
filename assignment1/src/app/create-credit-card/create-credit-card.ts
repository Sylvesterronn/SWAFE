import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateCreditCardService } from './service/create-credit-card.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-credit-card',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-credit-card.html',
  styleUrl: './create-credit-card.css',
})
export class CreateCreditCard {
  createCreditCardService = inject(CreateCreditCardService);
  router = inject(Router);

  isLoading = signal(false);
  isSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  createForm = new FormGroup({
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(16),
    ]),
    cardHolderName: new FormControl('', [Validators.required]),
    cscCode: new FormControl('', [
      Validators.required,
      Validators.maxLength(3),
    ]),
    expirationMonth: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(12),
    ]),
    expirationYear: new FormControl('', [Validators.required]),
    issuer: new FormControl(''),
  });

  async createCreditCard() {
    if (!this.createForm.valid) {
      console.log('Form is invalid, not submitting');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const formValue = this.createForm.value;
      const creditCardData = {
        cardNumber: Number(formValue.cardNumber),
        cscCode: Number(formValue.cscCode),
        cardHolderName: formValue.cardHolderName!,
        expirationMonth: Number(formValue.expirationMonth),
        expirationYear: Number(formValue.expirationYear),
        issuer: formValue.issuer || undefined,
      };

      await firstValueFrom(
        this.createCreditCardService.createCreditCard(creditCardData)
      );

      console.log('Credit card created successfully');
      this.isSuccess.set(true);
      this.isLoading.set(false);
    } catch (error) {
      console.error('Error creating credit card:', error);
      this.errorMessage.set('Failed to create credit card. Please try again.');
      this.isLoading.set(false);
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  createAnother() {
    this.isSuccess.set(false);
    this.createForm.reset();
  }
}
