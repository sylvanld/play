import { Component, OnInit, OnDestroy } from '@angular/core';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { SpotifyService } from 'src/app/service/spotify.service';
import { Playlist, Track } from '~types/index';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private playlists: Playlist[] = [];

  constructor(private spotify: SpotifyService) { }

  ngOnInit() {

    this.subscription.add(
      // retreive playlists
      this.spotify.getPlaylists()
        .pipe(take(1))
        .subscribe((playlists: Playlist[]) => this.playlists = playlists)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
