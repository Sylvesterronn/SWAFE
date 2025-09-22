import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientOverviewComponent } from './client-overview/client-overview.component';

const routes: Routes = [
  { path: '', component: ClientOverviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
