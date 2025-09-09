import {Component, inject, Inject, signal} from '@angular/core';
import {Transaction, TransactionListService} from './service/transaction-list.service';
import {error} from '@angular/compiler-cli/src/transformers/util';

@Component({
  selector: 'app-transactions',
  imports: [],
  templateUrl: './transactions.component.html',
  standalone: true,
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  transactionsListService = inject(TransactionListService);
  transaction= signal<Transaction[]>([]);

  constructor() {
    this.loadTransaction();
  }


  private async loadTransaction() {
    try{
      const data = await this.transactionsListService.getTransactionList();
      this.transaction.set(data);
    }
    catch (error) {
      console.error("Error loading transaction:", error);
    }
  }
}
