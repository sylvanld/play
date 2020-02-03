import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AccountsService } from 'src/app/service/accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts = [];

  constructor(
    private auth: AuthenticationService,
    private accountsService: AccountsService
  ) { }

  ngOnInit() {
    this.accountsService.myAccounts().subscribe((accounts: any[]) => {
      console.log('accounts', accounts);
      this.accounts = accounts;
    });
  }

  logout() {
    this.auth.logout();
  }

}
