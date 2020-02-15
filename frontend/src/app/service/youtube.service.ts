import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Track } from '~types/track';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  // tslint:disable-next-line: max-line-length
  readonly searchUrl = (apiKey, query) => 'https://www.googleapis.com/youtube/v3/search?key=' + apiKey + '&type=video&part=snippet&order=relevance&maxResults=10&q=' + query;

  constructor(private http: HttpClient) { }

  searchTrack(query: string) {
    return this.http.get(this.searchUrl('AIzaSyB-t7E-THHu2fG8nOhW9nuWUIAwQhjljbQ', query));
  }

  completeId(track: Track): Observable<Track> {
    if (!!track.external_ids.youtube) {
      return of(track);
    }

    const o = this.http.get(
      environment.youtube_api_url + '/search' +
      '?key=' + environment.youtube_api_key +
      '&type=video&part=snippet&order=relevance&maxResults=1' +
      '&q=' + track.artist + ' - ' + track.title
    ).pipe(map((object: any) => {
      track.external_ids.youtube = object.items[0].id.videoId;
      return track;
    }));

    // TODO: save the YT
    return o;
  }
}
