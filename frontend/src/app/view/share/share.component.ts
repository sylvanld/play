import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';


import { AccountsService } from 'src/app/service/accounts.service';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { Playlist } from '~types/playlist';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  private friends;
  private playlists: Playlist[];

  shareForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private accounts: AccountsService,
    private playlist: PlaylistsService) {

    this.shareForm = this.builder.group({
      firendsControl: new FormControl([], [Validators.required]),
      playlistsControl: new FormControl([], [Validators.required]),
    });
  }

  ngOnInit() {
    this.accounts.myFriends().toPromise().then((users) => {
      this.friends = users;
    }).catch((err => this.friends = []));

    this.playlist.playlists.subscribe((playlists: Playlist[]) => {
      this.playlists = playlists;
    });
  }

  onSubmit({ firendsControl, playlistsControl }) {
    // TODO: notify
  }

}
