import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PlayService } from './play.service';
import { Playlist } from '~types/playlist';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyUserService extends ProviderService {

  constructor(protected http: HttpClient, private play: PlayService) {
    super(http, environment.spotify_api_url, { type: 'bearer' });
  }

  renewToken() {
    return this.play.getSpotifyUserToken();
  }

  createPlaylist(playlist: Playlist): any {
    const userID = '31jo6phkrnggzi6mrb3nizitst44';

    const body = {
      name: playlist.title,
      description: 'Create by ' + playlist.author,
      public: false
    };

    return this.post(`/v1/users/${userID}/playlists`, body)
      .pipe(map(data => data));
  }

  addTrack(playlistID, track) {
    this.post(environment.spotify_api_url + `/v1//playlists${playlistID}/tracks?uris=spotify%3Atrack%3A/${track.identifier.spotify}`, {})
      .subscribe(
        (data: any) => {
          console.log(data);
        }
      );
  }
}
