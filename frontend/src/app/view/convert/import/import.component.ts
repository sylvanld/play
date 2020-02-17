import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { SpotifyUserService } from 'src/app/service/spotify-user.service';
import { DeezerUserService } from 'src/app/service/deezer-user.service';
import { PlayService } from 'src/app/service/play.service';

import { Playlist, Track } from '~types/index';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  isEmpty = true;
  step = 2;

  deezerPlaylists: Playlist[] = [];
  spotifyPlaylists: Playlist[] = [];

  importForm: FormGroup;

  constructor(
    private router: Router,
    private play: PlayService,
    private builder: FormBuilder,
    private notify: NotificationService) {

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

    this.subscription.add(this.play.createPlaylists({ deezer: deezerControl, spotify: spotifyControl })
      .pipe(take(1))
      .subscribe(
        (playlists: Playlist[]) => {
          this.notify.info(
            `${playlists.length} playlists were created!`
          );
          this.router.navigateByUrl('/');
        },
        (err) => {
          this.notify.error(
            `An error occured during the importation... Please do it again.`
          );
          console.log(err);
        }
      ));
  }
}
