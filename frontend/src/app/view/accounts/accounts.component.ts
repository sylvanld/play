import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AccountsService } from 'src/app/service/accounts.service';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { ForgetAccountDialogComponent } from 'src/app/component/forget-account-dialog/forget-account-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts = [];

  constructor(
    private auth: AuthenticationService,
    private accountsService: AccountsService,
    private playlistService: PlaylistsService,
    private _dialog: MatDialog
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

  forgetAccountDialog() {
    const dialog = this._dialog.open(ForgetAccountDialogComponent);
    dialog.afterClosed().subscribe( () => {
      this.playlistService.flushData();
    });
  }
}
