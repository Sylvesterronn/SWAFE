import {Component, inject, Inject, signal} from '@angular/core';
import {Transaction, TransactionListService} from './service/transaction-list.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-transactions',
  imports: [
    FormsModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  transactionsListService = inject(TransactionListService);
  transactions= signal<Transaction[]>([]);
  cardNumberFilter: number | undefined;

  constructor() {
    this.loadTransactions();
  }

  filterTransactions(cardNumber: number | undefined){
    this.transactions.update(value => {
      return value.filter(tx => tx.cardNumber == cardNumber);
    })  }

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
