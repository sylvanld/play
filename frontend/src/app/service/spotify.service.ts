import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, Observer, forkJoin } from 'rxjs';
import { map, mergeMap, flatMap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { ProviderService } from './provider.service';
import { PlayService } from './play.service';

import {
  Album, Artist, SearchResult, Track, Playlist,
  SpotifyPlaylist, SpotifyTrack, PagingObject, SpotifyTrackObject
} from '~types/index';

const SPOTIFY_MAX_LIMIT = 50;
@Injectable({
  providedIn: 'root'
})
export class SpotifyService extends ProviderService {
  private _scope: 'application' | 'user' = 'application';

  private spotifyAuthHeaders: { headers: { Authorization: string } } = null;
  private genres: Array<string> = null;
  private availableGenres: string[] = null;


  constructor(
    protected http: HttpClient,
    private auth: AuthenticationService,
    private play: PlayService
  ) {
    super(http, environment.spotify_api_url, { type: 'bearer' });
  }

  renewToken(): Observable<string> {
    return this._scope === 'application'
      ? this.play.getSpotifyToken()
      : this.play.getSpotifyUserToken();
  }

  getGenres(): Observable<Array<string>> {
    // 1. set the proper scope.
    this._scope = 'application';

    if (this.genres === null) {
      return this.get<Array<string>>(
        '/v1/recommendations/available-genre-seeds',
        this.spotifyAuthHeaders
      )
        .pipe(
          map((genres: Array<string>) => {
            this.genres = genres;
            return genres;
          })
        );
    } else {
      // utilise les genres mis en caches pour les requetes suivantes
      return of(this.genres);
    }
  }

  convertArtist(spotifyArtist): Artist {
    const n = Math.min(spotifyArtist['images'].length, 2) - 1;
    return {
      id: spotifyArtist['id'],
      name: spotifyArtist['name'],
      picture: n === -1 ? null : spotifyArtist['images'][n]['url'],
      genres: spotifyArtist['genres']
    };
  }

  convertAlbum(spotifyAlbum): Album {
    const n = Math.min(spotifyAlbum['images'].length, 2) - 1;
    return {
      id: spotifyAlbum['id'],
      name: spotifyAlbum['name'],
      date: spotifyAlbum['release_date'],
      cover: n === -1 ? null : spotifyAlbum['images'][n]['url']
    };
  }

  getAvailableGenres(): Observable<string[]> {
    // 1. set the proper scope.
    this._scope = 'application';

    if (this.availableGenres) {
      return of(this.availableGenres);
    }

    return this.get<{ genres: string[] }>(
      '/v1/recommendations/available-genre-seeds',
      this.spotifyAuthHeaders
    ).pipe(
      map((resp: { genres: string[] }) => {
        return this.availableGenres = resp.genres;
      })
    );
  }

  searchGenre(query: string): Observable<string[]> {
    return this.getAvailableGenres().pipe(
      map((genres: string[]) => genres.filter(genre => genre.startsWith(query)))
    );
  }

  searchArtist(query: string): Observable<Artist[]> {
    return this.search(query, ['artist']).pipe(
      map(
        (results: SearchResult) => {
          return results.artists || [];
        }
      )
    );
  }

  searchAlbum(query: string): Observable<Album[]> {
    return this.search(query, ['album']).pipe(
      map(
        (results: SearchResult) => {
          return results.albums || [];
        }
      )
    );
  }

  searchTrack(query: string): Observable<Track[]> {
    return this.search(query, ['track']).pipe(
      map(
        (results: SearchResult) => {
          return results.tracks || [];
        }
      )
    );
  }

  suggestions(queryParams: string): Observable<SearchResult> {
    // 1. set the proper scope.
    this._scope = 'application';

    return this.get<{ tracks }>(
      '/v1/recommendations?' + queryParams,
      this.spotifyAuthHeaders
    ).pipe(map(
      ({ tracks }) => {
        return {
          artists: [],
          albums: [],
          tracks: tracks.map(track => this.convertTrack(track))
        };
      }
    ));
  }

  search(
    query: string,
    types: Array<'track' | 'album' | 'artist'> = ['track', 'album', 'artist']
  ): Observable<SearchResult> {
    // 1. set the proper scope.
    this._scope = 'application';

    const typesString = types.join(',');
    return this.get(
      `/v1/search?q=${query}&type=${typesString}`).pipe(
        map((data) => {
          return {
            tracks: !data['tracks'] ? [] : data['tracks']['items'].map(this.convertTrack),
            artists: !data['artists'] ? [] : data['artists']['items'].map(this.convertArtist),
            albums: !data['albums'] ? [] : data['albums']['items'].map(this.convertAlbum)
          };
        })
      );
  }
  //////////////////////////////////////////////////////////////

  convertPlaylist(playlist: SpotifyPlaylist): Playlist {
    return {
      id: playlist.id,
      cover: playlist.images.length > 0 ? playlist.images[0].url : '',
      title: playlist.name,
      author: playlist.owner.display_name,
      tracks: []
    };
  }

  convertTrack(track: SpotifyTrack): Track {
    return {
      isrc: track.external_ids.irsc,
      title: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      release: track.album.release_date,
      external_ids: {
        spotify: track.id,
        youtube: null,
        deezer: null
      }
    };
  }


  //////////////////////////////////////////////////////////////

  /**
   * Retrieved a all items by chuncks at a given endpoint.
   * @param uri: The given endpoint.
   */
  getAllItems<T>(uri: string): Observable<T[]> {
    this._scope = 'user';

    return this.get(uri + '?offset=0&limit=1')
      .pipe(
        flatMap((result: PagingObject) => {
          const requests = [];
          for (let offset = 0; offset < result.total; offset += SPOTIFY_MAX_LIMIT) {
            requests.push(
              this.get(`${uri}?offset=${offset}&limit=${SPOTIFY_MAX_LIMIT}`)
            );
          }
          return forkJoin(requests);
        }),
        map((results: PagingObject[]) => {
          const items: T[] = [];
          for (const result of results) {
            items.push(...result.items);
          }
          return items;
        })
      );
  }

  /**
   * Retrieve current Playlists for the authenticated User.
   * @link https://developer.spotify.com/documentation/web-api/reference/playlists/get-a-list-of-current-users-playlists/
   */
  getPlaylists(): Observable<Playlist[]> {
    // 2. get user's spotify playlists.
    return this.getAllItems<SpotifyPlaylist>('/v1/me/playlists')
      .pipe(map(
        (playlists: SpotifyPlaylist[]): Playlist[] => {
          return playlists.map((playlist) => this.convertPlaylist(playlist));
        })
      );
  }

  /**
   * Retrieve tracks from the given playlist id.
   * @param id: A playlist ID.
   * @link https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks
   */
  getPlaylistTracks(id: string): Observable<Track[]> {
    return this.getAllItems<SpotifyTrackObject>(`/v1/playlists/${id}/tracks`)
      .pipe(map(
        (object: SpotifyTrackObject[]): Track[] => {
          return object.map(({ track }) => this.convertTrack(track));
        })
      );
  }
}
