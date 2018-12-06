import { Component, OnInit } from '@angular/core';
import { Transaction } from '../transaction';
import { TRANSACTIONS } from '../mock-transactions';


import{TransactionsService} from '../transactions.service'

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  public transactions  = TRANSACTIONS;;

  constructor(private transactionsService: TransactionsService) { }
l
  ngOnInit() {
  }


  add(user: String): void {
    user = user.trim();
    if (!user) { return; }
    this.transactionsService.addTransaction({ user } as Transaction)
      .subscribe(transaction => {
        console.log("coucou gatchu gatchu");
        this.transactions.push(transaction);
      });
  }
  delete(user: String): void {
    user = user.trim();
    if (!user) { return; }
    this.transactionsService.deleteTransaction({ user } as Transaction)
      .subscribe(transaction => {
        this.transactions.push(transaction);
      });
  }
}
