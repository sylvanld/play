import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Observer, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { StorageService } from './storage.service';
import { map } from 'rxjs/operators';
import { Track } from '~types/track';

@Injectable({
  providedIn: 'root'
})
export class PlayService extends ProviderService {
  constructor(
    protected http: HttpClient,
    private auth: AuthenticationService,
    private store: StorageService
  ) {
    super(http, environment.play_api_url, { type: 'bearer' });
  }

  /**
   * Method to implement when a service inherit of Provider.
   * It is called when a query receive a 401 error status.
   */
  renewToken(): Observable<string> {
    const refreshToken = this.store.get('REFRESH_TOKEN');
    return Observable.create((observer: Observer<string>) => {
      this.auth.refreshToken().subscribe(
        success => {
          observer.next(this.auth.getToken());
          observer.complete();
        }
      )
    })
  }

  /**
   * Call play backend to get a spotify application token.
   */
  getSpotifyToken(): Observable<string> {
    return this.post('/spotify/token', {})
      .pipe(map(({ access_token }) => access_token));
  }

  /**
   * Register association between an isrc and an external Id
   */
  registerExternalId(track: Track, externalIds: { spotify?, deezer?, youtube?}) {

  }

  /**
   * List accounts of the currently authenticated user.
   */
  myAccounts() {
    return this.get('/users/me/accounts');
  }
}
