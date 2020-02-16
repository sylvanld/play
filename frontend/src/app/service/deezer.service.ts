import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProviderService } from './provider.service';
import { AuthenticationService } from './authentication.service';

import {
  DeezerTrack, DeezerSearchResult,
  DeezerArtist, DeezerAlbum,
  DeezerGlobalSearchResult
} from '~types/index';

@Injectable({
  providedIn: 'root'
})
export class DeezerService extends ProviderService {

  constructor(
    protected http: HttpClient,
    private auth: AuthenticationService
  ) {
    super(
      http,
      environment.deezer_api_url,
      { type: 'queryparam', key: 'key' },
      [401]
    );
  }

  renewToken(): Observable<string> {
    // return this.auth.getDeezerToken();
    throw Error('Not implemented Error');
  }

  search(query: string): Observable<DeezerGlobalSearchResult> {
    return forkJoin([
      this.searchTrack(query),
      this.searchArtist(query),
      this.searchAlbum(query)
    ]).pipe(map(data => {
      return {
        tracks: data[0],
        artists: data[1],
        albums: data[2]
      };
    }));
  }

  searchTrack(query: string): Observable<Array<DeezerTrack>> {
    // @ts-ignore
    return this.http.get<DeezerSearchResult>('/search/track?q=' + encodeURIComponent(query)
    ).pipe(map(
      (result: DeezerSearchResult) => {
        return result.data;
      }
    ));
  }

  searchArtist(query: string): Observable<Array<DeezerArtist>> {
    // @ts-ignore
    return this.http.get<DeezerSearchResult>('/search/artist?q=' + encodeURIComponent(query)
    ).pipe(map(
      (result: DeezerSearchResult) => {
        return result.data;
      }
    ));
  }

  searchAlbum(query: string): Observable<Array<DeezerAlbum>> {
    // @ts-ignore
    return this.http.get<DeezerSearchResult>('/search/album?q=' + encodeURIComponent(query)
    ).pipe(map(
      (result: DeezerSearchResult) => {
        return result.data;
      }
    ));
  }
}
