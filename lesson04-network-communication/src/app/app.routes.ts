import { Routes } from '@angular/router';
import {ClientOverviewComponent} from './client/client-overview/client-overview.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'client',
    loadChildren: () =>
      import('./client/client.module').then(m => m.ClientModule),
  },
];
