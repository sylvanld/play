import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
}
