import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Observer, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { StorageService } from './storage.service';
import { map } from 'rxjs/operators';

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

  getSpotifyToken(): Observable<string> {
    return this.post('/spotify/token', {})
      .pipe(map(({ access_token }) => access_token));
  }

  myAccounts() {
    return this.get('/users/me/accounts');
  }
}
