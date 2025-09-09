import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from 'express';
import {AuthService} from '../../login/service/login.service';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionListService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getTransactionList():Promise<Transaction[]>
  {
    const token = this.authService.getToken();
    return firstValueFrom(
      this.http.get<Transaction[]>('https://assignment1.swafe.dk/api/Transaction',
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
      )
    );
  }
}

export interface Transaction {
  cardNumber:number;
  amount:number;
  currency:string;
  comment:string;
  transactionDate:Date;
}
