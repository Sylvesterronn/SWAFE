import { Routes } from '@angular/router';
import path from 'path';
import { HomeComponent } from './home/home.component';
import { CreditCardComponent } from './credit-card/credit-card.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'credit-card', component: CreditCardComponent },
  { path: 'transactions', component: TransactionsComponent },
];
