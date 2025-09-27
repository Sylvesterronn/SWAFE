import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
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
      Validators.pattern(/^\d+$/),
    ]),
    cardHolderName: new FormControl('', [Validators.required]),
    cscCode: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
      Validators.pattern(/^\d+$/),
    ]),
    expirationMonth: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{1,2}$/),
      this.monthRangeValidator,
    ]),
    expirationYear: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}$/),
      Validators.min(2025),
    ]),
    issuer: new FormControl('', [Validators.required]),
  });

  async createCreditCard() {
    if (!this.createForm.valid) {
      console.log('Form is invalid, not submitting');
      this.markAllFieldsAsTouched();
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
        issuer: formValue.issuer!,
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
    this.router.navigate(['/home']);
  }

  createAnother() {
    this.isSuccess.set(false);
    this.createForm.reset();
  }

  markAllFieldsAsTouched() {
    Object.keys(this.createForm.controls).forEach((key) => {
      this.createForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.createForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors?.['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(
          fieldName
        )} must be at least ${requiredLength} characters`;
      }
      if (field.errors?.['maxlength']) {
        const requiredLength = field.errors['maxlength'].requiredLength;
        return `${this.getFieldDisplayName(
          fieldName
        )} cannot exceed ${requiredLength} characters`;
      }
      if (field.errors?.['pattern']) {
        if (fieldName === 'cardNumber') {
          return 'Card number must contain only numbers';
        }
        if (fieldName === 'cscCode') {
          return 'CSC code must contain only numbers';
        }
        if (fieldName === 'expirationMonth') {
          return 'Expiration month must be 1-2 digits';
        }
        if (fieldName === 'expirationYear') {
          return 'Expiration year must be 4 digits';
        }
      }
      if (field.errors?.['monthRange']) {
        return 'Expiration month must be between 1 and 12';
      }
      if (field.errors?.['min'] && fieldName === 'expirationYear') {
        return 'Expiration year must be at least 2025';
      }
    }
    return null;
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      cardNumber: 'Card number',
      cardHolderName: 'Card holder name',
      cscCode: 'CSC code',
      expirationMonth: 'Expiration month',
      expirationYear: 'Expiration year',
      issuer: 'Issuer',
    };
    return displayNames[fieldName] || fieldName;
  }

  private monthRangeValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const month = parseInt(value, 10);
    if (month < 1 || month > 12) {
      return { monthRange: true };
    }
    return null;
  }
}
