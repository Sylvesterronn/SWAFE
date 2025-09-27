import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './login/login.component';
import { CreateCreditCard } from './create-credit-card/create-credit-card';
import { CreditCardDetailsComponent } from './credit-card-details/credit-card-details';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./transactions/transactions.component').then(
        (c) => c.TransactionsComponent
      ),
  },
  {
    path: 'create-credit-card',
    loadComponent: () =>
      import('./create-credit-card/create-credit-card').then(
        (c) => c.CreateCreditCard
      ),
  },
  {
    path: 'credit-card/:cardNumber',
    loadComponent: () =>
      import('./credit-card-details/credit-card-details').then(
        (c) => c.CreditCardDetailsComponent
      ),
  },
];
