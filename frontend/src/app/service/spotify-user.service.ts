import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Observable, forkJoin } from 'rxjs';
import { map, flatMap, mergeMap } from 'rxjs/operators';
import { ProviderService } from './provider.service';
import { AuthenticationService } from './authentication.service';

import { Playlist, Track, SearchResult, SpotifyPlaylist, SpotifyTrack, PagingObject, SpotifyTrackResult } from '~types/index';

const SPOTIFY_MAX_LIMIT = 50;

@Injectable({
  providedIn: 'root'
})
export class SpotifyUserService extends ProviderService {

  constructor(protected http: HttpClient, private auth: AuthenticationService) {
    super(http, environment.spotify_api_url, { type: 'bearer' });
  }

  renewToken() {
    return this.auth.getSpotifyUserToken();
  }

  /**
   * TODO: search the track with the irsc. Google it!
   * @param track The given track.
   */
  completeExternalId(track: Track): Observable<Track> {
    return this.get<any>(`/v1/search?type=track&q=isrc:${track.isrc}`)
      .pipe(
        map((data) => {
          track.external_ids.spotify = this.convertTrack(data.tracks.items[0]).external_ids.spotify;
          return track;
        })
      );
  }

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
      isrc: track.external_ids.isrc,
      title: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      release: track.album.release_date,
      external_ids: {
        spotify: track.id,
        youtube: undefined,
        deezer: undefined
      }
    };
  }

  /**
   * Retrieved a all items by chuncks at a given endpoint.
   * @param uri: The given endpoint.
   */
  getAllItems<T>(uri: string): Observable<T[]> {
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
    return this.getAllItems<SpotifyTrackResult>(`/v1/playlists/${id}/tracks`)
      .pipe(map(
        (object: SpotifyTrackResult[]): Track[] => {
          return object.map(({ track }) => this.convertTrack(track));
        })
      );
  }

  //////////////////////////////////////////////////////////

  createPlaylist(playlist: Playlist): any {
    const body = {
      name: playlist.title,
      description: 'Created by ' + playlist.author,
      public: false
    };

    return this.post(`/v1/me/playlists`, body)
      .pipe(map(data => data));
  }

  addTrack(playlistID, track) {
    return this.completeExternalId(track).pipe(
      mergeMap(
        track_ => this.post(`/v1/playlists/${playlistID}/tracks?uris=spotify%3Atrack%3A${track_.external_ids.spotify}`, {})
      ))
  }
}
