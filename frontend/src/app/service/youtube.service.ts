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

class KeyStore {
  // token is OP for 24 hours
  private lifetime = 1000 * 60 * 60 * 24;
  private apiKeys: string[] = [];
  private timestamps: number[] = [];
  private currentToken: string = null;

  constructor(api_keys: string[]) {
    this.apiKeys = api_keys;
    this.timestamps = this.apiKeys.map(data => new Date().getTime() - this.lifetime);
  }


  getSortedTokens(): string[] {
    return this.apiKeys.sort((tokenA: string, tokenB: string) => {
      const tA = this.timestamps[this.apiKeys.indexOf(tokenA)];
      const tB = this.timestamps[this.apiKeys.indexOf(tokenB)];

      if (tA === tB) {
        return 0;
      } else if (tA > tB) {
        return -1;
      } else {
        return 1;
      }
    })
  }

  getValidToken(): Observable<string> {
    const sortedTokens = this.getSortedTokens();
    this.currentToken = sortedTokens[0];
    console.log('set new token for youtube', this.currentToken);
    return of(this.currentToken);
  }

  notifyTokenExpired() {
    if (!!this.currentToken) {
      // notify that token is not valid at this time
      const i = this.apiKeys.indexOf(this.currentToken);
      this.timestamps[i] = new Date().getTime();
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeService extends ProviderService {
  private keyStore = new KeyStore(environment.youtube_api_keys);

  constructor(protected http: HttpClient) {
    super(
      http,
      environment.youtube_api_url,
      { type: 'queryparam', key: 'key' },
      [401, 403]
    );
  }

  renewToken(): Observable<string> {
    console.log('error, must renew token');
    this.keyStore.notifyTokenExpired();
    return this.keyStore.getValidToken();
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
