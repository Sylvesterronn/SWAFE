import { Component, inject, Inject, signal } from '@angular/core';
import {
  Transaction,
  TransactionListService,
} from './service/transaction-list.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CustomDatePipe } from '../pipes/custom-date.pipe';

@Component({
  selector: 'app-transactions',
  imports: [ReactiveFormsModule, FormsModule, CustomDatePipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  private fb = inject(FormBuilder);
  transactionsListService = inject(TransactionListService);
  transactions = signal<Transaction[]>([]);
  allTransactions = signal<Transaction[]>([]);
  cardNumberFilter: number | undefined;

  transactionForm: FormGroup = this.fb.group({
    cardNumber: [
      null,
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]{7,16}$'),
      ],
    ],
    amount: [
      null,
      [Validators.required, Validators.min(0.01), Validators.max(999999.99)],
    ],
    currencyCode: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3),
        Validators.pattern('^[A-Z]{3}$'),
      ],
    ],
    comment: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(500)],
    ],
  });

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  get cardNumber() {
    return this.transactionForm.get('cardNumber');
  }
  get amount() {
    return this.transactionForm.get('amount');
  }
  get currencyCode() {
    return this.transactionForm.get('currencyCode');
  }
  get comment() {
    return this.transactionForm.get('comment');
  }

  constructor() {
    this.loadTransactions();
  }

  filterTransactions(cardNumber: number | undefined) {
    if (cardNumber) {
      this.transactions.set(
        this.allTransactions().filter((tx) => tx.cardNumber == cardNumber)
      );
    } else {
      this.transactions.set(this.allTransactions());
    }
  }

  clearFilter() {
    this.cardNumberFilter = undefined;
    this.transactions.set(this.allTransactions());
  }

  private async loadTransactions() {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.transactionsListService.getTransactionList();
      this.transactions.set(data);
      this.allTransactions.set(data);
    } catch (error) {
      console.error('Error loading transaction:', error);
      this.error.set('Failed to load transactions');
    } finally {
      this.isLoading.set(false);
    }
  }

  async addTransaction() {
    if (this.transactionForm.invalid) {
      this.error.set('Please fill in all required fields correctly');
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const formValue = this.transactionForm.value;
      const transaction: Transaction = {
        cardNumber: formValue.cardNumber,
        amount: formValue.amount,
        currencyCode: formValue.currencyCode,
        comment: formValue.comment,
        transactionDate: new Date(),
      };

      const addedTransaction =
        await this.transactionsListService.addTransaction(transaction);

      this.allTransactions.update((transactions) => [
        ...transactions,
        addedTransaction,
      ]);
      this.transactions.update((transactions) => [
        ...transactions,
        addedTransaction,
      ]);

      this.resetForm();
    } catch (error) {
      console.error('Error adding transaction:', error);
      this.error.set('Failed to add transaction');
    } finally {
      this.isLoading.set(false);
    }
  }

  async removeTransaction(uid: number) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.transactionsListService.deleteTransaction(uid);

      this.allTransactions.update((transactions) =>
        transactions.filter((tx) => tx.uid !== uid)
      );
      this.transactions.update((transactions) =>
        transactions.filter((tx) => tx.uid !== uid)
      );
    } catch (error) {
      console.error('Error removing transaction:', error);
      this.error.set('Failed to remove transaction');
    } finally {
      this.isLoading.set(false);
    }
  }

  private isValidTransaction(): boolean {
    return this.transactionForm.valid;
  }

  private resetForm() {
    this.transactionForm.reset();
  }
}
