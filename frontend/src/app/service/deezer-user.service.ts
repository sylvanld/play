import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { map, mergeMap, flatMap } from 'rxjs/operators';
import { ProviderService } from './provider.service';
import { AuthenticationService } from './authentication.service';

import { Playlist, Track, DeezerSearchResult, DeezerPlaylist, DeezerTrack } from '~types/index';
import { Observable, of, forkJoin, merge } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeezerUserService extends ProviderService {

  constructor(
    protected http: HttpClient,
    private auth: AuthenticationService) {
    super(http, environment.deezer_api_url, { type: 'queryparam', key: 'access_token' });
  }

  renewToken() {
    return this.auth.getDeezerUserToken();
  }


  completeExternalId(track: Track): Observable<Track> {
    return this.get<DeezerTrack>('/2.0/track/isrc:' + track.isrc)
      .pipe(
        map((data) => {
          track.external_ids.deezer = this.convertTrack(data).external_ids.deezer;
          return track;
        })
      );
  }

  /**
   * Convert a playlist from Deezer to Play.
   */
  convertPlaylist(playlist: DeezerPlaylist): Playlist {
    return {
      id: `${playlist.id}`,
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
      isrc: track.isrc, // no info
      title: track.title,
      artist: track.artist.name,
      album: track.album.title,
      release: track.release_date, // no info
      external_ids: {
        spotify: undefined,
        youtube: undefined,
        deezer: `${track.id}`
      }
    };
  }

  /**
   * Retreive complete info from a track.
   * @param track: A deezer track!
   */
  getTracksInfo(request: Observable<DeezerSearchResult>): Observable<Track[]> {
    return request.pipe(
      flatMap(
        ({ data }: DeezerSearchResult) => {
          const requests = [];
          for (const track of data as DeezerTrack[]) {
            requests.push(this.get(`/track/${track.id}`));
          }
          return forkJoin(requests);
        }),
      map(
        (_tracks: DeezerTrack[]) => {
          return _tracks.map((track: DeezerTrack) => this.convertTrack(track));
        })
    );
  }

  /**
   * Retrieve current Playlists for the authenticated User.
   * @link https://developers.deezer.com/api/user/playlists
   */
  getPlaylists(): Observable<Playlist[]> {
    return this.get<DeezerSearchResult>('/user/me/playlists')
      .pipe(
        map(
          ({ data }: DeezerSearchResult): Playlist[] => {
            return data.map((playlist: DeezerPlaylist) => this.convertPlaylist(playlist));
          })
      );
  }

  /**
   * Retrieve tracks from the given playlist id.
   * @param id: A playlist ID.
   * @link https://developers.deezer.com/api/playlist/tracks
   */
  getPlaylistTracks(id: string): Observable<Track[]> {
    return this.get<DeezerSearchResult>(`/playlist/${id}/tracks`)
      .pipe(
        (result) => this.getTracksInfo(result)
      );
  }

  //////////////////////////////////////////////
  createPlaylist(playlist: Playlist): any {
    // bizarrement les parametres doivent etre passes en queryparam et pas en body...
    return this.post(`/user/me/playlists?title=${playlist.title}&public=false`, {})
      .pipe(map(data => data));
  }

  addTrack(playlistID, track) {

    const body = {
      songs: track.identifier.deezer
    };

    return this.post(environment.deezer_api_url + `/playlist/${playlistID}/tracks`, body)
      .subscribe(
        (data: any) => {
          console.log(data);
        }
      );
  }
}
