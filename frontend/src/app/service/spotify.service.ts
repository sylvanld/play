import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { Track } from '../types/track';
import { Artist } from 'src/app/types/artist';
import { SearchResult } from '../types/search-result';
import { Album } from '../types/album';
import { Playlist } from 'src/app/types/playlist';

@Injectable({
    providedIn: 'root'
})
export class SpotifyService {
    private spotifyAuthHeaders: { headers: { Authorization: string } } = null;
    private genres: Array<string> = null;
    private availableGenres: string[] = null;


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
        const track = {
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
        console.log('track');
        return track;
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
        if (this.availableGenres) {
            return of(this.availableGenres);
        }

        return this.http.get<{ genres: string[] }>(
            'https://api.spotify.com/v1/recommendations/available-genre-seeds',
            this.spotifyAuthHeaders
        ).pipe(
            map((resp: { genres: string[] }) => {
                return this.availableGenres = resp.genres;
            })
        )
    }

    searchGenre(query: string): Observable<string[]> {
        return this.getAvailableGenres().pipe(
            map((genres: string[]) => genres.filter(genre => genre.startsWith(query)))
        )
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
        )
    }

    searchTrack(query: string): Observable<Track[]> {
        return this.search(query, ['track']).pipe(
            map(
                (results: SearchResult) => {
                    return results.tracks || [];
                }
            )
        )
    }

    suggestions(queryParams: string): Observable<SearchResult> {
        return this.http.get<{ tracks }>(
            environment.spotify_api_url + '/v1/recommendations?' + queryParams,
            this.spotifyAuthHeaders
        ).pipe(map(
            ({ tracks }) => {
                return {
                    artists: [],
                    albums: [],
                    tracks: tracks.map(track => this.convertTrack(track))
                }
            }
        ));
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

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    export(
        playlist: Playlist[]
    ) {
        console.log("here 1");
        console.log(environment.spotify_api_url);
        console.log(playlist);

        const body = {
            name: "Djamilba Creation",
            description: "Mes tests avec Angular",
            public: false
        }

        const httpOptions_ = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer BQDAdJFIyHSQsyjzw2y9Ja_I4snU4-0nSpatQIq4kAb26cm7663bFkx6pySoad85fs4zCZi1BQk7joOS8Te7zPiIH8kmHy1qwS0VHDTrjo2Q4UQ4zh96dvbRRsNKGoiGEs0xdqKiZAVH3XWpokEZ2J3GrysppC0KX-2k_176Yf7twjbjnweWm0yLdLZ8Rg9hK5omPLQvHuML-OyFt_lEVagZBzEr1B5zr21MuylxxOW6Hd-bSg'
            })
        };

        const headers = new HttpHeaders()
            .set('Authorization', 'Bearer BQDAdJFIyHSQsyjzw2y9Ja_I4snU4-0nSpatQIq4kAb26cm7663bFkx6pySoad85fs4zCZi1BQk7joOS8Te7zPiIH8kmHy1qwS0VHDTrjo2Q4UQ4zh96dvbRRsNKGoiGEs0xdqKiZAVH3XWpokEZ2J3GrysppC0KX-2k_176Yf7twjbjnweWm0yLdLZ8Rg9hK5omPLQvHuML-OyFt_lEVagZBzEr1B5zr21MuylxxOW6Hd-bSg')
            .set('Accept', 'application/json')
            .set('Content-type', 'application/json');

        console.log(headers);
        console.log("separation");

        return this.http
            .post(environment.spotify_api_url + `/v1/users/31jo6phkrnggzi6mrb3nizitst44/playlists`, body, httpOptions_)
            .subscribe(
                (data: any) => {
                    console.log(data);
                }
            );
    }
}
// "https://api.spotify.com/v1/users/thelinmichael/playlists"
//  -H "Authorization: Bearer {your access token}"
//  -H "Content-Type: application/json"
//  --data "{\"name\":\"A New Playlist\", \"public\":false}"
