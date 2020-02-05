import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Track } from '~types/track';
import { Artist } from '~types/artist';
import { Album } from '~types/album';
import { SearchResult } from '~types/search-result';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private spotifyAuthHeaders: { headers: { Authorization: string } } = null;
  private genres: Array<string> = null;

  constructor(private http: HttpClient) {
    this.getApplicationToken();
  }

  getApplicationToken() {
    this.http.get(environment.play_api_url + '/spotify/token').subscribe((resp: { access_token: string }) => {
      this.spotifyAuthHeaders = {
        headers: {
          Authorization: 'Bearer ' + resp.access_token
        }
      };
    });
  }

  getGenres(): Observable<Array<string>> {
    if (this.genres === null) {
      return this.http
        .get<Array<string>>(
          environment.spotify_api_url + '/v1/recommendations/available-genre-seeds',
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

  convertTrack(spotifyTrack): Track {
    return {
      isrc: spotifyTrack['external_ids']['isrc'],
      title: spotifyTrack['name'],
      artist: spotifyTrack['artists'][0]['name'],
      album: spotifyTrack['album']['name'],
      release: spotifyTrack['album']['release_date'],
      external_ids: {
        spotify: spotifyTrack['id'],
        youtube: null,
        deezer: null
      }
    };
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

  search(
    query: string,
    types: Array<'track' | 'album' | 'artist'> = ['track', 'album', 'artist']
  ): Observable<SearchResult> {
    const typesString = types.join(',');
    return this.http
      .get(environment.spotify_api_url + `/v1/search?q=${query}&type=${typesString}`, this.spotifyAuthHeaders)
      .pipe(
        map((data) => {
          return {
            tracks: !data['tracks'] ? [] : data['tracks']['items'].map(this.convertTrack),
            artists: !data['artists'] ? [] : data['artists']['items'].map(this.convertArtist),
            albums: !data['albums'] ? [] : data['albums']['items'].map(this.convertAlbum)
          };
        })
      );
  }
}
