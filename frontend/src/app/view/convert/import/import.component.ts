import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { SpotifyUserService } from 'src/app/service/spotify-user.service';
import { DeezerUserService } from 'src/app/service/deezer-user.service';
import { PlayService } from 'src/app/service/play.service';

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
    private play: PlayService,
    private spotify: SpotifyUserService,
    private deezer: DeezerUserService) {

    this.importForm = this.builder.group({
      spotifyControl: new FormControl([], []),
      deezerControl: new FormControl([], []),
    });
  }

  ngOnInit() {

    this.subscription.add(
      this.play.getExternalPlaylists()
        .pipe(take(1))
        .subscribe(({ deezer, spotify }) => {
          this.deezerPlaylists = deezer;
          this.spotifyPlaylists = spotify;
        })
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
    console.log(deezerControl, spotifyControl);

    for (const deezer of deezerControl) {
      this.play.createPlalist(deezer, 'DEEZER')
        .pipe(take(1))
        .subscribe(
          (playlist: Playlist) => console.log('deezer completed!', playlist)
        );
    }

    for (const spotify of spotifyControl) {
      this.play.createPlalist(spotify, 'SPOTIFY')
        .pipe(take(1))
        .subscribe(
          // TODO: update playlist localStorage.
          (playlist: Playlist) => console.log('spotify completed!', playlist)
        );
    }
  }
}
