import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { HttpClient } from '@angular/common/http';
import { PlayService } from './play.service';
import { environment } from 'src/environments/environment';
import { Playlist } from '~types/playlist';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeezerUserService extends ProviderService {

  constructor(protected http: HttpClient, private play: PlayService) {
    super(http, environment.deezer_api_url, { type: 'bearer' });
  }

  renewToken() {
    return this.play.getDeezerUserToken();
  }

  createPlaylist(playlist: Playlist): any {
    const userID = '3452495304';

    const body = {
      title: playlist.title,
      public: false
    };

    return this.post(`/user/${userID}/playlists`, body)
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
