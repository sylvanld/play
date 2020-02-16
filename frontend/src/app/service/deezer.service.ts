import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProviderService } from './provider.service';
import { PlayService } from './play.service';

import {
  Track, Playlist, DeezerPlaylist,
  DeezerTrack, DeezerSearchResult,
  DeezerArtist, DeezerAlbum,
  DeezerGlobalSearchResult
} from '~types/index';
import { AuthenticationService } from './authentication.service';

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
    return this.auth.getDeezerUserToken();
  }

  completeExternalId(track: Track): Observable<Track> {
    return this.get<DeezerSearchResult>('/search/track?q=' + encodeURIComponent(track.title + ' ' + track.artist))
      .pipe(
        map((data) => {
          track.external_ids.deezer = this.convertTrack(data[0].track).external_ids.deezer;
          return track;
        })
      );
  }

  /**
   * Convert a playlist from Deezer to Play.
   */
  convertPlaylist(playlist: DeezerPlaylist): Playlist {
    return {
      id: playlist.id,
      cover: playlist.picture_medium,
      title: playlist.title,
      author: playlist.creator.name,
      tracks: []
    };
  }

  /**
   * Convert a track from Deezer to Play.
   */
  convertTrack(track: DeezerTrack): Track {
    return {
      isrc: '', // no info
      title: track.title,
      artist: track.artist.name,
      album: track.album.title,
      release: '', // no info
      external_ids: {
        spotify: undefined,
        youtube: undefined,
        deezer: track.id
      }
    };
  }

  /**
   * Retrieve current Playlists for the authenticated User.
   * @link https://developers.deezer.com/api/user/playlists
   */
  getPlaylists(): Observable<Playlist[]> {
    return this.get<DeezerPlaylist[]>('/user/me/playlists')
      .pipe(map(
        (playlists: DeezerPlaylist[]): Playlist[] => {
          console.log(playlists);
          return playlists.map(playlist => this.convertPlaylist(playlist));
        })
      );
  }

  getPlaylistTracks(id: string): Observable<Track[]> {
    return this.get<DeezerSearchResult>(`/playlist/${id}/tracks`)
      .pipe(map(
        ({ data }): Track[] => {
          return data.map((track: DeezerTrack) => this.convertTrack(track));
        }
      ));
  }

  /////////////////////////////////
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
