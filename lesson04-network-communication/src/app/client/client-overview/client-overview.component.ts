import {Component, inject, signal} from '@angular/core';
import {Client, ClientService} from '../../client.service';
import {clients} from '../../../../lesson-04-backend/src/clients';

@Component({
  selector: 'app-client-overview',
  imports: [],
  templateUrl: './client-overview.component.html',
  styleUrl: './client-overview.component.scss'
})
export class ClientOverviewComponent {
  clientService = inject(ClientService);
  clients = signal<Client[]>([]);
  constructor() {
    this.fetchClients();
    }

  private async fetchClients()
  {
    try {
      const data = await this.clientService.getClients();
      this.clients.set(data);
    } catch (error) {
      console.error('Error fetching clients', error);
    }
  }

}
