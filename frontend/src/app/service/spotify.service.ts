import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { ProviderService } from './provider.service';

import { Album, Artist, SearchResult, Track, SpotifyTrack } from '~types/index';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService extends ProviderService {

  private spotifyAuthHeaders: { headers: { Authorization: string } } = null;
  private genres: Array<string> = null;
  private availableGenres: string[] = null;


  constructor(
    protected http: HttpClient,
    private auth: AuthenticationService
  ) {
    super(http, environment.spotify_api_url, { type: 'bearer' });
  }

  renewToken(): Observable<string> {
    return this.auth.getSpotifyToken();
  }

  getGenres(): Observable<Array<string>> {
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
      artists: spotifyAlbum['artists'].map(artist => artist.name),
      cover: n === -1 ? null : spotifyAlbum['images'][n]['url']
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

  getAvailableGenres(): Observable<string[]> {
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

  getTracksByIds(tracksIds: Array<string>): Observable<Track[]> {
    return this.get('/v1/tracks/?ids=' + tracksIds.join(',')).pipe(
      map(
        (results: { tracks: SpotifyTrack[] }) => {
          return results.tracks.map(this.convertTrack);
        }
      )
    )
  }

  getAlbumTracks(albumId: string): Observable<SearchResult> {
    return this.get(`/v1/albums/${albumId}/tracks`)
      .pipe(
        flatMap((resp: { items: Array<SpotifyTrack> }) => {
          const tracksIds = resp.items.map(item => item.id);
          return this.getTracksByIds(tracksIds).pipe(
            map((tracks: Track[]) => ({ tracks: tracks, artists: [], albums: [] }))
          );
        })
      );
  }

  suggestions(queryParams: string): Observable<SearchResult> {
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

  getNewReleases(): Observable<SearchResult> {
    return this.get('/v1/browse/new-releases').pipe(
      map(data => {
        return {
          tracks: [],
          artists: [],
          albums: data['albums']['items'].map(this.convertAlbum)
        }
      })
    )
  }

}
