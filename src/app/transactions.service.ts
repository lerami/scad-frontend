import { Injectable } from '@angular/core';
//Import Http Symbols
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Transaction } from './transaction';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private transactionsUrl = 'http://localhost:3000/transactions';
  constructor(private http: HttpClient) { }

/** POST: add a new hero to the server */
addTransaction (transaction: Transaction): Observable<Transaction> {
  return this.http.post<Transaction>(this.transactionsUrl, transaction, httpOptions).pipe(
    tap((transaction: Transaction) => console.log(`added transaction w/ id=${transaction.id}`)),
    catchError(this.handleError<Transaction>('addTransaction'))
  );
}


/** DELETE: delete the hero from the server */
deleteTransaction (transaction: Transaction): Observable<Transaction>  {
   return  this.http.request<Transaction>('delete', this.transactionsUrl, { body: { transaction } }).pipe(
    tap(_ => console.log(`deleted transaction w/ id=${transaction.id}`)),
    catchError(this.handleError<Transaction>('deleteHero'))
  );
}




/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
   console.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
