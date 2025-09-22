import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, firstValueFrom, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  httpClient = inject(HttpClient);

getClients(): Promise<Client[]> {
    return firstValueFrom(
      this.httpClient.get<Client[]>('http://localhost:3000/exercise/client/faulty').pipe(
        catchError(error => {
          console.error('❌ Error fetching clients:', error);
          return throwError(() => new Error('Failed to fetch clients'));
        })
      )
    );
  }
}

export interface Client {
  id: number;
  picture: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  wallet: number;
}


