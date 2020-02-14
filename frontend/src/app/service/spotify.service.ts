import { Injectable } from '@angular/core';
import { Observable, of, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Track } from '../types/track';
import { Artist } from 'src/app/types/artist';
import { SearchResult } from '../types/search-result';
import { Album } from '../types/album';
import { AuthenticationService } from './authentication.service';
import { ProviderService } from './provider.service';
import { PlayService } from './play.service';

@Injectable({
    providedIn: 'root'
})
export class SpotifyService extends ProviderService {
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
        return this.play.getSpotifyToken();
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

        return this.get<{ genres: string[] }>(
            '/v1/recommendations/available-genre-seeds',
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
        return this.get<{ tracks }>(
            '/v1/recommendations?' + queryParams,
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
        return this.get(
            `/v1/search?q=${query}&type=${typesString}`, { headers: { Bearer: 'ta daronne' } }).pipe(
                map((data) => {
                    return {
                        tracks: !data['tracks'] ? [] : data['tracks']['items'].map(this.convertTrack),
                        artists: !data['artists'] ? [] : data['artists']['items'].map(this.convertArtist),
                        albums: !data['albums'] ? [] : data['albums']['items'].map(this.convertAlbum)
                    };
                })
            );
    }

    createPlaylist(
        playlist
    ) {
        const body = {
            name: playlist.mainContent,
            description: playlist.secondaryContent,
            public: false
        }

        let access_token = "ACCESS_TOKEN";

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            })
        };

        return this.http
            .post(environment.spotify_api_url + `/v1/users/31jo6phkrnggzi6mrb3nizitst44/playlists`, body, httpOptions)
            .subscribe(
                (data: any) => {
                    console.log(data);
                }
            );
    }

    addTrack(
        track,
        playlistID
    ) {
        let trackID = "TRACK_ID";
        let access_token = "ACCESS_TOKEN";

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            })
        };

        return this.http
            .post(environment.spotify_api_url + `/v1//playlists${playlistID}/tracks?uris=spotify%3Atrack%3A/${trackID}`, {}, httpOptions)
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
