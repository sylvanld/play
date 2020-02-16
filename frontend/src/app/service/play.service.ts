import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, forkJoin, of, from, concat, merge } from 'rxjs';
import { map, flatMap, mergeMap, concatAll, filter, mergeAll, pluck } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { ProviderService } from './provider.service';
import { StorageService } from './storage.service';

import { environment } from 'src/environments/environment';
import { Track, Account, User, Playlist } from '~types/index';

import { YoutubeService } from './youtube.service';
import { DeezerUserService } from './deezer-user.service';
import { SpotifyUserService } from './spotify-user.service';
import { PlaylistsService } from './playlists.service';

@Injectable({
  providedIn: 'root'
})
export class PlayService extends ProviderService {

  private _accounts: Account[];

  constructor(
    protected http: HttpClient,
    private auth: AuthenticationService,
    private store: StorageService,
    private youtube: YoutubeService,
    private deezer: DeezerUserService,
    private spotify: SpotifyUserService,
    private playlist: PlaylistsService
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
    // TODO: this.put(`/tracks/isrc/${track.isrc}`, externalIds);
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
  myAccounts(): Observable<Account[]> {
    if (this._accounts) {
      return of(this._accounts);
    }
    return this.get<Account[]>('/users/me/accounts').pipe(
      map((accounts: Account[]) => {
        this._accounts = accounts;
        return accounts;
      })
    );
  }

  /**
   * Retrive personal information about the currently authenticated user.
   */
  whoami() {
    return this.get<User>('/users/me');
  }

  /**
   * Retrive the user.
   */
  whois(id: string) {
    return this.get<User>(`/users/${id}`);
  }

  /**
   *
   */
  getUsers() {
    return this.get<User[]>('/users');
  }

  /**
   * List of Accepted/Pending request of firends.
   */
  myRequestFriendships(): Observable<any> {
    return this.get<any>('/users/me/friendships');
  }

  inviteFriend(me: string, userId: string): Observable<any> {
    return this.post<any>('/friendships', { friend1: me, friend2: userId });
  }

  acceptFriendship(id): Observable<any> {
    return this.put<any>(`/friendships/${id}`, { accepted: true });
  }

  rejectOrDeleteFriendship(id): Observable<any> {
    return this.delete<any>(`/friendships/${id}`);
  }

  /**
   * List of friends of the currently authenticated user.
   */
  myFriends(): Observable<User[]> {
    return this.get<User[]>('/users/me/friends');
  }

  /**
   * Retreive external playlists of the currently authenticated user.
   * @note rxjs @6.5.0 is required
   */
  getExternalPlaylists(): Observable<{ deezer?: Playlist[], spotify?: Playlist[] }> {

    return this.myAccounts()
      .pipe(flatMap(
        (accounts: Account[]) => {
          const join = { deezer: of([]), spotify: of([]) };
          for (const account of accounts) {
            if (account.provider === 'DEEZER') {
              join.deezer = this.deezer.getPlaylists();
            } else if (account.provider === 'SPOTIFY') {
              join.spotify = this.spotify.getPlaylists();
            }
          }
          return forkJoin(join);
        }
      ));
  }

  /**
   * Retreive playlists of the currently authenticated user.
   */
  getPlaylists(): Observable<Playlist[]> {
    // TODO: this.get<Playlist[]>('/users/me/playlists')
    return of([]);
  }

  /**
   * Create an external playlist from the given.
   */
  createExternalPlalist(playlist: Playlist, destination: 'DEEZER' | 'SPOTIFY') {
    // TODO: map deezer and spotify services
  }

  /**
   * Create a playlist from the given.
   * @param playlist: The given playlist to create.
   * @param source: The source where the play come from.
   */
  createPlaylist(playlist: Playlist, source: 'PLAY' | 'DEEZER' | 'SPOTIFY'): Observable<Playlist> {
    // TODO: this.post<>('/users/me/playlists')
    // TODO: this.post<>('/users/me/playlists/{id}/tracks)

    return of(playlist).pipe(
      flatMap(
        (_playlist: Playlist) => {
          if (source === 'DEEZER') {
            return this.deezer.getPlaylistTracks(_playlist.id);
          }
          if (source === 'SPOTIFY') {
            return this.spotify.getPlaylistTracks(_playlist.id);
          }
          return of([]);
        }
      ),
      map(
        (tracks: Track[]) => {
          playlist.tracks = tracks;
          this.playlist.create(playlist);
          return playlist;
        }
      )
    );
  }

  /**
   *
   */
  createPlaylists(playlists: { deezer?: Playlist[], spotify?: Playlist[], play?: Playlist[] }): Observable<Playlist[]> {
    // avoir empty param, and obviously, dont check if key is missing with 'if'...
    const _playlist = Object.assign(
      { deezer: [], spotify: [], play: [] },
      playlists
    );
    const requests: Observable<Playlist>[] = [];

    for (const playlist of _playlist.deezer) {
      requests.push(this.createPlaylist(playlist, 'DEEZER'));
    }
    for (const playlist of _playlist.spotify) {
      requests.push(this.createPlaylist(playlist, 'SPOTIFY'));
    }
    for (const playlist of _playlist.play) {
      requests.push(this.createPlaylist(playlist, 'PLAY'));
    }
    return forkJoin(requests);
  }
}
