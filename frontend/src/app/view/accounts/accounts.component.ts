import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { ForgetAccountDialogComponent } from 'src/app/component/forget-account-dialog/forget-account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PlayService } from 'src/app/service/play.service';

import { Account, User } from '~types/index';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnDestroy {
  private subsciption: Subscription = new Subscription();

  accounts: Account[] = [];
  currentUser: User = undefined;

  constructor(
    private auth: AuthenticationService,
    private play: PlayService,
    private playlistService: PlaylistsService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.subsciption.add(
      this.play.whoami()
        .pipe(take(1))
        .subscribe((currentUser: User) => {
          this.currentUser = currentUser;
        })
    );

    this.subsciption.add(
      this.play.myAccounts()
        .pipe(take(1))
        .subscribe((accounts: any[]) => {
          this.accounts = accounts;
        })
    );
  }

  ngOnDestroy() {
    this.subsciption.unsubscribe();
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
    this.subsciption.add(dialog.afterClosed().subscribe(() => {
      this.playlistService.flushData();
    }));
  }
}
