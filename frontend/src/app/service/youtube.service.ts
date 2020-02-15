import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Track } from '~types/track';
import { environment } from 'src/environments/environment';
import { ProviderService } from './provider.service';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService extends ProviderService {

  constructor(protected http: HttpClient) {
    super(
      http,
      environment.youtube_api_url,
      { type: 'queryparam', key: 'key' },
      [401, 403]
    );
  }

  renewToken(): Observable<string> {
    return of(environment.youtube_api_keys[0]);
  }

  searchTrack(query: string) {
    return this.get('/search?type=video&part=snippet&order=relevance&maxResults=1&q=' + query);
  }

  /**
   * Deprecated use playservice.completeExternalIds instead
   * @param track
   */
  completeId(track: Track): Observable<Track> {
    if (!!track.external_ids.youtube) {
      return of(track);
    }

    return this.searchTrack(
      track.artist + ' - ' + track.title
    ).pipe(map((object: any) => {
      track.external_ids.youtube = object.items[0].id.videoId;
      // TODO: save the YT
      return track;
    }));
  }
}
