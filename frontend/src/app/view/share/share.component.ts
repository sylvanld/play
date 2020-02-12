import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';


import { PlaylistsService } from 'src/app/service/playlists.service';
import { PlayService } from 'src/app/service/play.service';
import { Playlist } from '~types/playlist';

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
    private play: PlayService,
    private playlist: PlaylistsService) {

    this.shareForm = this.builder.group({
      firendsControl: new FormControl([], [Validators.required]),
      playlistsControl: new FormControl([], [Validators.required]),
    });
  }

  ngOnInit() {
    this.play.myFriends().toPromise().then((users) => {
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
