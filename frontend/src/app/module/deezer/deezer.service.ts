import { DeezerSearchResult } from './deezer-search-result';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DeezerTrack } from './deezer-track';
import { DeezerAlbum } from './deezer-album';
import { DeezerArtist } from './deezer-artist';
import { DeezerGlobalSearchResult } from './deezer-global-search-result';


@Injectable({
  providedIn: 'root'
})
export class DeezerService {
  private DEEZER_API_URL = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com';
  constructor(private http: HttpClient) { }

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
    return this.http.get<DeezerSearchResult>(
      this.DEEZER_API_URL + '/search/track?q=' + encodeURIComponent(query)
    ).pipe(map(
      (result: DeezerSearchResult) => {
        return result.data;
      }
    ));
  }

  searchArtist(query: string): Observable<Array<DeezerArtist>> {
    return this.http.get<DeezerSearchResult>(
      this.DEEZER_API_URL + '/search/artist?q=' + encodeURIComponent(query)
    ).pipe(map(
      (result: DeezerSearchResult) => {
        return result.data;
      }
    ));
  }

  searchAlbum(query: string): Observable<Array<DeezerAlbum>> {
    return this.http.get<DeezerSearchResult>(
      this.DEEZER_API_URL + '/search/album?q=' + encodeURIComponent(query)
    ).pipe(map(
      (result: DeezerSearchResult) => {
        return result.data;
      }
    ));
  }
}
