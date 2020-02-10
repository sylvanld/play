import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AccountsService } from 'src/app/service/accounts.service';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { ForgetAccountDialogComponent } from 'src/app/component/forget-account-dialog/forget-account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PlayService } from 'src/app/service/play.service';

@Component({
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts = [];

  constructor(
    private auth: AuthenticationService,
    private play: PlayService,
    private playlistService: PlaylistsService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.play.myAccounts().subscribe((accounts: any[]) => {
      console.log('accounts', accounts);
      this.accounts = accounts;
    });
  }

  isSpotifyAccountBound(): boolean {
    return this.accounts.filter(account => account.provider === 'SPOTIFY').length > 0;
  }

  isDeezerAccountBound() {
    return this.accounts.filter(account => account.provider === 'DEEZER').length > 0;
  }

  logout() {
    this.auth.logout();
  }

  forgetAccountDialog() {
    const dialog = this._dialog.open(ForgetAccountDialogComponent);
    dialog.afterClosed().subscribe(() => {
      this.playlistService.flushData();
    });
  }
}
