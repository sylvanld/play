import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DeezerTrack, DeezerAlbum, DeezerArtist, DeezerGlobalSearchResult, DeezerSearchResult } from '~types/deezer';
import { environment } from 'src/environments/environment';


@Injectable()
export class DeezerService {
  private DEEZER_API_URL = environment.deezer_api_url;
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

  createPlaylist(
    playlist
  ) {
    const user_ID = "USER_ID";
    let access_token = "ACCESS_TOKEN";

    const body = {
      name: playlist.mainContent,
      description: playlist.secondaryContent,
      public: false
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      })
    };

    return this.http
      .post(this.DEEZER_API_URL + `/user/${user_ID}`, body, httpOptions)
      .subscribe(
        (data: any) => {
          console.log(data);
        }
      );
  }

  addTrack(track) {
    const playlist_ID = "USER_ID";
    let access_token = "ACCESS_TOKEN";

    const body = {
      songs: "TRACK_ID"
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      })
    };

    return this.http
      .post(this.DEEZER_API_URL + `/playlist/${playlist_ID}/tracks`, body, httpOptions)
      .subscribe(
        (data: any) => {
          console.log(data);
        }
      );
  }
}
