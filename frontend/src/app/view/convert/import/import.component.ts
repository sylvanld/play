import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { SpotifyUserService } from 'src/app/service/spotify-user.service';
import { DeezerUserService } from 'src/app/service/deezer-user.service';

import { Playlist, Track } from '~types/index';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private isEmpty = true;

  private deezerPlaylists: Playlist[] = [];
  private spotifyPlaylists: Playlist[] = [];

  private importForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private spotify: SpotifyUserService,
    private deezer: DeezerUserService) {

    this.importForm = this.builder.group({
      spotifyControl: new FormControl([], []),
      deezerControl: new FormControl([], []),
    });
  }

  ngOnInit() {

    this.subscription.add(
      // retreive playlists
      this.spotify.getPlaylists()
        .pipe(take(1))
        .subscribe((playlists: Playlist[]) => this.spotifyPlaylists = playlists)
    );

    this.subscription.add(
      this.deezer.getPlaylists()
        .pipe(take(1))
        .subscribe((playlists: Playlist[]) => this.deezerPlaylists = playlists)
    );

    this.subscription.add(this.importForm.valueChanges.subscribe(({ deezerControl, spotifyControl }) => {
      if (deezerControl.length === 0 && spotifyControl.length === 0) {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit({ deezerControl, spotifyControl }) {
    // TODO: notify
  }
}
