import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { ForgetAccountDialogComponent } from 'src/app/component/forget-account-dialog/forget-account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PlayService } from 'src/app/service/play.service';

import { Account, User } from '~types/index';
import { Subscription, Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnDestroy {
  private subsciption: Subscription = new Subscription();

  private pending: User[] = [];
  private accepted: User[] = [];

  accounts: Account[] = [];
  currentUser: User;

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
          console.log(accounts);
          this.accounts = accounts;
        })
    );

    this.getFrienshipRequests();
  }

  ngOnDestroy() {
    this.subsciption.unsubscribe();
  }

  isSpotifyAccountBound(): boolean {
    return false;
  }

  isDeezerAccountBound() {
    return false;
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


  /// TODO: move to share component
  getFrienshipRequests() {
    this.subsciption.add(this.play.myRequestFriendships().pipe(
      take(1),
      map(
        ({ accepted, pending }) => {
          return pending.map(({ friend1, friend2 }) => this.play.whois(friend2));
        }
      )
    ).subscribe((users: User[]) => {
      this.pending = users;
    }));
  }

  invitFriend($event) {
    this.play.inviteFriend(this.currentUser.id, $event[0].id)
      .subscribe((frienship) => {
        console.log(frienship);
      });
  }
}
