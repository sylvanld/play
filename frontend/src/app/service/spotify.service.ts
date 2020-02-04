import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
    this.http.get(environment.play_api_url + '/spotify/token')
      .subscribe((resp: { access_token: string }) => {
        this.spotifyAuthHeaders = {
          headers: {
            Authorization: 'Bearer ' + resp.access_token
          }
        };
      });
  }

  getGenres(): Observable<Array<string>> {
    if (this.genres === null) {
      return this.http.get<Array<string>>(
        environment.spotify_api_url + '/v1/recommendations/available-genre-seeds',
        this.spotifyAuthHeaders
      ).pipe(
        map(
          (genres: Array<string>) => {
            this.genres = genres;
            return genres;
          }
        )
      );
    } else {
      // utilise les genres mis en caches pour les requetes suivantes
      return of(this.genres);
    }
  }
}
