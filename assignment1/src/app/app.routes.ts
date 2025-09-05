import { Routes } from '@angular/router';
import path from 'path';
import { HomeComponent } from './home/home.component';
import { CreditCardComponent } from './credit-card/credit-card.component';
import { TransactionsComponent } from './transactions/transactions.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'credit-card', component: CreditCardComponent },
  { path: 'transactions', component: TransactionsComponent },
];
