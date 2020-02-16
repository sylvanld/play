import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Track } from '~types/index';
import { environment } from 'src/environments/environment';
import { ProviderService } from './provider.service';

// TODO: move to ~types/
interface YoutubeResult {
  items: {
    id: {
      videoId: string;
    }
  }[];
}

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

  completeExternalId(track: Track): Observable<Track> {
    return this.searchTrack(encodeURIComponent(`${track.title} - ${track.artist}`))
      .pipe(
        map((result: YoutubeResult) => {
          track.external_ids.youtube = result.items[0].id.videoId;
          return track;
        })
      );
  }

  /**
   * Complete YT id from a Track.
   * @param track: The track object.
   * @deprecated Use playservice.completeExternalIds instead
   */
  completeId(track: Track): Observable<Track> {
    if (!!track.external_ids.youtube) {
      return of(track);
    }

    return this.searchTrack(
      track.artist + ' - ' + track.title
    ).pipe(map((object: any) => {
      track.external_ids.youtube = object.items[0].id.videoId;
      return track;
    }));
  }
}
