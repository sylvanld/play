import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, forkJoin, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { ProviderService } from './provider.service';
import { StorageService } from './storage.service';

import { environment } from 'src/environments/environment';
import { Track, Account, User } from '~types/index';

import { YoutubeService } from './youtube.service';
import { DeezerService } from './deezer.service';
import { SpotifyService } from './spotify.service';

@Injectable({
  providedIn: 'root'
})
export class PlayService extends ProviderService {
  constructor(
    protected http: HttpClient,
    private auth: AuthenticationService,
    private store: StorageService,
    private youtube: YoutubeService,
    private deezer: DeezerService,
    private spotify: SpotifyService,
  ) {
    super(http, environment.play_api_url, { type: 'bearer' });
  }

  /**
   * Method to implement when a service inherit of Provider.
   * It is called when a query receive a 401 error status.
   */
  renewToken(): Observable<string> {
    const refreshToken = this.store.get('REFRESH_TOKEN');
    return new Observable((observer: Observer<string>) => {
      this.auth.refreshToken().subscribe(
        success => {
          observer.next(this.auth.getToken());
          observer.complete();
        }
      );
    });
  }

  /**
   * Complete youtube Id
   */


  /**
   * Register association between an isrc and an external Id
   */
  addExternalsIds(track: Track, externalIds: { spotify?, deezer?, youtube?}) {
    /*
    // TODO: this.put(`/tracks/isrc/${track.isrc}`, externalIds);
    this.completeExternalsIds({isrc, spotify...}, {youtube: true, deeezer: true}).subscribe(track=>{
      // play track track.externalIds.youtube
    })
    */
  }

  completeExternalsIds(track: Track, externalIds: { spotify?: boolean, deezer?: boolean, youtube?: boolean }): Observable<Track> {
    return of(track).pipe(
      flatMap(
        (t: Track) => {
          const requests = [];
          if (externalIds.spotify === true && !t.external_ids.spotify) {
            requests.push(this.spotify.completeExternalId(t));
          }
          if (externalIds.deezer === true && !t.external_ids.deezer) {
            requests.push(this.deezer.completeExternalId(t));
          }
          if (externalIds.youtube === true && !t.external_ids.youtube) {
            requests.push(this.youtube.completeExternalId(t));
          }
          return forkJoin(requests);
        }
      ),
      map((results: Track[]): Track => {
        for (const result of results) {
          track.external_ids = Object.assign(track.external_ids, result.external_ids);
        }
        return track;
      })
    );
  }

  /**
   * List accounts of the currently authenticated user.
   */
  myAccounts() {
    return this.get<Account[]>('/users/me/accounts');
  }

  /**
   * Retrive personal information about the currently authenticated user.
   */
  whoami() {
    return this.get<User>('/users/me');
  }

  /**
   * List of friends of the currently authenticated user.
   */
  myFriends(): Observable<User[]> {
    return this.get<User[]>('/users/me/friends');
  }
}
