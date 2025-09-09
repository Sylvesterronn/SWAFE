import {Component, inject, Inject, signal} from '@angular/core';
import {Transaction, TransactionListService} from './service/transaction-list.service';

@Component({
  selector: 'app-transactions',
  imports: [],
  templateUrl: './transactions.component.html',
  standalone: true,
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  transactionsListService = inject(TransactionListService);
  transactions= signal<Transaction[]>([]);

  constructor() {
    this.loadTransactions();
  }


  private async loadTransactions() {
    try{
      const data = await this.transactionsListService.getTransactionList();
      this.transactions.set(data);
    }
    catch (error) {
      console.error("Error loading transaction:", error);
    }
  }
}
